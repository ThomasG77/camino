import { GraphQLResolveInfo } from 'graphql'

import { ITitre, ITitreColonneId, IToken } from '../../../types'

import { debug } from '../../../config/index'
import { titreFormat, titresFormat } from '../../_format/titres'

import { fieldsBuild } from './_fields-build'

import {
  titreCreate,
  titreGet,
  titresCount,
  titresGet,
  titreUpsert,
  titreArchive
} from '../../../database/queries/titres'
import { userGet } from '../../../database/queries/utilisateurs'

import titreUpdateTask from '../../../business/titre-update'

import { titreUpdationValidate } from '../../../business/validations/titre-updation-validate'
import { domaineGet } from '../../../database/queries/metas'
import {
  canLinkTitresFrom,
  getTitreFromTypeId
} from 'camino-common/src/permissions/titres'
import { linkTitres } from '../../../database/queries/titres-titres'

const titre = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const titre = await titreGet(id, { fields, fetchHeritage: true }, user)

    if (!titre) return null

    return titreFormat(titre, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titres = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    ids,
    perimetre,
    typesIds,
    domainesIds,
    statutsIds,
    substancesLegalesIds,
    entreprisesIds,
    substances,
    noms,
    entreprises,
    references,
    territoires,
    demandeEnCours
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreColonneId | null
    ordre?: 'asc' | 'desc' | null
    ids: string[]
    perimetre?: number[] | null
    typesIds: string[]
    domainesIds: string[]
    statutsIds: string[]
    substancesLegalesIds: string[]
    entreprisesIds: string[]
    substances: string
    noms: string
    entreprises: string
    references: string
    territoires: string
    demandeEnCours: boolean | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info).elements

    const [titres, total] = await Promise.all([
      titresGet(
        {
          intervalle,
          page,
          colonne,
          ordre,
          ids,
          perimetre,
          typesIds,
          domainesIds,
          statutsIds,
          substancesLegalesIds,
          entreprisesIds,
          substances,
          noms,
          entreprises,
          references,
          territoires,
          demandeEnCours
        },
        { fields },
        user
      ),
      titresCount(
        {
          ids,
          typesIds,
          domainesIds,
          statutsIds,
          substancesLegalesIds,
          entreprisesIds,
          substances,
          noms,
          entreprises,
          references,
          territoires,
          demandeEnCours
        },
        { fields: {} },
        user
      )
    ])

    const titresFormatted = titres && titresFormat(titres, fields)

    return {
      elements: titresFormatted,
      page,
      intervalle,
      ordre,
      colonne,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * TODO 2022-07-12 enlever cette fonction et nettoyer l'ui
 * @deprecated Not used by frontend, titreDemandeCreer is used instead
 */
const titreCreer = async (
  { titre }: { titre: ITitre },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const domaine = await domaineGet(
      titre.domaineId,
      { fields: { titresTypes: { id: {} } } },
      user
    )
    const titreType = domaine?.titresTypes.find(tt => tt.id === titre.typeId)

    if (!user || !titreType || !titreType.titresCreation)
      throw new Error('droits insuffisants')

    // insert le titre dans la base
    titre = await titreCreate(titre, { fields: {} })

    await titreUpdateTask(titre.id)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titre.id, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreModifier = async (
  { titre }: { titre: ITitre & { titreFromIds?: string[] } },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreOld = await titreGet(
      titre.id,
      { fields: { titresAdministrations: { id: {} }, demarches: { id: {} } } },
      user
    )

    if (!titreOld) throw new Error("le titre n'existe pas")

    if (!titreOld.modification) throw new Error('droits insuffisants')

    const rulesErrors = await titreUpdationValidate(titre, titreOld, user)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (!titreOld.demarches) {
      throw new Error('les démarches ne sont pas chargées')
    }

    if (canLinkTitresFrom(titre.typeId) && titre.titreFromIds === undefined) {
      throw new Error(
        'Le champ titreFromIds est obligatoire pour ce type de titre'
      )
    }

    if (titre.titreFromIds !== undefined) {
      const titresFrom = await titresGet(
        { ids: titre.titreFromIds },
        { fields: { id: {} } },
        user
      )

      if (titresFrom.length !== titre.titreFromIds.length) {
        throw new Error('droit insuffisant')
      }

      const titreFromTypeId = getTitreFromTypeId(titre.typeId)
      if (titreFromTypeId) {
        if (titresFrom.length > 1) {
          throw new Error(
            `une ${titre.typeId} ne peut avoir qu’un seul titre lié`
          )
        }
        if (titresFrom.length && titresFrom[0].typeId !== titreFromTypeId) {
          throw new Error(
            `une ${titre.typeId} ne peut-être liée qu’à une ${titreFromTypeId}`
          )
        }
      }

      await linkTitres({ linkTo: titre.id, linkFrom: titre.titreFromIds })
      delete titre.titreFromIds
    }

    const fields = fieldsBuild(info)

    // on doit utiliser upsert (plutôt qu'un simple update)
    // car le titre contient des références (tableau d'objet)
    await titreUpsert(titre, { fields })

    await titreUpdateTask(titre.id)

    const titreUpdated = await titreGet(titre.id, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreSupprimer = async ({ id }: { id: string }, context: IToken) => {
  const user = await userGet(context.user?.id)

  const titreOld = await titreGet(
    id,
    {
      fields: {
        demarches: { etapes: { id: {} } },
        activites: { id: {} }
      }
    },
    user
  )

  if (!titreOld) throw new Error("le titre n'existe pas")

  if (!titreOld.suppression) throw new Error('droits insuffisants')

  await titreArchive(id)

  return titreOld.slug
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }

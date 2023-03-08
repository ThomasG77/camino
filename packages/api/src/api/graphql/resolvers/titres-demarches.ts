import { GraphQLResolveInfo } from 'graphql'

import { ITitreDemarche, ITitreEtapeFiltre, ITitreDemarcheColonneId, Context } from '../../../types.js'

import { fieldsBuild } from './_fields-build.js'

import { titreFormat } from '../../_format/titres.js'

import { titreDemarcheFormat } from '../../_format/titres-demarches.js'

import { titreDemarcheGet, titresDemarchesCount, titresDemarchesGet, titreDemarcheCreate, titreDemarcheUpdate, titreDemarcheArchive } from '../../../database/queries/titres-demarches.js'

import { titreGet } from '../../../database/queries/titres.js'

import titreDemarcheUpdateTask from '../../../business/titre-demarche-update.js'
import { titreDemarcheUpdationValidate } from '../../../business/validations/titre-demarche-updation-validate.js'
import { isDemarcheTypeId, isTravaux } from 'camino-common/src/static/demarchesTypes.js'
import { canCreateTravaux, canCreateDemarche } from 'camino-common/src/permissions/titres-demarches.js'

const demarche = async ({ id }: { id: string }, { user }: Context, info: GraphQLResolveInfo) => {
  try {
    const fields = fieldsBuild(info)

    const titreDemarche = await titreDemarcheGet(id, { fields }, user)

    if (!titreDemarche) {
      throw new Error("la démarche n'existe pas")
    }

    return titreDemarcheFormat(titreDemarche, fields.elements)
  } catch (e) {
    console.error(e)

    throw e
  }
}

const demarches = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds,
    titresIds,
    titresEntreprisesIds,
    titresSubstancesIds,
    titresReferences,
    titresTerritoires,
    travaux,
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreDemarcheColonneId | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresIds?: string[] | null
    titresEntreprisesIds?: string[] | null
    titresSubstancesIds?: string[] | null
    titresReferences?: string | null
    titresTerritoires?: string | null
    travaux?: boolean | null
  },
  { user }: Context,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    if (!intervalle) {
      intervalle = 200
    }

    if (!page) {
      page = 1
    }

    const [titresDemarches, total] = await Promise.all([
      titresDemarchesGet(
        {
          intervalle,
          page,
          ordre,
          colonne,
          typesIds,
          statutsIds,
          etapesInclues,
          etapesExclues,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds,
          titresIds,
          titresEntreprisesIds,
          titresSubstancesIds,
          titresReferences,
          titresTerritoires,
          travaux,
        },
        { fields: fields.elements },
        user
      ),
      titresDemarchesCount(
        {
          typesIds,
          statutsIds,
          etapesInclues,
          etapesExclues,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds,
          titresIds,
          titresEntreprisesIds,
          titresSubstancesIds,
          titresReferences,
          titresTerritoires,
          travaux,
        },
        { fields: {} },
        user
      ),
    ])

    const demarchesFormatted = titresDemarches.map(titreDemarche => titreDemarcheFormat(titreDemarche, fields.elements))

    return {
      elements: demarchesFormatted,
      page,
      intervalle,
      ordre,
      colonne,
      total,
    }
  } catch (e) {
    console.error(e)

    throw e
  }
}

const demarcheCreer = async ({ demarche }: { demarche: ITitreDemarche }, { user }: Context, info: GraphQLResolveInfo) => {
  try {
    const titre = await titreGet(demarche.titreId, { fields: { pointsEtape: { id: {} } } }, user)

    if (!titre) throw new Error("le titre n'existe pas")

    if (!isDemarcheTypeId(demarche.typeId)) {
      throw new Error('droits insuffisants')
    }
    if (titre.administrationsLocales === undefined) {
      throw new Error('les administrations locales doivent être chargées')
    }
    if (!titre.titreStatutId) {
      throw new Error('le statut du titre est obligatoire')
    }

    if (isTravaux(demarche.typeId) && !canCreateTravaux(user, titre.typeId, titre.administrationsLocales ?? [])) {
      throw new Error('droits insuffisants')
    }
    if (!isTravaux(demarche.typeId) && !canCreateDemarche(user, titre.typeId, titre.titreStatutId, titre.administrationsLocales ?? [])) {
      throw new Error('droits insuffisants')
    }

    const demarcheCreated = await titreDemarcheCreate(demarche)

    await titreDemarcheUpdateTask(demarcheCreated.id, demarcheCreated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(demarcheCreated.titreId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    console.error(e)

    throw e
  }
}

const demarcheModifier = async ({ demarche }: { demarche: ITitreDemarche }, { user }: Context, info: GraphQLResolveInfo) => {
  try {
    if (!user) throw new Error('droits insuffisants')

    const demarcheOld = await titreDemarcheGet(
      demarche.id,
      {
        fields: { etapes: { id: {} } },
      },
      user
    )

    if (!demarcheOld) throw new Error('la démarche n’existe pas')
    const titre = await titreGet(demarcheOld.titreId, { fields: {} }, user)
    if (!titre) throw new Error("le titre n'existe pas")

    if (!demarcheOld.modification) throw new Error('droits insuffisants')

    if (demarcheOld.titreId !== demarche.titreId) throw new Error('le titre n’existe pas')

    const rulesErrors = await titreDemarcheUpdationValidate(demarche, demarcheOld)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreDemarcheUpdate(demarche.id, demarche)

    await titreDemarcheUpdateTask(demarche.id, demarche.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(demarche.titreId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    console.error(e)

    throw e
  }
}

const demarcheSupprimer = async ({ id }: { id: string }, { user }: Context, info: GraphQLResolveInfo) => {
  try {
    const demarcheOld = await titreDemarcheGet(id, { fields: { etapes: { id: {} } } }, user)

    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    if (!demarcheOld.suppression) throw new Error('droits insuffisants')

    await titreDemarcheArchive(id)

    await titreDemarcheUpdateTask(null, demarcheOld.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(demarcheOld.titreId, { fields }, user)

    return titreUpdated && titreFormat(titreUpdated)
  } catch (e) {
    console.error(e)

    throw e
  }
}

export { demarche, demarches, demarcheCreer, demarcheModifier, demarcheSupprimer }

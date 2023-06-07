import { DEPARTEMENT_IDS } from 'camino-common/src/static/departement.js'
import { TITRES_TYPES_TYPES_IDS } from 'camino-common/src/static/titresTypesTypes.js'
import { StatistiquesGuyaneData } from 'camino-common/src/statistiques.js'
import { evolutionTitres } from './evolution-titres.js'

import camelcase from 'camelcase'

import { ITitre, ITitreActivite } from '../../../types.js'

import { titresGet } from '../../../database/queries/titres.js'
import { titresActivitesGet } from '../../../database/queries/titres-activites.js'
import { userSuper } from '../../../database/user-super.js'
import { titresSurfaceIndexBuild } from '../../graphql/resolvers/statistiques.js'
import { TitreTypeId } from 'camino-common/src/static/titresTypes.js'
import { anneePrecedente, CaminoAnnee, getCurrentAnnee, toCaminoAnnee } from 'camino-common/src/date.js'
import { ACTIVITES_STATUTS_IDS } from 'camino-common/src/static/activitesStatuts.js'
import type { Pool } from 'pg'

const statistiquesGuyaneActivitesBuild = (sectionId: string, titresActivites: ITitreActivite[], init: { [key: string]: number }) =>
  titresActivites.reduce((acc: { [key: string]: number }, ta) => {
    acc.rapportProductionOrCount++

    if (ta.activiteStatutId === ACTIVITES_STATUTS_IDS.DEPOSE) {
      acc.activitesDeposesQuantiteCount++
    }

    Object.keys(acc).forEach(prop => {
      if (ta.contenu && ta.contenu[sectionId] && ta.contenu[sectionId][prop] && (prop !== 'effectifs' || ta.titre!.typeId === 'axm' || ta.titre!.typeId === 'pxm' || ta.titre!.typeId === 'cxm')) {
        const value = ta.contenu![sectionId][prop]

        acc[prop] += Number(value)
      }
    })

    return acc
  }, init)

type IStatsGuyaneTitresTypes = 'titresArm' | 'titresPrm' | 'titresAxm' | 'titresCxm'

const statistiquesGuyaneTitresBuild = (titres: { id: string; typeId: TitreTypeId; surface: number }[]): Record<string, { quantite: number; surface: number }> =>
  titres.reduce(
    (acc, titre) => {
      const id = camelcase(`titres-${titre.typeId}`) as IStatsGuyaneTitresTypes

      acc[id].quantite++
      acc[id].surface += titre.surface

      return acc
    },
    {
      titresArm: { quantite: 0, surface: 0 },
      titresPrm: { quantite: 0, surface: 0 },
      titresAxm: { quantite: 0, surface: 0 },
      titresCxm: { quantite: 0, surface: 0 },
    }
  )

const statistiquesGuyaneInstantBuild = (titres: ITitre[]) => {
  const statsInstant = titres.reduce(
    (acc, titre) => {
      if (titre.titreStatutId && ['val', 'mod'].includes(titre.titreStatutId)) {
        if (['arm', 'prm'].includes(titre.typeId)) {
          acc.surfaceExploration += titre.surfaceEtape?.surface ?? 0
        } else {
          acc.surfaceExploitation += titre.surfaceEtape?.surface ?? 0
        }
        const id = camelcase(`titres-${titre.typeId}`) as IStatsGuyaneTitresTypes

        acc[id]++
      }

      return acc
    },
    {
      surfaceExploration: 0,
      surfaceExploitation: 0,
      titresArm: 0,
      titresPrm: 0,
      titresAxm: 0,
      titresCxm: 0,
    }
  )

  statsInstant.surfaceExploration = Math.floor(statsInstant.surfaceExploration * 100) // conversion 1 km² = 100 ha
  statsInstant.surfaceExploitation = Math.floor(statsInstant.surfaceExploitation * 100) // conversion 1 km² = 100 ha

  return statsInstant
}

const statistiquesGuyaneAnneeBuild = (titres: ITitre[], titresActivites: ITitreActivite[], annee: CaminoAnnee) => {
  const titresFiltered = titresSurfaceIndexBuild(titres, +annee)

  const { titresArm, titresPrm, titresAxm, titresCxm } = statistiquesGuyaneTitresBuild(titresFiltered)

  // les activités de type grp de l'année
  const titresActivitesGrpFiltered = titresActivites.filter(ta => ta.annee === +annee && ta.typeId === 'grp')
  const statistiquesActivitesGrp = statistiquesGuyaneActivitesBuild('renseignements', titresActivitesGrpFiltered, {
    carburantConventionnel: 0,
    carburantDetaxe: 0,
    mercure: 0,
    environnement: 0,
    effectifs: 0,
    activitesDeposesQuantiteCount: 0,
    rapportProductionOrCount: 0,
  })
  // les activités de type gra et grx de l'année
  const titresActivitesGraFiltered = titresActivites.filter(ta => ta.annee === +annee && (ta.typeId === 'gra' || ta.typeId === 'grx'))
  const statistiquesActivitesGra = statistiquesGuyaneActivitesBuild('substancesFiscales', titresActivitesGraFiltered, {
    auru: 0,
    activitesDeposesQuantiteCount: 0,
    rapportProductionOrCount: 0,
  })

  // Pour les années 2017 et 2018, on affiche les chiffres "DRFIP" soit : pour 2017 : 1 485 kg  et pour 2018 : 1320 kg.
  if (annee === toCaminoAnnee(2017)) {
    // les rapports annuels n'existaient pas en 2017
    statistiquesActivitesGra.auru = 1485
  } else if (annee === toCaminoAnnee(2018)) {
    // à l'époque  l'or net annuel était déclaré "à coté" de la production d'or brut du 4ème trimestre, ce qui a provoqué la confusion des opérateurs et des erreurs en cascade.
    statistiquesActivitesGra.auru = 1320
  }

  const activitesDeposesRatio =
    statistiquesActivitesGrp.rapportProductionOrCount + statistiquesActivitesGra.rapportProductionOrCount
      ? Math.round(
          ((statistiquesActivitesGrp.activitesDeposesQuantiteCount + statistiquesActivitesGra.activitesDeposesQuantiteCount) * 100) /
            (statistiquesActivitesGrp.rapportProductionOrCount + statistiquesActivitesGra.rapportProductionOrCount)
        )
      : 0

  return {
    annee,
    titresArm,
    titresPrm,
    titresAxm,
    titresCxm,
    orNet: Math.floor(statistiquesActivitesGra.auru),
    carburantConventionnel: Math.floor(statistiquesActivitesGrp.carburantConventionnel / 1000), // milliers de litres
    carburantDetaxe: Math.floor(statistiquesActivitesGrp.carburantDetaxe / 1000), // milliers de litres
    mercure: Math.floor(statistiquesActivitesGrp.mercure),
    environnementCout: Math.floor(statistiquesActivitesGrp.environnement),
    effectifs: Math.round(statistiquesActivitesGrp.effectifs / 4), // somme des effectifs sur 4 trimestre
    activitesDeposesQuantite: statistiquesActivitesGrp.activitesDeposesQuantiteCount + statistiquesActivitesGra.activitesDeposesQuantiteCount,
    activitesDeposesRatio,
  }
}

export const statistiquesGuyane = async () => {
  try {
    let anneeCurrent = getCurrentAnnee()
    // un tableau avec les 5 dernières années
    const annees = Array.from(Array(6).keys())
      .map(_id => {
        const monAnnee = anneeCurrent
        anneeCurrent = anneePrecedente(anneeCurrent)

        return monAnnee
      })
      .reverse()

    const titres = await titresGet(
      {
        domainesIds: ['m'],
        typesIds: ['ar', 'pr', 'ax', 'px', 'cx'],
        departements: [DEPARTEMENT_IDS.Guyane],
      },
      {
        fields: {
          surfaceEtape: { id: {} },
          demarches: { etapes: { id: {} }, type: { id: {} } },
        },
      },
      userSuper
    )

    const titresActivites = await titresActivitesGet(
      {
        titresDepartements: [DEPARTEMENT_IDS.Guyane],
        annees: annees.map(annee => +annee),
        typesIds: ['grp', 'gra', 'grx'],
      },
      { fields: { titre: { id: {} } } },
      userSuper
    )

    return {
      annees: annees.map(annee => statistiquesGuyaneAnneeBuild(titres, titresActivites, annee)),
      ...statistiquesGuyaneInstantBuild(titres),
    }
  } catch (e) {
    console.error(e)

    throw e
  }
}

export const getGuyaneStatsInside = async (pool: Pool): Promise<StatistiquesGuyaneData> => {
  const guyane = [DEPARTEMENT_IDS.Guyane]
  const armData = await evolutionTitres(pool, TITRES_TYPES_TYPES_IDS.AUTORISATION_DE_RECHERCHE, guyane)
  const prmData = await evolutionTitres(pool, TITRES_TYPES_TYPES_IDS.PERMIS_EXCLUSIF_DE_RECHERCHES, guyane)
  const axmData = await evolutionTitres(pool, TITRES_TYPES_TYPES_IDS.AUTORISATION_D_EXPLOITATION, guyane)
  const cxmData = await evolutionTitres(pool, TITRES_TYPES_TYPES_IDS.CONCESSION, guyane)

  const fromObjection = await statistiquesGuyane()

  return {
    arm: armData,
    prm: prmData,
    axm: axmData,
    cxm: cxmData,
    ...fromObjection,
  }
}

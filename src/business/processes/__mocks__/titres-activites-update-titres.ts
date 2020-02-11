import { ITitres, IActivitesTypes } from '../../../types'

const titresSansActivite = ([
  {
    id: 'h-cx-courdemanges-1988',
    activites: []
  }
] as unknown) as ITitres[]

const titresToutesActivites = [
  {
    id: 'h-cx-courdemanges-1988',
    activites: [
      {
        annee: 2018,
        frequencePeriodeId: 1
      },
      {
        annee: 2018,
        frequencePeriodeId: 2
      },
      {
        annee: 2018,
        frequencePeriodeId: 3
      },
      {
        annee: 2018,
        frequencePeriodeId: 4
      }
    ]
  }
] as ITitres[]

const titreActiviteTypeGuyane = ({
  id: 'grp',
  dateDebut: 2018,
  nom: "rapport d'activité",
  frequenceId: 'tri'
} as unknown) as IActivitesTypes

const titreActivitesTypes = [titreActiviteTypeGuyane]

export { titresSansActivite, titresToutesActivites, titreActivitesTypes }

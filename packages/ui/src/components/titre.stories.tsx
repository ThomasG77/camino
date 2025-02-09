import { Meta, StoryFn } from '@storybook/vue3'
import { PureTitre } from './titre'
import { action } from '@storybook/addon-actions'
import { caminoDateValidator, toCaminoDate } from 'camino-common/src/date'
import { ApiClient } from '@/api/api-client'
import { testBlankUser } from 'camino-common/src/tests-utils'
import { TitreGet, TitreLink, demarcheGetValidator, titreGetValidator } from 'camino-common/src/titres'
import { TitresStatutIds } from 'camino-common/src/static/titresStatuts'
import { TITRES_TYPES_IDS } from 'camino-common/src/static/titresTypes'
import { LinkableTitre } from './titre/titres-link-form-api-client'
import { demarcheIdValidator, demarcheSlugValidator } from 'camino-common/src/demarche'
import { ETAPE_IS_NOT_BROUILLON, etapeIdValidator, etapeSlugValidator } from 'camino-common/src/etape'
import { EtapesTypesEtapesStatuts } from 'camino-common/src/static/etapesTypesEtapesStatuts'
import { Entreprise, entrepriseIdValidator } from 'camino-common/src/entreprise'
import { titreIdValidator, titreSlugValidator, TitreIdOrSlug } from 'camino-common/src/validators/titres'
import { ZERO_KM2 } from 'camino-common/src/number'
import { CaminoRouter } from '@/typings/vue-router'

const meta: Meta = {
  title: 'Components/Titre',
  // @ts-ignore @storybook/vue3 n'aime pas les composants tsx
  component: PureTitre,
}
export default meta

const editTitreAction = action('editTitre')
const updateDemarcheAction = action('updateDemarche')
const createDemarcheAction = action('createDemarche')
const deleteDemarcheAction = action('deleteDemarche')
const removeTitreAction = action('removeTitre')
const getTitreAction = action('getTitreAction')
const deleteEtapeAction = action('deleteEtapeAction')
const deposerEtapeAction = action('deposerEtapeAction')
const getTitresWithPerimetreForCarteAction = action('getTitresWithPerimetreForCarteAction')
const routerPushAction = action('routerPushAction')
const routerReplaceAction = action('routerReplaceAction')
const loadTitreLinksAction = action('loadTitreLinksAction')
const loadLinkableTitresAction = action('loadLinkableTitresAction')
const getTitreUtilisateurAbonneAction = action('getTitreUtilisateurAbonneAction')
const titreUtilisateurAbonneAction = action('titreUtilisateurAbonneAction')
const linkTitresAction = action('linkTitresAction')
const date = toCaminoDate('2023-10-24')

type PropsApiClient = Pick<
  ApiClient,
  | 'getTitreById'
  | 'getTitresWithPerimetreForCarte'
  | 'deleteEtape'
  | 'deposeEtape'
  | 'loadTitreLinks'
  | 'loadLinkableTitres'
  | 'linkTitres'
  | 'titreUtilisateurAbonne'
  | 'getTitreUtilisateurAbonne'
  | 'editTitre'
  | 'removeTitre'
  | 'createDemarche'
  | 'updateDemarche'
  | 'deleteDemarche'
>
const routerPushMock: Pick<CaminoRouter, 'push' | 'replace'> = {
  push: to => {
    routerPushAction(to)

    return Promise.resolve()
  },
  replace: to => {
    routerReplaceAction(to)

    return Promise.resolve()
  },
}

const linkableTitres: LinkableTitre[] = [
  {
    id: titreIdValidator.parse('id1'),
    nom: 'Abttis Coucou',
    titreStatutId: 'ech',
    demarches: [
      {
        demarcheDateDebut: toCaminoDate('2016-10-28'),
        demarcheDateFin: toCaminoDate('2017-03-17'),
      },
    ],
  },
  {
    id: titreIdValidator.parse('id2'),
    nom: 'Affluent Crique Saint Bernard',
    titreStatutId: 'ech',
    demarches: [
      {
        demarcheDateDebut: toCaminoDate('2008-11-30'),
        demarcheDateFin: toCaminoDate('2019-02-27'),
      },
    ],
  },
  {
    id: titreIdValidator.parse('id3'),
    nom: 'Nouveau titre',
    titreStatutId: 'ech',
    demarches: [
      {
        demarcheDateDebut: toCaminoDate('2008-11-30'),
        demarcheDateFin: toCaminoDate('2019-02-27'),
      },
    ],
  },
]

const entreprises: Entreprise[] = [
  { id: entrepriseIdValidator.parse('id-entreprise1'), nom: 'Super titulaire', legal_siren: '' },
  { id: entrepriseIdValidator.parse('fr-632022711'), nom: 'ELF AQUITAINE PRODUCTION', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-409160132'), nom: 'TOTALENERGIES EP FRANCE (TEPF)', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-794312231'), nom: 'SOCIETE MINIERE DE L OUEST (S.M.O)', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-480857036'), nom: 'TOMANY', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-401802863'), nom: 'ARMINA RESSOURCES MINIERES SARL', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-790856850'), nom: 'SUDMINE', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-606320471'), nom: 'RHONE PROGIL SA', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-642014526'), nom: 'RHODIA CHIMIE', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-442993283'), nom: 'NOVACARB', legal_siren: null },
  { id: entrepriseIdValidator.parse('fr-712025048'), nom: 'COMPAGNIE INDUSTRIELLE ET MINIERE (CIM)', legal_siren: null },
]

const titresTo: TitreLink[] = [{ id: titreIdValidator.parse('id10'), nom: 'Titre fils' }]
const titresFrom: TitreLink[] = [linkableTitres[0]]

const demarcheSlug = demarcheSlugValidator.parse('slug-demarche-1')
const titre = {
  id: titreIdValidator.parse('id-du-titre'),
  nom: 'Nom du titre',
  slug: titreSlugValidator.parse('slug-du-titre'),
  titre_type_id: 'arm',
  titre_statut_id: 'val',

  references: [
    { nom: 'Duo', referenceTypeId: 'ifr' },
    { nom: '2012/12', referenceTypeId: 'deb' },
  ],
  titre_last_modified_date: toCaminoDate('2021-01-01'),
  titre_doublon: null,
  nb_activites_to_do: 2,
  demarches: [
    {
      id: demarcheIdValidator.parse('id-demarche-1'),
      demarche_type_id: 'oct',
      slug: demarcheSlug,
      demarche_date_debut: toCaminoDate('2019-01-01'),
      demarche_date_fin: toCaminoDate('2021-01-01'),
      demarche_statut_id: 'acc',
      ordre: 0,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      etapes: [
        {
          id: etapeIdValidator.parse('etapeId'),
          note: { valeur: '', is_avertissement: false },
          slug: etapeSlugValidator.parse('etape-slug'),
          etape_type_id: EtapesTypesEtapesStatuts.demande.FAIT.etapeTypeId,
          etape_statut_id: EtapesTypesEtapesStatuts.demande.FAIT.etapeStatutId,
          is_brouillon: ETAPE_IS_NOT_BROUILLON,
          date,
          ordre: 1,
          fondamentale: {
            date_debut: null,
            duree: null,
            date_fin: null,
            substances: [],
            titulaireIds: [entrepriseIdValidator.parse('id-entreprise1')],
            amodiataireIds: [],
            perimetre: {
              geojson4326_points: null,
              geojson4326_perimetre: {
                properties: {},
                type: 'Feature',
                geometry: {
                  type: 'MultiPolygon',
                  coordinates: [
                    [
                      [
                        [-53.58181013905019, 3.8309654861273],
                        [-53.58178306390299, 3.8219278216269807],
                        [-53.572785590706495, 3.82195493825841],
                        [-53.57281257175149, 3.8309926670647294],
                        [-53.58181013905019, 3.8309654861273],
                      ],
                    ],
                  ],
                },
              },
              geojson_origine_perimetre: {
                properties: {},
                type: 'Feature',
                geometry: {
                  type: 'MultiPolygon',
                  coordinates: [
                    [
                      [
                        [-53.58181013905019, 3.8309654861273],
                        [-53.58178306390299, 3.8219278216269807],
                        [-53.572785590706495, 3.82195493825841],
                        [-53.57281257175149, 3.8309926670647294],
                        [-53.58181013905019, 3.8309654861273],
                      ],
                    ],
                  ],
                },
              },
              geojson_origine_points: null,
              geojson_origine_geo_systeme_id: '4326',
              geojson4326_forages: null,
              geojson_origine_forages: null,
              surface: ZERO_KM2,
              communes: [],
              sdom_zones: [],
              forets: [],
              secteurs_maritimes: [],
            },
          },
          sections_with_values: [],
          etape_documents: [],
          entreprises_documents: [],
          avis_documents: [],
        },
      ],
    },
  ],
} as const satisfies TitreGet

const apiClient: PropsApiClient = {
  editTitre: (...params) => {
    editTitreAction(params)

    return Promise.resolve()
  },
  deleteDemarche: (...params) => {
    deleteDemarcheAction(params)

    return Promise.resolve()
  },
  createDemarche: (...params) => {
    createDemarcheAction(params)

    return Promise.resolve(demarcheSlugValidator.parse('slug'))
  },
  updateDemarche: (...params) => {
    updateDemarcheAction(params)

    return Promise.resolve(demarcheSlugValidator.parse('slug'))
  },
  removeTitre: (...params) => {
    removeTitreAction(params)

    return Promise.resolve()
  },
  getTitreUtilisateurAbonne: (...params) => {
    getTitreUtilisateurAbonneAction(params)

    return Promise.resolve(true)
  },
  titreUtilisateurAbonne: (...params) => {
    titreUtilisateurAbonneAction(params)

    return Promise.resolve()
  },
  loadLinkableTitres:
    (...params) =>
    () => {
      loadLinkableTitresAction(params)

      return Promise.resolve([])
    },
  linkTitres: (...params) => {
    linkTitresAction(params)

    return Promise.resolve({ aval: [], amont: [] })
  },
  loadTitreLinks: titreId => {
    loadTitreLinksAction(titreId)

    return Promise.resolve({
      amont: [],
      aval: [],
    })
  },
  getTitresWithPerimetreForCarte: (...params) => {
    getTitresWithPerimetreForCarteAction(params)

    return Promise.resolve({
      elements: [
        {
          id: titreIdValidator.parse('id-du-titre-voisin'),
          nom: 'nom du titre',
          references: [],
          slug: titreSlugValidator.parse('slug-du-titre-voisin'),
          titreStatutId: TitresStatutIds.Valide,
          typeId: TITRES_TYPES_IDS.AUTORISATION_DE_PROSPECTION_CARRIERES,
          titulaireIds: [],
          geojson4326_perimetre: {
            type: 'Feature',
            properties: {},

            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [-53.57, 3.84],
                    [-53.56, 3.81],
                    [-53.565, 3.8309926670647294],
                    [-53.57, 3.84],
                  ],
                ],
              ],
            },
          },
        },
      ],
      total: 1,
    })
  },
  getTitreById: titreIdOrSlug => {
    getTitreAction(titreIdOrSlug)

    return Promise.resolve(titre)
  },

  deleteEtape: etapeId => {
    deleteEtapeAction(etapeId)

    return Promise.reject(new Error('Nope'))
  },

  deposeEtape: etapeId => {
    deposerEtapeAction(etapeId)

    return Promise.resolve()
  },
}

const currentDate = caminoDateValidator.parse('2024-01-09')

export const FullWithMapNoSnapshot: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={apiClient}
    titreIdOrSlug={titre.id}
  />
)
export const Full: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    initTab="points"
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={apiClient}
    titreIdOrSlug={titre.id}
  />
)

const chantePieApiClient: PropsApiClient = {
  ...apiClient,

  getTitreUtilisateurAbonne: (...params) => {
    getTitreUtilisateurAbonneAction(params)

    return Promise.resolve(false)
  },
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const chantepieData = titreGetValidator.parse({"id":"Ju80kBYMoDstD5J6H8wqWRdo","nom":"Chantepie","slug":"m-cx-chantepie-1988","titre_type_id":"cxm","titre_statut_id":"val","titre_doublon":null,"references":[{"nom":"2013-0224-MI","referenceTypeId":"deb"}],"titre_last_modified_date":"2023-10-12","demarches":[{"id":"PpD4be1fwbWJ7TZCdwvZj0vQ","slug":"m-cx-chantepie-1988-oct01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":600,"substances":["auru","arge","cuiv","ferx","plom","souf","zinc","scoc"],"titulaireIds":["fr-632022711"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-0.105658320330431,48.1489209342693],[-0.115003633563279,48.1398379979624],[-0.0996023094257926,48.1209828190687],[-0.0852402595925762,48.1212930049111],[-0.0616864580218711,48.1486971325525],[-0.105658320330431,48.1489209342693]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.105658320330431,48.1489209342693]},"properties":{"nom":"A","description":"Intersection de l'axe de la route départementale n° 103, joignant Rouez et Crissé et de la droite joignant l'intersection de l'axe de la rivière La Vègre avec la limite des communes de Sillé-le-Guillaume et de Rouez, d'une part, au sommet B défini ci-après"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0616864580218711,48.1486971325525]},"properties":{"nom":"B","description":"Intersection de l'axe de la route départementale n° 304 allant de Sillé-le-Guillaume à Conlie et de l'axe de la route départementale n° 167 allant à Rouez"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0852402595925762,48.1212930049111]},"properties":{"nom":"C","description":"Intersection de la droite joignant l'axe du clocher de Sillé-le-Guillaume et l'axe du clocher de Tennie, et de la droite joignant l'axe du clocher de Parennes et l'axe du clocher de Conlie"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0996023094257926,48.1209828190687]},"properties":{"nom":"D","description":"Intersection de la droite joignant l'axe du clocher de Parennes et l'axe du clocher de Conlie et de la droite joignant l'axe du clocher de Rouez et l'axe du clocher de Bernay"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.115003633563279,48.1398379979624]},"properties":{"nom":"E","description":"Axe du clocher de Rouez"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[418280,1052710],[421550,1052580],[419700,1049590],[418630,1049590],[417552,1051723],[418280,1052710]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[418280,1052710]},"properties":{"nom":"A","description":"Intersection de l’axe de la route départementale n° 103, joignant Rouez et Crissé et de la droite joignant l’intersection de l’axe de la rivière La Vègre avec la limite des communes de Sillé-le-Guillaume et de Rouez, d’une part, au sommet B défini ci-après"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[421550,1052580]},"properties":{"nom":"B","description":"Intersection de l’axe de la route départementale n° 304 allant de Sillé-le-Guillaume à Conlie et de l’axe de la route départementale n° 167 allant à Rouez"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[419700,1049590]},"properties":{"nom":"C","description":"Intersection de la droite joignant l’axe du clocher de Sillé-le-Guillaume et l’axe du clocher de Tennie, et de la droite joignant l’axe du clocher de Parennes et l’axe du clocher de Conlie"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[418630,1049590]},"properties":{"nom":"D","description":"Intersection de la droite joignant l’axe du clocher de Parennes et l’axe du clocher de Conlie et de la droite joignant l’axe du clocher de Rouez et l’axe du clocher de Bernay"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[417552,1051723]},"properties":{"nom":"E","description":"Axe du clocher de Rouez"}}]},"geojson_origine_geo_systeme_id":"27571","geojson4326_forages":null,"geojson_origine_forages":null,"surface":8,"communes":[{"id":"72256","nom":"Rouez"},{"id":"72351","nom":"Tennie"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"acc","is_brouillon":false,"date":"1988-09-01","id":"OxqtxQwW0B3AUIHFR7k32Ycl","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-chantepie-1988-oct01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000681488"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"INDE8800659D"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":600,"substances":["auru","arge","cuiv","ferx","plom","souf","zinc","scoc"],"titulaireIds":["fr-632022711"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-0.105658320330431,48.1489209342693],[-0.115003633563279,48.1398379979624],[-0.0996023094257926,48.1209828190687],[-0.0852402595925762,48.1212930049111],[-0.0616864580218711,48.1486971325525],[-0.105658320330431,48.1489209342693]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.105658320330431,48.1489209342693]},"properties":{"nom":"A","description":"Intersection de l'axe de la route départementale n° 103, joignant Rouez et Crissé et de la droite joignant l'intersection de l'axe de la rivière La Vègre avec la limite des communes de Sillé-le-Guillaume et de Rouez, d'une part, au sommet B défini ci-après"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0616864580218711,48.1486971325525]},"properties":{"nom":"B","description":"Intersection de l'axe de la route départementale n° 304 allant de Sillé-le-Guillaume à Conlie et de l'axe de la route départementale n° 167 allant à Rouez"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0852402595925762,48.1212930049111]},"properties":{"nom":"C","description":"Intersection de la droite joignant l'axe du clocher de Sillé-le-Guillaume et l'axe du clocher de Tennie, et de la droite joignant l'axe du clocher de Parennes et l'axe du clocher de Conlie"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.0996023094257926,48.1209828190687]},"properties":{"nom":"D","description":"Intersection de la droite joignant l'axe du clocher de Parennes et l'axe du clocher de Conlie et de la droite joignant l'axe du clocher de Rouez et l'axe du clocher de Bernay"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.115003633563279,48.1398379979624]},"properties":{"nom":"E","description":"Axe du clocher de Rouez"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[418280,1052710],[421550,1052580],[419700,1049590],[418630,1049590],[417552,1051723],[418280,1052710]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[418280,1052710]},"properties":{"nom":"A","description":"Intersection de l’axe de la route départementale n° 103, joignant Rouez et Crissé et de la droite joignant l’intersection de l’axe de la rivière La Vègre avec la limite des communes de Sillé-le-Guillaume et de Rouez, d’une part, au sommet B défini ci-après"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[421550,1052580]},"properties":{"nom":"B","description":"Intersection de l’axe de la route départementale n° 304 allant de Sillé-le-Guillaume à Conlie et de l’axe de la route départementale n° 167 allant à Rouez"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[419700,1049590]},"properties":{"nom":"C","description":"Intersection de la droite joignant l’axe du clocher de Sillé-le-Guillaume et l’axe du clocher de Tennie, et de la droite joignant l’axe du clocher de Parennes et l’axe du clocher de Conlie"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[418630,1049590]},"properties":{"nom":"D","description":"Intersection de la droite joignant l’axe du clocher de Parennes et l’axe du clocher de Conlie et de la droite joignant l’axe du clocher de Rouez et l’axe du clocher de Bernay"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[417552,1051723]},"properties":{"nom":"E","description":"Axe du clocher de Rouez"}}]},"geojson_origine_geo_systeme_id":"27571","geojson4326_forages":null,"geojson_origine_forages":null,"surface":8,"communes":[{"id":"72256","nom":"Rouez"},{"id":"72351","nom":"Tennie"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"acc","is_brouillon":false,"date":"1988-08-24","id":"XkNmBmjc6YYY6OEncdCAldnU","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-chantepie-1988-oct01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"1988-09-01","demarche_date_fin":"2038-09-01","ordre":1},{"id":"mkPvJYXFO2InPppXamCRo2Cv","slug":"m-cx-chantepie-1988-mut01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":["fr-409160132"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2000-06-06","id":"lc3diJKRphb029ufvF73FlSn","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-chantepie-1988-mut01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000765254"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOI0000251A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":["fr-409160132"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2000-05-25","id":"2n1RaQcCxZMVta2Qfv1pUIRS","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-chantepie-1988-mut01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":2}],"nb_activites_to_do":null})
    chantepieData.nom = 'Chantepie avec un titre assez long'
    chantepieData.nb_activites_to_do = 2

    return Promise.resolve(chantepieData)
  },
}

export const ChantepieOctroi: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-cx-chantepie-1988-oct01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'admin', administrationId: 'min-mtes-dgaln-01' }}
    router={routerPushMock}
    apiClient={chantePieApiClient}
    titreIdOrSlug={titre.id}
  />
)

export const ChantepieOctroiAsEntreprise: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-cx-chantepie-1988-oct01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'entreprise', entreprises: [{ id: entrepriseIdValidator.parse('fr-409160132') }] }}
    router={routerPushMock}
    apiClient={chantePieApiClient}
    titreIdOrSlug={titre.id}
  />
)

export const ChantepieMutation: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-cx-chantepie-1988-mut01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={chantePieApiClient}
    titreIdOrSlug={titre.id}
  />
)

const criqueAdolpheApiClient: PropsApiClient = {
  ...apiClient,
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const criqueAdolpheData = titreGetValidator.parse({"id":"tbFvGIDboAzxTb54GQyghTyc","nom":"Crique Adolphe","slug":"m-ar-crique-adolphe-2023","titre_type_id":"arm","titre_statut_id":"ech","titre_doublon":null,"references":[{"nom":"2022-032","referenceTypeId":"ptm"},{"nom":"AR 2022-027","referenceTypeId":"onf"}],"titre_last_modified_date":"2023-10-20","demarches":[{"id":"yAvBOMdHDsyES7phbS5hRKLA","slug":"m-ar-crique-adolphe-2023-oct01","description":null,"etapes":[{"etape_type_id":"sco","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"fai","is_brouillon":false,"date":"2023-09-19","id":"5649942721fd9f3478381ae9","ordre":15,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-sco01","sections_with_values":[{"id":"suivi","nom":"Suivi de la démarche","elements":[{"id":"signataire","nom":"Signataire ONF","description":"Prénom et nom du représentant légal du titulaire de l'ONF","optionnel":true,"type":"text","value":null},{"id":"titulaire","nom":"Signataire titulaire","description":"Prénom et nom du représentant légal du titulaire de l'autorisation","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"sca","etape_statut_id":"fai","is_brouillon":false,"date":"2023-01-11","id":"WLXKWB9Fv17gm2gTJYIXnTyX","ordre":10,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-sca01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"aca","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"fav","is_brouillon":false,"date":"2023-01-11","id":"oXXG5ToIYbw8MvdYPX7sMMAP","ordre":11,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-aca01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"rde","etape_statut_id":"fav","is_brouillon":false,"date":"2022-12-29","id":"y0SCXGJ1OBYSthcWyojyOLZX","ordre":8,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-rde01","sections_with_values":[{"id":"deal","nom":"DEAL","elements":[{"id":"numero-dossier-deal-eau","nom":"Numéro de dossier","description":"Numéro de dossier DEAL Service eau","optionnel":true,"type":"text","value":""},{"id":"numero-recepisse","nom":"Numéro de récépissé","description":"Numéro de récépissé émis par la DEAL Service eau","optionnel":true,"type":"text","value":"R03-2022-12-29-00005"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mcr","etape_statut_id":"fav","is_brouillon":false,"date":"2022-12-05","id":"0vdB4jaJbpIpyUnIZkKPsmCm","ordre":7,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-mcr01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":4,"substances":["auru"],"titulaireIds":["fr-794312231"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.58181013905019,3.8309654861273],[-53.58178306390299,3.8219278216269807],[-53.572785590706495,3.82195493825841],[-53.57281257175149,3.8309926670647294],[-53.58181013905019,3.8309654861273]]],[[[-53.60031408473134,3.8224780986447566],[-53.59891645305842,3.8181831495446303],[-53.58181205656814,3.82379854768971],[-53.58320964990986,3.828093576227541],[-53.60031408473134,3.8224780986447566]]],[[[-53.583861926103765,3.8502114455117433],[-53.592379712320195,3.834289122043602],[-53.588417035915334,3.8321501920354253],[-53.57989914401643,3.8480725119510217],[-53.583861926103765,3.8502114455117433]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.58181013905019,3.8309654861273]},"properties":{"nom":"S1","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.57281257175149,3.8309926670647294]},"properties":{"nom":"S2","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.572785590706495,3.82195493825841]},"properties":{"nom":"S3","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.58178306390299,3.8219278216269807]},"properties":{"nom":"S4","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.60031408473134,3.8224780986447566]},"properties":{"nom":"S5","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.58320964990986,3.828093576227541]},"properties":{"nom":"S6","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.58181205656814,3.82379854768971]},"properties":{"nom":"S7","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.59891645305842,3.8181831495446303]},"properties":{"nom":"S8","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.583861926103765,3.8502114455117433]},"properties":{"nom":"S9","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.57989914401643,3.8480725119510217]},"properties":{"nom":"S10","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.588417035915334,3.8321501920354253]},"properties":{"nom":"S11","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.592379712320195,3.834289122043602]},"properties":{"nom":"S12","description":"ARM3.3"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[213250,423875],[214250,423875],[214250,422875],[213250,422875],[213250,423875]]],[[[211190.6,422942.1],[213093.5,423557.7],[213247.4,423082],[211344.5,422466.4],[211190.6,422942.1]]],[[[213028.4,426005.2],[213468.1,425767.2],[212516.1,424008.3],[212076.4,424246.3],[213028.4,426005.2]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[213250,423875]},"properties":{"nom":"S1","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[214250,423875]},"properties":{"nom":"S2","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[214250,422875]},"properties":{"nom":"S3","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[213250,422875]},"properties":{"nom":"S4","description":"ARM1.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[211190.6,422942.1]},"properties":{"nom":"S5","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[213093.5,423557.7]},"properties":{"nom":"S6","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[213247.4,423082]},"properties":{"nom":"S7","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[211344.5,422466.4]},"properties":{"nom":"S8","description":"ARM2.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[213028.4,426005.2]},"properties":{"nom":"S9","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[213468.1,425767.2]},"properties":{"nom":"S10","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[212516.1,424008.3]},"properties":{"nom":"S11","description":"ARM3.3"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[212076.4,424246.3]},"properties":{"nom":"S12","description":"ARM3.3"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":3,"communes":[{"id":"97353","nom":"Maripasoula"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"fai","is_brouillon":false,"date":"2022-11-08","id":"pwqOEAsAmaWi0o24QiVeVZ40","ordre":3,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-mfr01","sections_with_values":[{"id":"arm","nom":"Caractéristiques ARM","elements":[{"id":"mecanise","nom":"Prospection mécanisée","description":"","optionnel":false,"type":"radio","value":true},{"id":"franchissements","nom":"Franchissements de cours d'eau","description":"Nombre de franchissements de cours d'eau","optionnel":true,"type":"integer","value":12}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2022-11-08","id":"pF4UG6UrCOJmKjtgmtpwthTQ","ordre":4,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dae","etape_statut_id":"exe","is_brouillon":false,"date":"2022-09-26","id":"KA7tyvIdlqQmmVOuVjEl0Hdt","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-crique-adolphe-2023-oct01-dae01","sections_with_values":[{"id":"mea","nom":"Mission autorité environnementale","elements":[{"id":"arrete","nom":"Arrêté préfectoral","description":"Numéro de l'arrêté préfectoral portant décision dans le cadre de l’examen au cas par cas du projet d’autorisation de recherche minière","optionnel":true,"type":"text","value":"R03-2022-09-26-00002"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"2023-09-19","demarche_date_fin":"2024-01-19","ordre":1}],"nb_activites_to_do":null})
    criqueAdolpheData.nb_activites_to_do = 0

    return Promise.resolve(criqueAdolpheData)
  },
}

export const CriqueAdolpheOctroi: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-ar-crique-adolphe-2023-oct01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={criqueAdolpheApiClient}
    titreIdOrSlug={titre.id}
  />
)

const abattisKoticaApiClient: PropsApiClient = {
  ...apiClient,
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const abattisData = titreGetValidator.parse({"id":"ooyCY2eGMXLunjmwPbBYyQcf","nom":"Abattis Kotika","slug":"m-ar-abattis-kotika-2006","titre_type_id":"arm","titre_statut_id":"ech","titre_doublon":null,"references":[{"nom":"AR2006060","referenceTypeId":"onf"},{"nom":"2006-061","referenceTypeId":"ptm"}],"titre_last_modified_date":null,"demarches":[{"id":"SjKhYLXdqcla1BaN3nmgQhPs","slug":"m-ar-abattis-kotika-2006-oct01","description":null,"etapes":[{"etape_type_id":"def","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2006-11-28","id":"Pw734o5mdB2K2AWaOKQ85Ydz","ordre":4,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-abattis-kotika-2006-oct01-def01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"sco","fondamentale":{"date_debut":null,"date_fin":"2007-03-27","duree":4,"substances":["auru"],"titulaireIds":["fr-480857036"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-54.256565011133,3.95310428827045],[-54.2571944444789,3.94846823388004],[-54.2392714613677,3.9464520807474],[-54.2387665564076,3.95076254570704],[-54.256565011133,3.95310428827045]]],[[[-54.251541223062,3.94479622927321],[-54.251001625524,3.94017377611083],[-54.2330489949186,3.94209562569541],[-54.2335613570663,3.94667311503072],[-54.251541223062,3.94479622927321]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.256565011133,3.95310428827045]},"properties":{"nom":"1","description":"a"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.2387665564076,3.95076254570704]},"properties":{"nom":"2","description":"b"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.2392714613677,3.9464520807474]},"properties":{"nom":"3","description":"c"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.2571944444789,3.94846823388004]},"properties":{"nom":"4","description":"d"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.251541223062,3.94479622927321]},"properties":{"nom":"1","description":"e"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.2335613570663,3.94667311503072]},"properties":{"nom":"2","description":"f"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.2330489949186,3.94209562569541]},"properties":{"nom":"3","description":"g"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-54.251001625524,3.94017377611083]},"properties":{"nom":"4","description":"h"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[138288,437653],[140266,437386],[140208,436909],[138216,437140],[138288,437653]]],[[[138843,436731],[140843,436931],[140898,436424],[138901,436219],[138843,436731]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[138288,437653]},"properties":{"nom":"1","description":"a"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[140266,437386]},"properties":{"nom":"2","description":"b"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[140208,436909]},"properties":{"nom":"3","description":"c"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[138216,437140]},"properties":{"nom":"4","description":"d"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[138843,436731]},"properties":{"nom":"1","description":"e"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[140843,436931]},"properties":{"nom":"2","description":"f"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[140898,436424]},"properties":{"nom":"3","description":"g"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[138901,436219]},"properties":{"nom":"4","description":"h"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":2,"communes":[{"id":"97362","nom":"Papaichton"}],"secteurs_maritimes":[],"sdom_zones":["0_potentielle","2"],"forets":[]}},"etape_statut_id":"fai","is_brouillon":false,"date":"2006-11-28","id":"1iF8kbcg0oGaEMAJxgUZYk8W","ordre":5,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-abattis-kotika-2006-oct01-sco01","sections_with_values":[{"id":"arm","nom":"Caractéristiques ARM","elements":[{"id":"mecanise","nom":"Prospection mécanisée","optionnel":false,"type":"radio","value":null}]},{"id":"suivi","nom":"Suivi de la démarche","elements":[{"id":"signataire","nom":"Signataire ONF","description":"Prénom et nom du représentant légal du titulaire de l'ONF","optionnel":true,"type":"text","value":"Michel Borderes"},{"id":"titulaire","nom":"Signataire titulaire","description":"Prénom et nom du représentant légal du titulaire de l'autorisation","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"men","etape_statut_id":"fai","is_brouillon":false,"date":"2006-10-16","id":"TMWQQo20x3j7BJ8Sboaq1B20","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-ar-abattis-kotika-2006-oct01-men01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"2006-11-28","demarche_date_fin":"2007-03-27","ordre":1}],"nb_activites_to_do":null})
    abattisData.nb_activites_to_do = 0

    return Promise.resolve(abattisData)
  },
}

export const AbattisKoticaOctroi: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-ar-abattis-kotika-2006-oct01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'defaut' }}
    router={routerPushMock}
    apiClient={abattisKoticaApiClient}
    titreIdOrSlug={titre.id}
  />
)

const bonEspoirApiClient: PropsApiClient = {
  ...apiClient,
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const bonEspoirData = titreGetValidator.parse({"id":"sJorD6pQomXTN7oRpyGwLijB","nom":"Bon Espoir","slug":"m-pr-bon-espoir-2001","titre_type_id":"prm","titre_statut_id":"ech","titre_doublon":null,"references":[{"nom":"21/2001","referenceTypeId":"dea"},{"nom":"2013-0033-MI","referenceTypeId":"deb"}],"titre_last_modified_date":"2023-11-30","demarches":[{"id":"ry8fHgRWiKEOE1x1ZANmajh8","slug":"m-pr-bon-espoir-2001-oct01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":"2001-11-01","date_fin":null,"duree":60,"substances":["auru","scoc"],"titulaireIds":null,"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.9579321010744,5.07776938770113],[-53.9575232150351,4.98735333700249],[-53.8673626701318,4.98775355007457],[-53.8672265271601,4.95631734759459],[-53.7770631139658,4.95670276466037],[-53.7769878916108,4.93868722476635],[-53.5698730075868,4.93952315477954],[-53.5702069576163,5.02537608911083],[-53.759383911755,5.02460196044417],[-53.7596128864516,5.07864912381548],[-53.9579321010744,5.07776938770113]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9579321010744,5.07776938770113]},"properties":{"nom":"1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7596128864516,5.07864912381548]},"properties":{"nom":"2","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.759383911755,5.02460196044417]},"properties":{"nom":"3","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.5702069576163,5.02537608911083]},"properties":{"nom":"4","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.5698730075868,4.93952315477954]},"properties":{"nom":"5","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7769878916108,4.93868722476635]},"properties":{"nom":"6","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7770631139658,4.95670276466037]},"properties":{"nom":"7","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8672265271601,4.95631734759459]},"properties":{"nom":"8","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8673626701318,4.98775355007457]},"properties":{"nom":"9","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9575232150351,4.98735333700249]},"properties":{"nom":"10","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.957932101,5.077769388],[-53.957523215,4.987353337],[-53.86736267,4.98775355],[-53.867226527,4.956317348],[-53.777063114,4.956702765],[-53.776987892,4.938687225],[-53.569873008,4.939523155],[-53.570206958,5.025376089],[-53.759383912,5.02460196],[-53.759612886,5.078649124],[-53.957932101,5.077769388]]]]}},"geojson_origine_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9579321010744,5.07776938770113]},"properties":{"nom":"1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7596128864516,5.07864912381548]},"properties":{"nom":"2","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.759383911755,5.02460196044417]},"properties":{"nom":"3","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.5702069576163,5.02537608911083]},"properties":{"nom":"4","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.5698730075868,4.93952315477954]},"properties":{"nom":"5","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7769878916108,4.93868722476635]},"properties":{"nom":"6","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7770631139658,4.95670276466037]},"properties":{"nom":"7","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8672265271601,4.95631734759459]},"properties":{"nom":"8","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8673626701318,4.98775355007457]},"properties":{"nom":"9","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9575232150351,4.98735333700249]},"properties":{"nom":"10","description":null}}]},"geojson_origine_geo_systeme_id":"4326","geojson4326_forages":null,"geojson_origine_forages":null,"surface":465.5,"communes":[{"id":"97306","nom":"Mana"},{"id":"97311","nom":"Saint-Laurent-du-Maroni"}],"secteurs_maritimes":[],"sdom_zones":["0","2"],"forets":["LDD","MDF","PAUL"]}},"etape_statut_id":"acc","is_brouillon":false,"date":"2001-10-26","id":"CRVhvEIQAc319vUd8BfZoH5W","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-oct01-dpu01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":3201430},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000774145"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOI0100462D"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2001-10-24","id":"Ce4K8goEZzjqXRJLL051jcpD","ordre":1,"note":{"valeur":"Décret du 24 octobre 2001 accordant un permis de recherches A en Guyane","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-oct01-dex01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"2001-11-01","demarche_date_fin":"2006-11-01","ordre":1},{"id":"PnFewl8P4Zt5Vm49zXqyn7Ml","slug":"m-pr-bon-espoir-2001-pr101","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["auru"],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2010-03-02","id":"qtn2a3DNPx258VZgSjqXGKf6","ordre":4,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr101-dpu02","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":560000},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000021889053"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"DEVO1003938A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2010-02-17","id":"tjOMgkb83wksMc6DFuqrecbu","ordre":3,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr101-dex02","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"2010-02-17-arr-a26ea089","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"arr","description":"Arrêté du 17 février 2010 modifiant l'arrêté du 6 mai 2009 prolongeant la validité du permis exclusif de recherches de mines d'or dit « Permis de Bon Espoir » et réduisant sa surface (Guyane)"}],"avis_documents":[]},{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":"2011-10-31","duree":null,"substances":["auru"],"titulaireIds":null,"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.9577777777778,5.07666666666667],[-53.9575,5.0325],[-53.8944444444444,5.00055555555556],[-53.8208333333333,4.97972222222222],[-53.7138888888889,4.96388888888889],[-53.7322222222222,5.02361111111111],[-53.8763888888889,5.02277777777778],[-53.9577777777778,5.07666666666667]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9577777777778,5.07666666666667]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8763888888889,5.02277777777778]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7322222222222,5.02361111111111]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7138888888889,4.96388888888889]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8208333333333,4.97972222222222]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8944444444444,5.00055555555556]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9575,5.0325]},"properties":{"nom":"G","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.957777778,5.076666667],[-53.9575,5.0325],[-53.894444444,5.000555556],[-53.820833333,4.979722222],[-53.713888889,4.963888889],[-53.732222222,5.023611111],[-53.876388889,5.022777778],[-53.957777778,5.076666667]]]]}},"geojson_origine_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9577777777778,5.07666666666667]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8763888888889,5.02277777777778]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7322222222222,5.02361111111111]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.7138888888889,4.96388888888889]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8208333333333,4.97972222222222]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.8944444444444,5.00055555555556]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.9575,5.0325]},"properties":{"nom":"G","description":null}}]},"geojson_origine_geo_systeme_id":"4326","geojson4326_forages":null,"geojson_origine_forages":null,"surface":122.275,"communes":[{"id":"97306","nom":"Mana"},{"id":"97311","nom":"Saint-Laurent-du-Maroni"}],"secteurs_maritimes":[],"sdom_zones":["0","2"],"forets":["LDD","PAUL"]}},"etape_statut_id":"acc","is_brouillon":false,"date":"2009-05-16","id":"07cbyPCYcOtKYkw4kOqg2Sed","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr101-dpu01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":837000},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000020616467"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"DEVO0909004A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2009-05-06","id":"orsPMmIfX4kSgVus0HTrBxAo","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr101-dex01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"2009-05-06-arr-54f88e41","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"arr","description":"Arrêté du 6 mai 2009 prolongeant la validité du permis exclusif de recherches de mines d'or dit « Permis Bon Espoir » et réduisant sa superficie (Guyane)"}],"avis_documents":[]}],"demarche_type_id":"pr1","demarche_statut_id":"acc","demarche_date_debut":"2006-11-01","demarche_date_fin":"2011-10-31","ordre":2},{"id":"EMFAv33wlGqMcjd6DwKzQBvr","slug":"m-pr-bon-espoir-2001-pr201","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":"2016-10-31","duree":60,"substances":["auru","scoc"],"titulaireIds":["fr-401802863"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2015-08-15","id":"Qp5DRYEN3Nc9n4CIwEYW7evs","ordre":9,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr201-dpu01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":1250000},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000031053068"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"EINL1518062A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":60,"substances":["auru","scoc"],"titulaireIds":["fr-401802863"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2015-08-03","id":"ABvgimvovFWeEhoMOrKi4wAy","ordre":8,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr201-dex01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"2015-08-03-arm-8bf71a65","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"arm","description":"Arrêté du 3 août 2015 prolongeant la durée de validité du permis exclusif de recherches de mines d'or et de substances connexes dit « Permis de Bon Espoir » attribué à la société Armina Ressources Minières dans le département de Guyane"}],"avis_documents":[]},{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2011-06-30","id":"nLXaR7H78V43GB47ypDoqvKz","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr201-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":60,"substances":["auru","arge","cuiv"],"titulaireIds":["fr-401802863"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"fai","is_brouillon":false,"date":"2011-06-29","id":"iV47juaOeL4EAUsOqiWN6gOO","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-bon-espoir-2001-pr201-mfr01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"pr2","demarche_statut_id":"acc","demarche_date_debut":"2011-10-31","demarche_date_fin":"2016-10-31","ordre":3}],"nb_activites_to_do":null})
    bonEspoirData.nb_activites_to_do = 0
    // prettier-ignore
    bonEspoirData.demarches.push(demarcheGetValidator.parse({
      "id": "idtravaux", "ordre": 4, "slug": "m-pr-bon-espoir-2001-dam01", "description": null, "etapes": [{ "etape_type_id": "wpo", "is_brouillon": false, "ordre": 4, note: {valeur: '', is_avertissement: false}, "etape_statut_id": "acc", "date": "2012-07-23", "id": "idEtapeTravaux1", "slug": "m-pr-bon-espoir-2001-dam01-wpo01", "sections_with_values": [], "entreprises_documents": [], "avis_documents": [], "etape_documents": [{ "id": "2012-07-23-apd-607c3aa8", "description": "N°2012-SPR-DRMSS-1", "etape_document_type_id": "apd", "public_lecture": false, "entreprises_lecture": false }] }, { "etape_type_id": "wpp", is_brouillon: ETAPE_IS_NOT_BROUILLON, "ordre": 3, note: { valeur: 'note importante', is_avertissement: true },"etape_statut_id": "fai","date": "2011-05-04","id": "idEtapeTravaux2","slug": "m-pr-bon-espoir-2001-dam01-wpp01","sections_with_values": [],"entreprises_documents": [],"avis_documents":[],"etape_documents": [{"id": "id_Document","description": "","etape_document_type_id": "apu","public_lecture": false,"entreprises_lecture": false	}]},	{"etape_type_id": "wfd",is_brouillon: ETAPE_IS_NOT_BROUILLON, "ordre": 2,note: {valeur: '', is_avertissement: false}, "etape_statut_id": "fai","date": "2010-10-01","id": "idEtapeTravaux3","slug": "m-pr-bon-espoir-2001-dam01-wfd01","sections_with_values": [],"entreprises_documents": [],"etape_documents": [],"avis_documents":[]},	{"etape_type_id": "wre",is_brouillon: ETAPE_IS_NOT_BROUILLON,"ordre": 1,note: {valeur: '', is_avertissement: false},"etape_statut_id": "fav","date": "2010-10-01","id": "idEtapeTravaux4","slug": "m-pr-bon-espoir-2001-dam01-wre01","sections_with_values": [],"entreprises_documents": [],"etape_documents": [],"avis_documents":[]}],"demarche_type_id": "dam","demarche_statut_id": "fpm","demarche_date_debut": null,"demarche_date_fin": null


  }))
    // prettier-ignore
    bonEspoirData.demarches.push(demarcheGetValidator.parse({"id":"KxHulLhT5XtziPhZDWpFuyA9", "ordre": 5, "slug":"m-pr-bon-espoir-2001-vct01","description":null,"etapes":[{"etape_type_id":"mcr",is_brouillon: ETAPE_IS_NOT_BROUILLON,"etape_statut_id":"fav","date":"2017-08-07","id":"OOKaEetpmAhDX17hcLEFWTZ1","ordre":4,note: {valeur: '', is_avertissement: false},"slug":"m-pr-bon-espoir-2001-vct01-mcr01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mdp",is_brouillon: ETAPE_IS_NOT_BROUILLON,"etape_statut_id":"fai","date":"2016-11-07","id":"fNt0G9CmdMc6iIG9x239wZ5E","ordre":2,note: {valeur: '', is_avertissement: false},"slug":"m-pr-bon-espoir-2001-vct01-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr",is_brouillon: ETAPE_IS_NOT_BROUILLON,"fondamentale":{"date_debut":null,"date_fin":null,"duree":180,"substances":["auru","scoc"],"titulaireIds":["fr-401802863"],"amodiataireIds":null,"perimetre":{"geojson4326_points": null,"geojson4326_forages":null,"geojson_origine_forages":null,"geojson_origine_points": null, "geojson4326_perimetre":{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[-53.95781742722346,5.076877972864504],[-53.95761604147164,5.032517695391918],[-53.894654620091046,5.000735152488521],[-53.82094960753945,4.97999409410299],[-53.71414492282594,4.963998224562106],[-53.73241245985785,5.023653513799631],[-53.87657715038456,5.023033474690702],[-53.95781742722346,5.076877972864504]]]]},"properties":null}, "geojson_origine_perimetre":{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[-53.95781742722346,5.076877972864504],[-53.95761604147164,5.032517695391918],[-53.894654620091046,5.000735152488521],[-53.82094960753945,4.97999409410299],[-53.71414492282594,4.963998224562106],[-53.73241245985785,5.023653513799631],[-53.87657715038456,5.023033474690702],[-53.95781742722346,5.076877972864504]]]]},"properties":null},"geojson_origine_geo_systeme_id":"4326","surface":122.275,"communes":[{"id":"97311","nom":"Saint-Laurent-du-Maroni"},{"id":"97306","nom":"Mana"}],"secteurs_maritimes":[],"sdom_zones":["0","2"],"forets":["LDD","PAUL"]}},"etape_statut_id":"fai","date":"2016-10-28","id":"VqBn5DzAtcMQWFY0CIiO6X1A","ordre":1,note: {valeur: '', is_avertissement: false},"slug":"m-pr-bon-espoir-2001-vct01-mfr01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]}],"entreprises_documents":[],"etape_documents":[], "avis_documents":[]}],"demarche_type_id":"vct","demarche_statut_id":"ins","demarche_date_debut":"2016-10-31","demarche_date_fin":null}))

    return Promise.resolve(bonEspoirData)
  },
}

export const BonEspoirOctroi: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-pr-bon-espoir-2001-oct01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'entreprise', entreprises: [{ id: entrepriseIdValidator.parse('fr-401802863') }] }}
    router={routerPushMock}
    apiClient={bonEspoirApiClient}
    titreIdOrSlug={titre.id}
  />
)

export const BonEspoirProlongation2: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-pr-bon-espoir-2001-pr201')}
    initTab="points"
    user={{ ...testBlankUser, role: 'entreprise', entreprises: [{ id: entrepriseIdValidator.parse('fr-401802863') }] }}
    router={routerPushMock}
    apiClient={bonEspoirApiClient}
    titreIdOrSlug={titre.id}
  />
)

export const BonEspoirTravaux: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-pr-bon-espoir-2001-dam01')}
    initTab="points"
    user={{ ...testBlankUser, role: 'entreprise', entreprises: [{ id: entrepriseIdValidator.parse('fr-401802863') }] }}
    router={routerPushMock}
    apiClient={bonEspoirApiClient}
    titreIdOrSlug={titre.id}
  />
)

const basseManaApiClient: PropsApiClient = {
  ...apiClient,
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const basseManaData = titreGetValidator.parse({"id":"ORKjSbwrb87xE53MsYClV8OF","nom":"Basse Mana","slug":"m-pr-basse-mana-2018","titre_type_id":"prm","titre_statut_id":"sup","titre_doublon":null,"references":[{"nom":"22/2018","referenceTypeId":"dea"},{"nom":"2016-0010-MI","referenceTypeId":"deb"}],"titre_last_modified_date":"2023-12-19","demarches":[{"id":"GnIerujOWqlS3U06Xcbc1Dr0","slug":"m-pr-basse-mana-2018-oct01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":36,"substances":["tant","niob","lith","bery","etai","wolf","tita","auru"],"titulaireIds":["fr-790856850"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.699125239725,5.29137675727333],[-53.735659753333,5.24333287037071],[-53.6847736578144,5.232646225266],[-53.664223513371,5.23752353831223],[-53.6554344678131,5.25034817283726],[-53.6402449164671,5.25044876137938],[-53.6331053301638,5.26979119871868],[-53.6650166925488,5.27353207619541],[-53.699125239725,5.29137675727333]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.699125239725,5.29137675727333]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6650166925488,5.27353207619541]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6331053301638,5.26979119871868]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6402449164671,5.25044876137938]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6554344678131,5.25034817283726]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.664223513371,5.23752353831223]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6847736578144,5.232646225266]},"properties":{"nom":"G","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.735659753333,5.24333287037071]},"properties":{"nom":"H","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[200814,585525],[204589,583534],[208127,583105],[207326,580968],[205641,580964],[204660,579549],[202378,579019],[196738,580226],[200814,585525]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[200814,585525]},"properties":{"nom":"A"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204589,583534]},"properties":{"nom":"B"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[208127,583105]},"properties":{"nom":"C"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[207326,580968]},"properties":{"nom":"D"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[205641,580964]},"properties":{"nom":"E"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204660,579549]},"properties":{"nom":"F"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[202378,579019]},"properties":{"nom":"G"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[196738,580226]},"properties":{"nom":"H"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":48,"communes":[{"id":"97306","nom":"Mana"}],"secteurs_maritimes":[],"sdom_zones":["2"],"forets":["BSM"]}},"etape_statut_id":"acc","is_brouillon":false,"date":"2018-09-11","id":"ooH6ZbECJPcDPFsE0McnKvUm","ordre":9,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-oct01-dpu01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":150000},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000037382008"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOL1816264A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":36,"substances":["tant","niob","lith","bery","etai","wolf","tita","auru"],"titulaireIds":["fr-790856850"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.699125239725,5.29137675727333],[-53.735659753333,5.24333287037071],[-53.6847736578144,5.232646225266],[-53.664223513371,5.23752353831223],[-53.6554344678131,5.25034817283726],[-53.6402449164671,5.25044876137938],[-53.6331053301638,5.26979119871868],[-53.6650166925488,5.27353207619541],[-53.699125239725,5.29137675727333]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.699125239725,5.29137675727333]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6650166925488,5.27353207619541]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6331053301638,5.26979119871868]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6402449164671,5.25044876137938]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6554344678131,5.25034817283726]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.664223513371,5.23752353831223]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.6847736578144,5.232646225266]},"properties":{"nom":"G","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.735659753333,5.24333287037071]},"properties":{"nom":"H","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[200814,585525],[204589,583534],[208127,583105],[207326,580968],[205641,580964],[204660,579549],[202378,579019],[196738,580226],[200814,585525]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[200814,585525]},"properties":{"nom":"A"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204589,583534]},"properties":{"nom":"B"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[208127,583105]},"properties":{"nom":"C"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[207326,580968]},"properties":{"nom":"D"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[205641,580964]},"properties":{"nom":"E"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204660,579549]},"properties":{"nom":"F"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[202378,579019]},"properties":{"nom":"G"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[196738,580226]},"properties":{"nom":"H"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":48,"communes":[{"id":"97306","nom":"Mana"}],"secteurs_maritimes":[],"sdom_zones":["2"],"forets":["BSM"]}},"etape_statut_id":"acc","is_brouillon":false,"date":"2018-08-31","id":"KJtV68vswF5ewUyF2jTuLGhS","ordre":8,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-oct01-dex01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":150000},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":"EUR"}]},{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":"JORFTEXT000037382008"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOL1816264A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2016-08-28","id":"qVJM9zS6hWyIr3My5OoubQA3","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-oct01-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":36,"substances":["tant","niob","scoc"],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"fai","is_brouillon":false,"date":"2016-06-19","id":"abABihashClZP0lL3NUPELNV","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-oct01-mfr01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"2018-09-11","demarche_date_fin":"2021-09-11","ordre":1},{"id":"mZAUVvPyznbzpj3e3grjFmlJ","slug":"m-pr-basse-mana-2018-pr101","description":null,"etapes":[{"etape_type_id":"rpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"fai","is_brouillon":false,"date":"2023-11-17","id":"f76c17ab21ca966988390d92","ordre":11,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-rpu01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2023-11-15","id":"71f6497117b21325d53d8e56","ordre":10,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"Texte 3 sur 160"}]}],"entreprises_documents":[],"etape_documents":[{"id":"2023-11-15-pub-4d420801","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"pub","description":""}],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":30,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2023-11-07","id":"590f6dd2f808eeadf51b820e","ordre":9,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"ppc","etape_statut_id":"ter","is_brouillon":false,"date":"2023-04-14","id":"da4a6c74690a6d1ef01ddde2","ordre":6,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-ppc01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"ppu","etape_statut_id":"fai","is_brouillon":false,"date":"2023-03-27","id":"M1mK0vhAHH5CTaUwq4cJzK49","ordre":5,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-ppu01","sections_with_values":[{"id":"opdp","elements":[{"id":"lien","nom":"Lien public externe","description":"","optionnel":true,"type":"url","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2021-04-30","id":"wFb34sxGyHoRNOByPffQZyAF","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":60,"substances":["tant","niob","lith","bery","etai","wolf","tita","auru"],"titulaireIds":["fr-790856850"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.699150462397206,5.291394409468797],[-53.73568497160258,5.2433505257409125],[-53.684798879087204,5.232663883719148],[-53.664248736219285,5.2375411971227654],[-53.65545969176547,5.250365830767107],[-53.64027014144058,5.250466419912988],[-53.633130556393525,5.269808855679936],[-53.66511918689031,5.291623119512839],[-53.699150462397206,5.291394409468797]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.699150462397206,5.291394409468797]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.66511918689031,5.291623119512839]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.633130556393525,5.269808855679936]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.64027014144058,5.250466419912988]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.65545969176547,5.250365830767107]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.664248736219285,5.2375411971227654]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.684798879087204,5.232663883719148]},"properties":{"nom":"G","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.73568497160258,5.2433505257409125]},"properties":{"nom":"H","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[200814,585525],[204589,585534],[208127,583105],[207326,580968],[205641,580964],[204660,579549],[202378,579019],[196738,580226],[200814,585525]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[200814,585525]},"properties":{"nom":"A"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204589,585534]},"properties":{"nom":"B"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[208127,583105]},"properties":{"nom":"C"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[207326,580968]},"properties":{"nom":"D"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[205641,580964]},"properties":{"nom":"E"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204660,579549]},"properties":{"nom":"F"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[202378,579019]},"properties":{"nom":"G"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[196738,580226]},"properties":{"nom":"H"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":48.06,"communes":[{"id":"97306","nom":"Mana"}],"secteurs_maritimes":[],"sdom_zones":["2"],"forets":["BSM"]}},"etape_statut_id":"fai","is_brouillon":false,"date":"2021-04-30","id":"NKW0jIKc5cPBIp2dwu2VceCG","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr101-mfr01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"pr1","demarche_statut_id":"acc","demarche_date_debut":"2021-09-11","demarche_date_fin":"2024-03-11","ordre":2},{"id":"5df48d3536a38dd1dab542d7","slug":"m-pr-basse-mana-2018-pr201","description":"","etapes":[{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2023-10-30","id":"37a1752da216067fc73328f9","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr201-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":60,"substances":["tant","niob","lith","bery","etai","wolf","tita","auru"],"titulaireIds":null,"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-53.695977302723314,5.258026897118486],[-53.69166175320614,5.243894120712839],[-53.691207934852734,5.238962048893827],[-53.66947244758239,5.236434510036549],[-53.66426676493007,5.2375411203489115],[-53.655468706369525,5.250365792413383],[-53.64027010339901,5.25045738302719],[-53.63422022259896,5.267391338838475],[-53.64933956522329,5.274005464773927],[-53.66943759690406,5.2748050575845875],[-53.66988205803166,5.281761503749559],[-53.671594626284566,5.281690874443703],[-53.67432345044184,5.276844434310086],[-53.67742349010169,5.274481516415551],[-53.68523182828244,5.270616251350751],[-53.695977302723314,5.258026897118486]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.695977302723314,5.258026897118486]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.68523182828244,5.270616251350751]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.67742349010169,5.274481516415551]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.67432345044184,5.276844434310086]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.671594626284566,5.281690874443703]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.66988205803166,5.281761503749559]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.66943759690406,5.2748050575845875]},"properties":{"nom":"G","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.64933956522329,5.274005464773927]},"properties":{"nom":"H","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.63422022259896,5.267391338838475]},"properties":{"nom":"I","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.64027010339901,5.25045738302719]},"properties":{"nom":"J","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.655468706369525,5.250365792413383]},"properties":{"nom":"K","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.66426676493007,5.2375411203489115]},"properties":{"nom":"L","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.66947244758239,5.236434510036549]},"properties":{"nom":"M","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.691207934852734,5.238962048893827]},"properties":{"nom":"N","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-53.69166175320614,5.243894120712839]},"properties":{"nom":"O","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[201150,581831],[202348,583219],[203216,583643],[203561,583903],[203866,584438],[204056,584445],[204102,583675],[206331,583577],[208005,582838],[207326,580967],[205640,580964],[204658,579549],[204080,579429],[201670,579719],[201622,580265],[201150,581831]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[201150,581831]},"properties":{"nom":"A"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[202348,583219]},"properties":{"nom":"B"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[203216,583643]},"properties":{"nom":"C"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[203561,583903]},"properties":{"nom":"D"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[203866,584438]},"properties":{"nom":"E"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204056,584445]},"properties":{"nom":"F"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204102,583675]},"properties":{"nom":"G"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[206331,583577]},"properties":{"nom":"H"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[208005,582838]},"properties":{"nom":"I"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[207326,580967]},"properties":{"nom":"J"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[205640,580964]},"properties":{"nom":"K"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204658,579549]},"properties":{"nom":"L"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[204080,579429]},"properties":{"nom":"M"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[201670,579719]},"properties":{"nom":"N"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[201622,580265]},"properties":{"nom":"O"}}]},"geojson_origine_geo_systeme_id":"2972","geojson4326_forages":null,"geojson_origine_forages":null,"surface":20.69,"communes":[{"id":"97306","nom":"Mana"}],"secteurs_maritimes":[],"sdom_zones":["2"],"forets":["BSM"]}},"etape_statut_id":"fai","is_brouillon":false,"date":"2023-10-30","id":"47a22a6ca44891d40e2f4149","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-pr-basse-mana-2018-pr201-mfr01","sections_with_values":[{"id":"prx","nom":"Propriétés du permis exclusif de recherches","elements":[{"id":"engagement","nom":"Engagement","optionnel":true,"type":"number","value":null},{"id":"engagementDeviseId","nom":"Devise de l'engagement","description":"","optionnel":true,"type":"select","options":[{"id":"EUR","nom":"Euros"},{"id":"FRF","nom":"Francs"},{"id":"XPF","nom":"Francs Pacifique"}],"value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"pr2","demarche_statut_id":"dep","demarche_date_debut":"2024-03-11","demarche_date_fin":null,"ordre":3}],"nb_activites_to_do":null})

    return Promise.resolve(basseManaData)
  },
}

export const BasseManaMod: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-pr-basse-mana-2018-pr101')}
    initTab="points"
    user={{ ...testBlankUser, role: 'defaut' }}
    router={routerPushMock}
    apiClient={basseManaApiClient}
    titreIdOrSlug={titreIdValidator.parse('ORKjSbwrb87xE53MsYClV8OF')}
  />
)

export const Empty: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={{
      ...apiClient,
      getTitreById: titreIdOrSlug => {
        getTitreAction(titreIdOrSlug)

        return Promise.resolve({
          id: titreIdValidator.parse('id-du-titre'),
          nb_activites_to_do: 0,
          nom: 'Nom du titre',
          slug: titreSlugValidator.parse('slug-du-titre'),
          titre_type_id: 'arm',
          titre_statut_id: 'val',
          references: [],
          titre_last_modified_date: toCaminoDate('2021-01-01'),
          titre_doublon: null,
          demarches: [],
        })
      },
    }}
    titreIdOrSlug={titre.id}
  />
)

export const WithDoublon: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={{
      ...apiClient,
      getTitreById: titreIdOrSlug => {
        getTitreAction(titreIdOrSlug)

        return Promise.resolve({
          id: titreIdValidator.parse('id-du-titre'),
          nb_activites_to_do: 0,
          nom: 'Nom du titre',
          slug: titreSlugValidator.parse('slug-du-titre'),
          titre_type_id: 'arm',
          titre_statut_id: 'val',
          references: [],
          titre_last_modified_date: toCaminoDate('2021-01-01'),
          titre_doublon: {
            id: titreIdValidator.parse('id-du-doublon'),
            nom: 'Nom du titre en doublon',
          },
          demarches: [],
        })
      },
    }}
    titreIdOrSlug={titre.id}
  />
)

export const WithLinkableTitres: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={{
      ...apiClient,
      loadLinkableTitres:
        (...params) =>
        () => {
          loadLinkableTitresAction(params)

          return Promise.resolve(linkableTitres)
        },
      linkTitres: (...params) => {
        linkTitresAction(params)

        return Promise.resolve({ aval: titresTo, amont: titresFrom })
      },
      loadTitreLinks: titreId => {
        loadTitreLinksAction(titreId)

        return Promise.resolve({
          amont: [{ id: titreIdValidator.parse('idEnAmont'), nom: 'nom du titre en amont' }],
          aval: [{ id: titreIdValidator.parse('idEnAval'), nom: 'nom du titre en aval' }],
        })
      },
      getTitreById: titreIdOrSlug => {
        getTitreAction(titreIdOrSlug)

        return Promise.resolve({
          id: titreIdValidator.parse('id-du-titre'),
          nb_activites_to_do: 0,
          nom: 'Nom du titre',
          slug: titreSlugValidator.parse('slug-du-titre'),
          titre_type_id: 'axm',
          titre_statut_id: 'val',
          references: [],
          titre_last_modified_date: toCaminoDate('2021-01-01'),
          titre_doublon: null,
          demarches: [],
        })
      },
    }}
    titreIdOrSlug={titre.id}
  />
)

const lenoncourtApiClient: PropsApiClient = {
  ...apiClient,
  getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
    getTitreAction(titreIdOrSlug)

    // prettier-ignore
    const lenoncourtData = titreGetValidator.parse({"id":"s7RvqvCAgKs4DxkQBYV93cVx","nom":"Lenoncourt","slug":"m-cx-lenoncourt-1968","titre_type_id":"cxm","titre_statut_id":"val","titre_doublon":null,"references":[{"nom":"2013-0275-MI","referenceTypeId":"deb"},{"nom":"54TM0153","referenceTypeId":"rnt"}],"titre_last_modified_date":"2024-03-21","demarches":[{"id":"ozYnUjy40eru81jUnXz5snv2","slug":"m-cx-lenoncourt-1968-oct01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1968-01-24","id":"SG2zAN9QaKBN1hZKqKEgQGpI","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-oct01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"1968-01-24-dec-89a94bb2","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":"Décret du 13 janvier 1968 instituant la concession de mines de sels de sodium de Lenoncourt (Meurthe-et-Moselle) au profit de la société Les Soudières réunies - La Madeleine-Varangéville"}],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1968-01-13","id":"LM2Zk3PwAjrduc4EqmucOjeB","ordre":1,"note":{"valeur":"Décret du 13 janvier 1968 instituant la concession de mines de sels de sodium de Lenoncourt (Meurthe-et-Moselle) au profit de la société Les Soudières réunies - La Madeleine-Varangéville","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-oct01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"oct","demarche_statut_id":"acc","demarche_date_debut":"1968-01-24","demarche_date_fin":"2024-03-01","ordre":1},{"id":"wM0cpipWSef9lDAHDurJxxhk","slug":"m-cx-lenoncourt-1968-mut01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["selg","selh"],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1970-11-19","id":"XScxzwDKFxmYtDnkJ7X7qZBi","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"1970-11-19-dec-8a77b142","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":"Décret du 16 novembre 1970 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la société Produits chimiques Pechlney-Saint-Gobaln."}],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":["fr-606320471"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1970-11-16","id":"ejAqTpzBj82jgF0ShiwMRQmW","ordre":1,"note":{"valeur":"Décret du 16 novembre 1970 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la société Produits chimiques Pechlney-Saint-Gobaln.","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":2},{"id":"1UC2b0ORsm2ezCh6whHzbOKR","slug":"m-cx-lenoncourt-1968-mut02","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["selg","selh"],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1975-11-27","id":"TjimKkEETzF0yGBG2m085on9","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut02-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"1975-11-27-dec-b50a06f5","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":"Décret du 24 novembre 1975 autorisant la mutation de cinq concessions de mines de sel gemme et de sources salées au profit de la Compagnie industrielle et minière"}],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":["fr-712025048"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1975-11-24","id":"aYO0zwBFBOZP7VN11JaJDhzI","ordre":1,"note":{"valeur":"Décret du 24 novembre 1975 autorisant la mutation de cinq concessions de mines de sel gemme et de sources salées au profit de la Compagnie industrielle et minière","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut02-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":3},{"id":"H5eANAZPKhY9eFQtCyLYjCvp","slug":"m-cx-lenoncourt-1968-exp01","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":["fr-712025048"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[6.275644095814427,48.6854960696669],[6.255874124806144,48.675237870291575],[6.295319143383101,48.66801114312286],[6.316241924966296,48.676189123934925],[6.315656943097024,48.680413137182065],[6.307671761547864,48.69027442550079],[6.302487495007789,48.68919858322589],[6.296317613859298,48.68917495187758],[6.290997693817669,48.68780534512822],[6.285653764289864,48.68913324659737],[6.281744418990354,48.68911774206666],[6.275644095814427,48.6854960696669]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[6.275644095814427,48.6854960696669]},"properties":{"nom":"A","description":"Point situé sur la ligne joignant les clochers de Saulxures-lès-Nancy et de Buissoncourt, à son intersection avec la limite des communes de Saulxures-lès-Nancy et de Lenoncourt, soit à environ 2040 mètres à l'Est-Sud-Est du clocher de Saulxures-lès-Nancy"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.281744418990354,48.68911774206666]},"properties":{"nom":"B1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.285653764289864,48.68913324659737]},"properties":{"nom":"C1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.290997693817669,48.68780534512822]},"properties":{"nom":"D1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.296317613859298,48.68917495187758]},"properties":{"nom":"E1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.302487495007789,48.68919858322589]},"properties":{"nom":"F1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.307671761547864,48.69027442550079]},"properties":{"nom":"G1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.315656943097024,48.680413137182065]},"properties":{"nom":"B","description":"Point situé sur la ligne joignant les clochers de Saulxures-lès-Nancy et de Buissoncourt, à son intersection avec la limite Ouest de la concession de Cercueil-Buissoncourt, soit à environ 2 150 mètres au Nord-Nord-Ouest du clocher de Buissoncourt"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.316241924966296,48.676189123934925]},"properties":{"nom":"C","description":"Borne commune aux concessions d'Art-sur-Meurthe et de Cercueil-Buissoncourt"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.295319143383101,48.66801114312286]},"properties":{"nom":"D","description":"Sommet A de la concession d'Art-sur-Meurthe:"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.255874124806144,48.675237870291575]},"properties":{"nom":"E","description":"Sommet M de la concession d'Art-sur•Meurthe:"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[889907.42,1117010.26],[890334.9,1117435.93],[890622.24,1117452.72],[891022.89,1117325.88],[891406.04,1117498.53],[891859.53,1117525.03],[892234.39,1117664.59],[892879.34,1116600.52],[892947.15,1116133.73],[891456.2,1115144.46],[888513.03,1115795.21],[889907.42,1117010.26]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[889907.42,1117010.26]},"properties":{"nom":"A","description":"Point situé sur la ligne joignant les clochers de Saulxures-lès-Nancy et de Buissoncourt, à son intersection avec la limite des communes de Saulxures-lès-Nancy et de Lenoncourt, soit à environ 2040 mètres à l’Est-Sud-Est du clocher de Saulxures-lès-Nancy"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[890334.9,1117435.93]},"properties":{"nom":"B1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[890622.24,1117452.72]},"properties":{"nom":"C1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[891022.89,1117325.88]},"properties":{"nom":"D1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[891406.04,1117498.53]},"properties":{"nom":"E1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[891859.53,1117525.03]},"properties":{"nom":"F1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[892234.39,1117664.59]},"properties":{"nom":"G1"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[892879.34,1116600.52]},"properties":{"nom":"B","description":"Point situé sur la ligne joignant les clochers de Saulxures-lès-Nancy et de Buissoncourt, à son intersection avec la limite Ouest de la concession de Cercueil-Buissoncourt, soit à environ 2 150 mètres au Nord-Nord-Ouest du clocher de Buissoncourt"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[892947.15,1116133.73]},"properties":{"nom":"C","description":"Borne commune aux concessions d’Art-sur-Meurthe et de Cercueil-Buissoncourt"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[891456.2,1115144.46]},"properties":{"nom":"D","description":"Sommet A de la concession d’Art-sur-Meurthe:"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[888513.03,1115795.21]},"properties":{"nom":"E","description":"Sommet M de la concession d’Art-sur•Meurthe:"}}]},"geojson_origine_geo_systeme_id":"27571","geojson4326_forages":null,"geojson_origine_forages":null,"surface":6.75,"communes":[{"id":"54495","nom":"Saulxures-lès-Nancy"},{"id":"54311","nom":"Lenoncourt"},{"id":"54110","nom":"Cerville"},{"id":"54025","nom":"Art-sur-Meurthe"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"acc","is_brouillon":false,"date":"1981-09-13","id":"C6UHWZDSFnLbwuaeksXG1SEj","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-exp01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"N"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"1981-09-13-dec-8bf8fa4c","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":"Décret du 9 septembre 1981 portant extension de superficie de la concession des mines de sels de sodium de Lenoncourt (Meurthe-et-Moselle) et modifiant les conditions auxquelles est soumise ladite concession"}],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"1981-09-09","id":"xHxKuYk5goClAaZr1hxGaCyr","ordre":1,"note":{"valeur":"Décret du 9 septembre 1981 portant extension de superficie de la concession des mines de sels de sodium de Lenoncourt (Meurthe-et-Moselle) et modifiant les conditions auxquelles est soumise ladite concession","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-exp01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"exp","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":4},{"id":"W9IX7VanFA5iYxYAGulcA0CY","slug":"m-cx-lenoncourt-1968-mut03","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":["fr-442993283"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2000-10-06","id":"wuYTEAQ5UUAUZxiowQIthgkg","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut03-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000208330"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOI0000456A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2000-09-26","id":"f2iSnn7XPrOXDIrbmYFKUiz1","ordre":1,"note":{"valeur":"Arrêté du 26 septembre 2000 autorisant la mutation de concessions de mines","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut03-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":6},{"id":"md9yLbhZSOqdcOANAAyUPTur","slug":"m-cx-lenoncourt-1968-mut04","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":["fr-642014526"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2003-01-08","id":"yuMPprDNtN6mZzdmlVTDd25I","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut04-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000228627"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"INDI0200856A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2002-12-24","id":"jZRW7aZo5DmTABnQCe35wVrh","ordre":1,"note":{"valeur":"Arrêté du 24 décembre 2002 autorisant la mutation de concessions de mines","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut04-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":7},{"id":"3W0rdHS1VqDSIQjZ1mLD8b9L","slug":"m-cx-lenoncourt-1968-mut05","description":null,"etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":["fr-442993283"],"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2004-02-28","id":"isgwwZGJwv7UDuJvtxAaj3T4","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut05-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000000434866"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"INDI0402498A"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":[],"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2004-02-13","id":"Full4Vnptm6czWaJ4b6kZR6W","ordre":1,"note":{"valeur":"Arrêté du 13 février 2004 autorisant la mutation d’une concession de mines de sels de sodium","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-mut05-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"mut","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":8},{"id":"fA9NJsMZ78XyG402LUdm2Szi","slug":"m-cx-lenoncourt-1968-pro01","description":"prolongation et extension de périmètre","etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2024-03-01","id":"a0af6a2e56cd046cd72c71cf","ordre":16,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000049219226"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOL2320431D"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2024-02-29","id":"aa23dc021366330e04383eba","ordre":15,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"2024-02-29-dec-12df6369","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":""},{"id":"2024-02-29-dec-4bb7fd91","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":""}],"avis_documents":[]},{"etape_type_id":"epc","etape_statut_id":"ter","is_brouillon":false,"date":"2021-06-02","id":"3JEmzfDaS6MZdQGthz69jydI","ordre":8,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-epc01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"ama","etape_statut_id":"def","is_brouillon":false,"date":"2021-06-01","id":"ryW6mbg2cC906CimQRgdVhvd","ordre":7,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-ama01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"epu","etape_statut_id":"fai","is_brouillon":false,"date":"2021-04-20","id":"d1PRxUd0F9JHQSziUQ3skOem","ordre":6,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-epu01","sections_with_values":[{"id":"odlep","elements":[{"id":"lien","nom":"Lien public externe","description":"","optionnel":true,"type":"url","value":null}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mcr","etape_statut_id":"fav","is_brouillon":false,"date":"2021-01-27","id":"pHf3m1Hygp8kz8d7G0j2TKgZ","ordre":4,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-mcr01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mdp","etape_statut_id":"fai","is_brouillon":false,"date":"2020-08-04","id":"mQnOvtSGpc1T83bSvOOorVOa","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-mdp01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"mfr","fondamentale":{"date_debut":null,"date_fin":null,"duree":300,"substances":["nacl"],"titulaireIds":["fr-442993283"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[6.255869021711159,48.675202067410254],[6.263459497281365,48.6611397799328],[6.274477936823362,48.661530617274785],[6.29531036181682,48.66798716858568],[6.3162302722649795,48.67616624512283],[6.31565519531486,48.68038643555574],[6.307660371971501,48.69025022534333],[6.302480013569365,48.68917854238857],[6.2963188041374485,48.68915103738882],[6.290983811108587,48.68777705995633],[6.285642745098623,48.68911271820202],[6.281739260684181,48.68909422269382],[6.275638319504659,48.68547207905551],[6.255869021711159,48.675202067410254]]]]}},"geojson4326_points":{"type":"FeatureCollection","properties":{},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[6.255869021711159,48.675202067410254]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.275638319504659,48.68547207905551]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.281739260684181,48.68909422269382]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.285642745098623,48.68911271820202]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.290983811108587,48.68777705995633]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2963188041374485,48.68915103738882]},"properties":{"nom":"F","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.302480013569365,48.68917854238857]},"properties":{"nom":"G","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.307660371971501,48.69025022534333]},"properties":{"nom":"H","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.31565519531486,48.68038643555574]},"properties":{"nom":"I","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3162302722649795,48.67616624512283]},"properties":{"nom":"J","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.29531036181682,48.66798716858568]},"properties":{"nom":"K","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.274477936823362,48.661530617274785]},"properties":{"nom":"L","description":"Nouveau sommet « d’extension » défini par NOVACARB"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.263459497281365,48.6611397799328]},"properties":{"nom":"M","description":"Nouveau sommet « d’extension » défini par NOVACARB"}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[939659,6846613],[941066,6847814],[941498,6848235],[941785,6848249],[942184,6848117],[942570,6848286],[943023,6848308],[943399,6848443],[944033,6847372],[944095,6846905],[942594,6845932],[941091,6845151],[940282,6845074],[939659,6846613]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[939659,6846613]},"properties":{"nom":"A"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[941066,6847814]},"properties":{"nom":"B"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[941498,6848235]},"properties":{"nom":"C"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[941785,6848249]},"properties":{"nom":"D"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[942184,6848117]},"properties":{"nom":"E"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[942570,6848286]},"properties":{"nom":"F"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[943023,6848308]},"properties":{"nom":"G"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[943399,6848443]},"properties":{"nom":"H"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[944033,6847372]},"properties":{"nom":"I"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[944095,6846905]},"properties":{"nom":"J"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[942594,6845932]},"properties":{"nom":"K"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[941091,6845151]},"properties":{"nom":"L","description":"Nouveau sommet « d’extension » défini par NOVACARB"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[940282,6845074]},"properties":{"nom":"M","description":"Nouveau sommet « d’extension » défini par NOVACARB"}}]},"geojson_origine_geo_systeme_id":"2154","geojson4326_forages":null,"geojson_origine_forages":null,"surface":9.05,"communes":[{"id":"54495","nom":"Saulxures-lès-Nancy"},{"id":"54311","nom":"Lenoncourt"},{"id":"54110","nom":"Cerville"},{"id":"54025","nom":"Art-sur-Meurthe"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"fai","is_brouillon":false,"date":"2020-07-06","id":"mh70cpBA8jOZWCEDJKupM4Rs","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-pro01-mfr01","sections_with_values":[],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]}],"demarche_type_id":"pro","demarche_statut_id":"acc","demarche_date_debut":"2024-03-01","demarche_date_fin":"2049-03-01","ordre":11},{"id":"b7586ad241a658ae1eb42b08","slug":"m-cx-lenoncourt-1968-exp02","description":"","etapes":[{"etape_type_id":"dpu","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":null,"titulaireIds":null,"amodiataireIds":null,"perimetre":null},"etape_statut_id":"acc","is_brouillon":false,"date":"2024-03-01","id":"e48a19b86d090feadc67a893","ordre":2,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-exp02-dpu01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":false,"type":"text","value":"JORFTEXT000049219226"},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":"ECOL2320431D"}]}],"entreprises_documents":[],"etape_documents":[],"avis_documents":[]},{"etape_type_id":"dex","fondamentale":{"date_debut":null,"date_fin":null,"duree":null,"substances":["nacl"],"titulaireIds":["fr-442993283"],"amodiataireIds":null,"perimetre":{"geojson4326_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[6.2559,48.6752],[6.2756,48.6855],[6.2817,48.6891],[6.2856,48.6891],[6.291,48.6878],[6.2963,48.6892],[6.3025,48.6892],[6.3076,48.689],[6.3157,48.6804],[6.3162,48.6762],[6.2953,48.668],[6.2794,48.6631],[6.2614,48.6649],[6.2559,48.6752]]]]}},"geojson4326_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2559,48.6752]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2756,48.6855]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2817,48.6891]},"properties":{"nom":"B1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2856,48.6891]},"properties":{"nom":"C1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.291,48.6878]},"properties":{"nom":"D1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2963,48.6892]},"properties":{"nom":"E1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3025,48.6892]},"properties":{"nom":"F1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3076,48.689]},"properties":{"nom":"G1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3157,48.6804]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3162,48.6762]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2953,48.668]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2794,48.6631]},"properties":{"nom":"Da","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2614,48.6649]},"properties":{"nom":"Db","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2559,48.6752]},"properties":{"nom":"E","description":null}}]},"geojson_origine_perimetre":{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[6.2559,48.6752],[6.2756,48.6855],[6.2817,48.6891],[6.2856,48.6891],[6.291,48.6878],[6.2963,48.6892],[6.3025,48.6892],[6.3076,48.689],[6.3157,48.6804],[6.3162,48.6762],[6.2953,48.668],[6.2794,48.6631],[6.2614,48.6649],[6.2559,48.6752]]]]}},"geojson_origine_points":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2559,48.6752]},"properties":{"nom":"E","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2756,48.6855]},"properties":{"nom":"A","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2817,48.6891]},"properties":{"nom":"B1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2856,48.6891]},"properties":{"nom":"C1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.291,48.6878]},"properties":{"nom":"D1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2963,48.6892]},"properties":{"nom":"E1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3025,48.6892]},"properties":{"nom":"F1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3076,48.689]},"properties":{"nom":"G1","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3157,48.6804]},"properties":{"nom":"B","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.3162,48.6762]},"properties":{"nom":"C","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2953,48.668]},"properties":{"nom":"D","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2794,48.6631]},"properties":{"nom":"Da","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2614,48.6649]},"properties":{"nom":"Db","description":null}},{"type":"Feature","geometry":{"type":"Point","coordinates":[6.2559,48.6752]},"properties":{"nom":"E","description":null}}]},"geojson_origine_geo_systeme_id":"4326","geojson4326_forages":null,"geojson_origine_forages":null,"surface":8.65,"communes":[{"id":"54495","nom":"Saulxures-lès-Nancy"},{"id":"54311","nom":"Lenoncourt"},{"id":"54110","nom":"Cerville"},{"id":"54025","nom":"Art-sur-Meurthe"}],"secteurs_maritimes":[],"sdom_zones":[],"forets":[]}},"etape_statut_id":"acc","is_brouillon":false,"date":"2024-02-29","id":"c15f4ceaa62a6298a2f8e117","ordre":1,"note":{"valeur":"","is_avertissement":false},"slug":"m-cx-lenoncourt-1968-exp02-dex01","sections_with_values":[{"id":"publication","nom":"Références Légifrance","elements":[{"id":"jorf","nom":"Numéro JORF","description":"","optionnel":true,"type":"text","value":null},{"id":"nor","nom":"Numéro NOR","description":"","optionnel":true,"type":"text","value":null}]}],"entreprises_documents":[],"etape_documents":[{"id":"2024-02-29-dec-d9f1e868","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":""},{"id":"2024-02-29-dec-32312304","public_lecture":true,"entreprises_lecture":true,"etape_document_type_id":"dec","description":""}],"avis_documents":[]}],"demarche_type_id":"exp","demarche_statut_id":"acc","demarche_date_debut":null,"demarche_date_fin":null,"ordre":12}],"nb_activites_to_do":null})

    return Promise.resolve(lenoncourtData)
  },
}

export const Lenoncourt: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={caminoDateValidator.parse('2024-03-09')}
    currentDemarcheSlug={demarcheSlugValidator.parse('m-cx-lenoncourt-1968-exp02')}
    initTab="points"
    user={{ ...testBlankUser, role: 'defaut' }}
    router={routerPushMock}
    apiClient={lenoncourtApiClient}
    titreIdOrSlug={titreIdValidator.parse('s7RvqvCAgKs4DxkQBYV93cVx')}
  />
)

export const TitreAvecUneSeuleDemarcheEnConstruction: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    initTab="points"
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={{
      ...apiClient,
      getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
        getTitreAction(titreIdOrSlug)

        return Promise.resolve({
          ...titre,
          demarches: [
            {
              ...titre.demarches[0],
              demarche_date_debut: null,
            },
          ],
        })
      },
    }}
    titreIdOrSlug={titre.id}
  />
)

export const TitreAvecUnOctroiEnConstructionEtUnTravaux: StoryFn = () => (
  <PureTitre
    entreprises={entreprises}
    currentDate={currentDate}
    currentDemarcheSlug={demarcheSlug}
    initTab="points"
    user={{ ...testBlankUser, role: 'super' }}
    router={routerPushMock}
    apiClient={{
      ...apiClient,
      getTitreById: (titreIdOrSlug: TitreIdOrSlug) => {
        getTitreAction(titreIdOrSlug)

        return Promise.resolve({
          ...titre,
          demarches: [
            {
              ...titre.demarches[0],
              demarche_date_debut: null,
            },
            {
              id: demarcheIdValidator.parse('idtravaux'),
              ordre: 4,
              slug: demarcheSlugValidator.parse('slug_travaux'),
              description: null,
              etapes: [],
              demarche_type_id: 'dam',
              demarche_statut_id: 'fpm',
              demarche_date_debut: null,
              demarche_date_fin: null,
            },
          ],
        })
      },
    }}
    titreIdOrSlug={titre.id}
  />
)

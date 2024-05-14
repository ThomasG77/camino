import { FondamentalesEdit } from './fondamentales-edit'
import { Meta, StoryFn } from '@storybook/vue3'
import { EtapeWithHeritage, etapeIdValidator } from 'camino-common/src/etape'
import { newEntrepriseId } from 'camino-common/src/entreprise'
import { toCaminoDate } from 'camino-common/src/date'
import { testBlankUser } from 'camino-common/src/tests-utils'
import { action } from '@storybook/addon-actions'

const meta: Meta = {
  title: 'Components/Etape/FondamentalesEdit',
  // @ts-ignore @storybook/vue3 n'aime pas les composants tsx
  component: FondamentalesEdit,
}
export default meta

const etape: EtapeWithHeritage = {
  id: etapeIdValidator.parse('id'),
  heritageContenu: {},
  statutId: 'aco',
  typeId: 'mfr',
  contenu: {},
  date: toCaminoDate('2022-02-02'),
  dateDebut: toCaminoDate('2022-02-02'),
  dateFin: null,
  duree: 4,
  substances: ['arse'],
  titulaireIds: [newEntrepriseId('optionId1')],
  amodiataireIds: [],
  notes: null,
  geojson4326Forages: null,
  geojson4326Perimetre: null,
  geojson4326Points: null,
  surface: null,
  geojsonOriginePerimetre: null,
  geojsonOriginePoints: null,
  geojsonOrigineGeoSystemeId: null,
  geojsonOrigineForages: null,
  heritageProps: {
    dateDebut: {
      actif: false,
    },
    dateFin: {
      actif: false,
    },
    duree: {
      actif: false,
      etape: {
        date: toCaminoDate('2022-01-01'),
        typeId: 'mfr',
        duree: 12,
      },
    },
    substances: {
      actif: true,
      etape: {
        date: toCaminoDate('2022-01-01'),
        typeId: 'mfr',
        substances: ['arge'],
      },
    },
    titulaires: {
      actif: false,
    },
    amodiataires: {
      actif: false,
    },
    perimetre: {
      actif: false,
    },
  },
}

const entreprises = [
  {
    id: newEntrepriseId('optionId1'),
    nom: 'optionNom1',
    legal_siren: null,
  },
  {
    id: newEntrepriseId('optionId2'),
    nom: 'optionNom2',
    legal_siren: null,
  },
  {
    id: newEntrepriseId('optionId3'),
    nom: 'optionNom3',
    legal_siren: null,
  },
]

const completeUpdate = action('completeUpdate')

export const AxmDemandeSuper: StoryFn = () => (
  <FondamentalesEdit
    etape={etape}
    completeUpdate={completeUpdate}
    demarcheTypeId="oct"
    titreTypeId="axm"
    user={{
      role: 'super',
      ...testBlankUser,
    }}
    entreprises={entreprises}
  />
)

export const ArmDemandeONF: StoryFn = () => (
  <FondamentalesEdit
    etape={etape}
    completeUpdate={completeUpdate}
    demarcheTypeId="oct"
    titreTypeId="arm"
    user={{
      role: 'admin',
      administrationId: 'ope-onf-973-01',
      ...testBlankUser,
    }}
    entreprises={entreprises}
  />
)

export const ArmDemandeOperateur: StoryFn = () => (
  <FondamentalesEdit etape={etape} completeUpdate={completeUpdate} demarcheTypeId="oct" titreTypeId="arm" user={{ role: 'entreprise', entreprises: [], ...testBlankUser }} entreprises={entreprises} />
)

export const ArmJorfONF: StoryFn = () => (
  <FondamentalesEdit
    etape={{ ...etape, typeId: 'dpu' }}
    completeUpdate={completeUpdate}
    demarcheTypeId="oct"
    titreTypeId="arm"
    user={{ role: 'admin', administrationId: 'ope-onf-973-01', ...testBlankUser }}
    entreprises={entreprises}
  />
)

export const AxmDemandeONF: StoryFn = () => (
  <FondamentalesEdit
    etape={etape}
    completeUpdate={completeUpdate}
    demarcheTypeId="oct"
    titreTypeId="axm"
    user={{ role: 'admin', administrationId: 'ope-onf-973-01', ...testBlankUser }}
    entreprises={entreprises}
  />
)

export const PrmDemandeONF: StoryFn = () => (
  <FondamentalesEdit
    etape={etape}
    completeUpdate={completeUpdate}
    demarcheTypeId="oct"
    titreTypeId="prm"
    user={{ role: 'admin', administrationId: 'ope-onf-973-01', ...testBlankUser }}
    entreprises={entreprises}
  />
)

export const PrmDeplacementDePerimetreONF: StoryFn = () => (
  <FondamentalesEdit
    etape={etape}
    completeUpdate={completeUpdate}
    demarcheTypeId="dep"
    titreTypeId="prm"
    user={{ role: 'admin', administrationId: 'ope-onf-973-01', ...testBlankUser }}
    entreprises={entreprises}
  />
)

import PureEntrepriseFiscalite from './pure-entreprise-fiscalite.vue'
import { Meta, Story } from '@storybook/vue3'
import { Fiscalite } from 'camino-common/src/fiscalite'
import { CaminoAnnee, toCaminoAnnee } from 'camino-common/src/date'

const meta: Meta = {
  title: 'Components/Entreprise/Fiscalite',
  component: PureEntrepriseFiscalite,
  argTypes: {},
}
export default meta

type Props = {
  getFiscaliteEntreprise: (annee: CaminoAnnee) => Promise<Fiscalite>
  anneeCourante: CaminoAnnee
  annees: CaminoAnnee[]
}

const Template: Story<Props> = (args: Props) => ({
  components: { PureEntrepriseFiscalite },
  setup() {
    return { args }
  },
  template: '<PureEntrepriseFiscalite v-bind="args" />',
})

export const Ok = Template.bind({})
Ok.args = {
  getFiscaliteEntreprise: () =>
    Promise.resolve({
      redevanceCommunale: 1600.071,
      redevanceDepartementale: 330.98,
    }),
  anneeCourante: toCaminoAnnee('2022'),
  annees: [toCaminoAnnee('2021'), toCaminoAnnee('2022')],
}

export const Guyane = Template.bind({})
Guyane.args = {
  getFiscaliteEntreprise: (annee: CaminoAnnee) =>
    Promise.resolve({
      redevanceCommunale: Number.parseInt(annee) * 1600.071,
      redevanceDepartementale: Number.parseInt(annee) * 330.98,
      guyane: {
        taxeAurifereBrute: Number.parseInt(annee) * 4100,
        totalInvestissementsDeduits: Number.parseInt(annee) * 100,
        taxeAurifere: Number.parseInt(annee) * 210,
      },
    }),
  anneeCourante: toCaminoAnnee('2022'),
  annees: [toCaminoAnnee('2021'), toCaminoAnnee('2022')],
}

export const GuyaneAnneePrecedente = Template.bind({})
GuyaneAnneePrecedente.args = {
  getFiscaliteEntreprise: (annee: CaminoAnnee) =>
    Promise.resolve({
      redevanceCommunale: Number.parseInt(annee) * 1600.071,
      redevanceDepartementale: Number.parseInt(annee) * 330.98,
      guyane: {
        taxeAurifereBrute: Number.parseInt(annee) * 4100,
        totalInvestissementsDeduits: Number.parseInt(annee) * 100,
        taxeAurifere: Number.parseInt(annee) * 210,
      },
    }),
  anneeCourante: toCaminoAnnee('2021'),
  annees: [toCaminoAnnee('2021'), toCaminoAnnee('2022')],
}

export const Loading = Template.bind({})
Loading.args = {
  getFiscaliteEntreprise: () => new Promise<Fiscalite>(resolve => {}),
  anneeCourante: toCaminoAnnee('2022'),
  annees: [toCaminoAnnee('2021'), toCaminoAnnee('2022')],
}
export const WithError = Template.bind({})
WithError.args = {
  getFiscaliteEntreprise: () => Promise.reject(new Error('because reasons')),
  anneeCourante: toCaminoAnnee('2022'),
  annees: [toCaminoAnnee('2021'), toCaminoAnnee('2022')],
}

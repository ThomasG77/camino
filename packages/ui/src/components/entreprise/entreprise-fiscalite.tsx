import { computed, defineComponent, FunctionalComponent, onMounted, ref } from 'vue'
import { montantNetTaxeAurifere, fraisGestion } from 'camino-common/src/fiscalite'
import type { Fiscalite } from 'camino-common/src/validators/fiscalite'
import { LoadingElement } from '@/components/_ui/functional-loader'
import { AsyncData, CaminoHttpError } from '@/api/client-rest'
import { CaminoAnnee } from 'camino-common/src/date'
import styles from './entreprise-fiscalite.module.css'
import { HTTP_STATUS } from 'camino-common/src/http'
import { map, NonEmptyArray } from 'camino-common/src/typescript-tools'
import { Tab, Tabs } from '../_ui/tabs'
import { Alert } from '../_ui/alert'

interface Props {
  getFiscaliteEntreprise: (annee: CaminoAnnee) => Promise<Fiscalite>
  anneeCourante: CaminoAnnee
  annees: Readonly<NonEmptyArray<CaminoAnnee>>
}
// TODO 2024-05-02: passer en DSFR
export const EntrepriseFiscalite = defineComponent<Props>(props => {
  const tabId = ref<CaminoAnnee>(props.anneeCourante)
  const data = ref<AsyncData<Fiscalite>>({ status: 'LOADING' })
  const isVisible = ref(true)

  const tabUpdate = async (annee: CaminoAnnee): Promise<void> => {
    if (annee !== tabId.value) {
      tabId.value = annee
      await reloadData(annee)
    }
  }

  const tabs = computed<Readonly<NonEmptyArray<Tab<CaminoAnnee>>>>(() => {
    return map(props.annees, annee => {
      return {
        icon: null,
        title: annee,
        id: annee,
        renderContent: () => <FiscaliteByAnnee annees={props.annees} asyncData={data.value} tabId={annee} />,
      }
    })
  })

  onMounted(async () => {
    await reloadData(props.anneeCourante)
  })

  const reloadData = async (annee: CaminoAnnee) => {
    data.value = { status: 'LOADING' }
    try {
      const fiscaliteData = await props.getFiscaliteEntreprise(annee)

      data.value = { status: 'LOADED', value: fiscaliteData }
    } catch (e: any) {
      if (e instanceof CaminoHttpError && e.statusCode === HTTP_STATUS.HTTP_STATUS_FORBIDDEN) {
        isVisible.value = false
      }

      data.value = {
        status: 'ERROR',
        message: e.message ?? 'something wrong happened',
      }
    }
  }

  return () => (
    <div>
      {isVisible.value ? (
        <>
          <h3>Fiscalité</h3>
          Calcul, à titre indicatif, du montant de l'imposition minière de votre entreprise (redevance départementale et communale des mines pour les substances non énergétiques et taxe aurifère)
          <Tabs class="fr-mt-2w" tabs={tabs.value} tabsTitle="Années" initTab={tabId.value} tabClicked={tabUpdate} />
        </>
      ) : null}
    </div>
  )
})

type FiscaliteProps = { tabId: CaminoAnnee; asyncData: AsyncData<Fiscalite> } & Pick<Props, 'annees'>
const FiscaliteByAnnee: FunctionalComponent<FiscaliteProps> = props => {
  const currencyFormat = (number: number) =>
    Intl.NumberFormat('FR-fr', {
      style: 'currency',
      currency: 'EUR',
    }).format(number)

  const sommeAPayer = (fiscalite: Fiscalite) => fiscalite.redevanceCommunale + fiscalite.redevanceDepartementale + montantNetTaxeAurifere(fiscalite) + fraisGestion(fiscalite).toNumber()

  return (
    <>
      {props.annees[props.annees.length - 1] === props.tabId ? (
        <Alert small={true} type="info" title={`Estimation effectuée sur la base des tarifs et des productions déclarées pour l'année ${Number.parseInt(props.tabId) - 1}`} class="fr-mb-1w" />
      ) : null}
      <strong>Cotisations</strong>
      <div class={styles['fiscalite-table']}>
        <div>a. Redevance communale</div>
        <LoadingElement data={props.asyncData} class={styles['fiscalite-value']} renderItem={item => <>{currencyFormat(item.redevanceCommunale)}</>} />
        <div>b. Redevance départementale</div>
        <LoadingElement data={props.asyncData} class={styles['fiscalite-value']} renderItem={item => <>{currencyFormat(item.redevanceDepartementale)}</>} />
        {props.asyncData.status === 'LOADED' && 'guyane' in props.asyncData.value ? (
          <>
            <div>c. Taxe minière sur l’or de Guyane</div>
            <div class={styles['fiscalite-value']}>{currencyFormat(props.asyncData.value.guyane.taxeAurifereBrute)}</div>
            <div>d. Investissements déductibles de la taxe perçue pour la région de Guyane</div>
            <div class={styles['fiscalite-value']}>{currencyFormat(props.asyncData.value.guyane.totalInvestissementsDeduits)}</div>
            <div>e. Montant net de taxe minière sur l’or de Guyane (c-d)</div>
            <div class={styles['fiscalite-value']}>{currencyFormat(montantNetTaxeAurifere(props.asyncData.value))}</div>
          </>
        ) : null}
        <div>f. Frais de gestion de fiscalité directe locale (a+b{props.asyncData.status === 'LOADED' && 'guyane' in props.asyncData.value ? '+e' : ''})X 8%</div>
        <LoadingElement data={props.asyncData} class={styles['fiscalite-value']} renderItem={item => <>{currencyFormat(fraisGestion(item).toNumber())}</>} />
        <div>Somme à payer auprès du comptable (2)</div>
        <LoadingElement data={props.asyncData} class={styles['fiscalite-value']} renderItem={item => <>{currencyFormat(sommeAPayer(item))}</>} />
      </div>
    </>
  )
}

// @ts-ignore waiting for https://github.com/vuejs/core/issues/7833
EntrepriseFiscalite.props = ['anneeCourante', 'annees', 'getFiscaliteEntreprise']

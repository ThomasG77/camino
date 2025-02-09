import { assign, createMachine } from 'xstate'
import { CaminoMachine } from '../machine-helper.js'
import { CaminoCommonContext, DBEtat, Etape } from '../machine-common.js'
import { EtapesTypesEtapesStatuts as ETES } from 'camino-common/src/static/etapesTypesEtapesStatuts.js'
import { DemarchesStatutsIds } from 'camino-common/src/static/demarchesStatuts.js'

type ProcedureSimplifieeXStateEvent =
  | { type: 'FAIRE_DEMANDE' }
  | { type: 'DEPOSER_DEMANDE' }
  | { type: 'OUVRIR_PARTICIPATION_DU_PUBLIC' }
  | { type: 'CLOTURER_PARTICIPATION_DU_PUBLIC' }
  | { type: 'RENDRE_DECISION_ADMINISTRATION_ACCEPTEE' }
  | { type: 'PUBLIER_DECISION_ACCEPTEE_AU_JORF' }
  | { type: 'PUBLIER_DECISION_AU_RECUEIL_DES_ACTES_ADMINISTRATIFS' }
  | { type: 'CLASSER_SANS_SUITE' }
  | { type: 'DESISTER_PAR_LE_DEMANDEUR' }
  | { type: 'DEMANDER_INFORMATION' }
  | { type: 'RECEVOIR_INFORMATION' }

type Event = ProcedureSimplifieeXStateEvent['type']

const trad: { [key in Event]: { db: DBEtat; mainStep: boolean } } = {
  FAIRE_DEMANDE: { db: ETES.demande, mainStep: true },
  DEPOSER_DEMANDE: { db: ETES.depotDeLaDemande, mainStep: true },
  OUVRIR_PARTICIPATION_DU_PUBLIC: { db: ETES.ouvertureDeLaParticipationDuPublic, mainStep: true },
  CLOTURER_PARTICIPATION_DU_PUBLIC: { db: ETES.clotureDeLaParticipationDuPublic, mainStep: true },
  RENDRE_DECISION_ADMINISTRATION_ACCEPTEE: { db: { ACCEPTE: ETES.decisionDeLadministration.ACCEPTE }, mainStep: true },
  PUBLIER_DECISION_ACCEPTEE_AU_JORF: { db: { ACCEPTE: ETES.publicationDeDecisionAuJORF.ACCEPTE }, mainStep: true },
  PUBLIER_DECISION_AU_RECUEIL_DES_ACTES_ADMINISTRATIFS: { db: ETES.publicationDeDecisionAuRecueilDesActesAdministratifs, mainStep: true },
  CLASSER_SANS_SUITE: { db: ETES.classementSansSuite, mainStep: false },
  DESISTER_PAR_LE_DEMANDEUR: { db: ETES.desistementDuDemandeur, mainStep: false },
  DEMANDER_INFORMATION: { db: ETES.demandeDinformations, mainStep: false },
  RECEVOIR_INFORMATION: { db: ETES.receptionDinformation, mainStep: false },
}

// Related to https://github.com/Microsoft/TypeScript/issues/12870
const EVENTS = Object.keys(trad) as Array<Extract<keyof typeof trad, string>>

// basé sur https://drive.google.com/file/d/16lXyw3pcuiP-rHkBBM0U2Al9sWHKCBP9/view
export class ProcedureSimplifieeMachine extends CaminoMachine<ProcedureSimplifieeContext, ProcedureSimplifieeXStateEvent> {
  constructor() {
    super(procedureSimplifieeMachine, trad)
  }

  eventFrom(etape: Etape): ProcedureSimplifieeXStateEvent {
    const entries = Object.entries(trad).filter((entry): entry is [Event, { db: DBEtat; mainStep: boolean }] => EVENTS.includes(entry[0]))

    const entry = entries.find(([_key, { db: dbEtat }]) => {
      return Object.values(dbEtat).some(dbEtatSingle => dbEtatSingle.etapeTypeId === etape.etapeTypeId && dbEtatSingle.etapeStatutId === etape.etapeStatutId)
    })

    if (entry) {
      const eventFromEntry = entry[0]
      switch (eventFromEntry) {
        default:
          // related to https://github.com/microsoft/TypeScript/issues/46497  https://github.com/microsoft/TypeScript/issues/40803 :(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return { type: eventFromEntry }
      }
    }
    throw new Error(`no event from ${JSON.stringify(etape)}`)
  }
}

interface ProcedureSimplifieeContext extends CaminoCommonContext {
  procedureHistorique: boolean
  depotDeLaDemandeFaite: boolean
  ouverturePublicFaite: boolean
  demandeInformationEnCours: boolean
}

const createProcedureMachine = (procedureHistorique: boolean) =>
  createMachine({
    types: {} as { context: ProcedureSimplifieeContext; events: ProcedureSimplifieeXStateEvent },
    id: procedureHistorique ? 'ProcedureHistorique' : 'ProcedureSimplifiee',
    initial: 'demandeAFaire',
    context: {
      procedureHistorique,
      demarcheStatut: DemarchesStatutsIds.EnConstruction,
      visibilite: 'confidentielle',
      depotDeLaDemandeFaite: false,
      ouverturePublicFaite: false,
      demandeInformationEnCours: false,
    },
    on: {
      RENDRE_DECISION_ADMINISTRATION_ACCEPTEE: {
        guard: ({ context }) => context.demarcheStatut === DemarchesStatutsIds.EnConstruction && context.procedureHistorique,
        target: '.publicationAuRecueilDesActesAdministratifsOupublicationAuJORFAFaire',
        actions: assign({
          visibilite: 'publique',
          demarcheStatut: 'acc',
        }),
      },
      CLASSER_SANS_SUITE: {
        guard: ({ context }) => context.demarcheStatut === DemarchesStatutsIds.EnInstruction,
        target: '.finDeMachine',
        actions: assign({
          demarcheStatut: DemarchesStatutsIds.ClasseSansSuite,
        }),
      },
      DESISTER_PAR_LE_DEMANDEUR: {
        guard: ({ context }) => context.demarcheStatut === DemarchesStatutsIds.EnInstruction,
        target: '.finDeMachine',
        actions: assign({
          demarcheStatut: DemarchesStatutsIds.Desiste,
        }),
      },
      DEMANDER_INFORMATION: {
        guard: ({ context }) => context.demarcheStatut === DemarchesStatutsIds.EnInstruction && !context.demandeInformationEnCours,
        actions: assign({
          demandeInformationEnCours: true,
        }),
      },
      RECEVOIR_INFORMATION: {
        guard: ({ context }) => context.demarcheStatut === DemarchesStatutsIds.EnInstruction && context.demandeInformationEnCours,
        actions: assign({
          demandeInformationEnCours: false,
        }),
      },
    },
    states: {
      demandeAFaire: {
        on: {
          FAIRE_DEMANDE: {
            target: 'receptionDeLaDemandeOuOuverturePublicOuDecisionAdministrationAFaire',
            actions: assign({
              demarcheStatut: DemarchesStatutsIds.EnInstruction,
            }),
          },
        },
      },
      receptionDeLaDemandeOuOuverturePublicOuDecisionAdministrationAFaire: {
        on: {
          DEPOSER_DEMANDE: {
            guard: ({ context }) => !context.depotDeLaDemandeFaite && !context.ouverturePublicFaite,
            target: 'receptionDeLaDemandeOuOuverturePublicOuDecisionAdministrationAFaire',
            actions: assign({
              depotDeLaDemandeFaite: true,
            }),
          },
          OUVRIR_PARTICIPATION_DU_PUBLIC: {
            guard: ({ context }) => !context.ouverturePublicFaite,
            actions: assign({
              ouverturePublicFaite: true,
              visibilite: 'publique',
            }),
            target: 'clotureDeLaParticipationDuPublicAFaire',
          },
          RENDRE_DECISION_ADMINISTRATION_ACCEPTEE: {
            actions: assign({
              visibilite: 'publique',
              demarcheStatut: 'acc',
            }),
            target: 'publicationAuRecueilDesActesAdministratifsOupublicationAuJORFAFaire',
          },
        },
      },
      clotureDeLaParticipationDuPublicAFaire: {
        on: {
          CLOTURER_PARTICIPATION_DU_PUBLIC: 'receptionDeLaDemandeOuOuverturePublicOuDecisionAdministrationAFaire',
        },
      },
      publicationAuRecueilDesActesAdministratifsOupublicationAuJORFAFaire: {
        on: {
          PUBLIER_DECISION_ACCEPTEE_AU_JORF: 'finDeMachine',
          PUBLIER_DECISION_AU_RECUEIL_DES_ACTES_ADMINISTRATIFS: 'finDeMachine',
        },
      },
      finDeMachine: {
        type: 'final',
      },
    },
  })

const procedureHistoriqueMachine = createProcedureMachine(true)
const procedureSimplifieeMachine = createProcedureMachine(false)
export class ProcedureHistoriqueMachine extends CaminoMachine<ProcedureSimplifieeContext, ProcedureSimplifieeXStateEvent> {
  constructor() {
    super(procedureHistoriqueMachine, trad)
  }

  eventFrom(etape: Etape): ProcedureSimplifieeXStateEvent {
    const entries = Object.entries(trad).filter((entry): entry is [Event, { db: DBEtat; mainStep: boolean }] => EVENTS.includes(entry[0]))

    const entry = entries.find(([_key, { db: dbEtat }]) => {
      return Object.values(dbEtat).some(dbEtatSingle => dbEtatSingle.etapeTypeId === etape.etapeTypeId && dbEtatSingle.etapeStatutId === etape.etapeStatutId)
    })

    if (entry) {
      const eventFromEntry = entry[0]
      switch (eventFromEntry) {
        default:
          // related to https://github.com/microsoft/TypeScript/issues/46497  https://github.com/microsoft/TypeScript/issues/40803 :(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return { type: eventFromEntry }
      }
    }
    throw new Error(`no event from ${JSON.stringify(etape)}`)
  }
}

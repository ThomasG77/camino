import { ArmOctMachine } from './oct.machine.js'
import { interpretMachine, orderAndInterpretMachine as commonOrderAndInterpretMachine } from '../machine-test-helper.js'
import { IContenu } from '../../../types.js'
import { EtapeStatutId, ETAPES_STATUTS } from 'camino-common/src/static/etapesStatuts.js'
import { ETAPES_TYPES, EtapeTypeId } from 'camino-common/src/static/etapesTypes.js'
import { EtapesTypesEtapesStatuts as ETES } from 'camino-common/src/static/etapesTypesEtapesStatuts.js'
import { Etape } from '../machine-common.js'
import { toCaminoDate } from 'camino-common/src/date.js'
import { describe, expect, test } from 'vitest'
import { PAYS_IDS } from 'camino-common/src/static/pays.js'
const etapesProd = require('./2019-10-31-oct.cas.json')
const orderAndInterpretMachine = (etapes: readonly Etape[]) => {
  return commonOrderAndInterpretMachine(new ArmOctMachine(), etapes)
}

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const armOctMachine = new ArmOctMachine()
  test('ne peut pas désister', () => {
    const service = orderAndInterpretMachine([])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-01-01') }, [
      'ACCEPTER_RDE',
      'DEMANDER_MODIFICATION_DE_LA_DEMANDE',
      'EXEMPTER_DAE',
      'FAIRE_DEMANDE',
      'PAYER_FRAIS_DE_DOSSIER',
      'REFUSER_RDE',
    ])
  })

  test('quelles sont mes prochaines étapes sur un titre mécanisé', () => {
    const service = orderAndInterpretMachine([
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: true } },
      },
    ])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-02-03') }, [
      'ACCEPTER_RDE',
      'CLASSER_SANS_SUITE',
      'DESISTER_PAR_LE_DEMANDEUR',
      'EXEMPTER_DAE',
      'DEMANDER_MODIFICATION_DE_LA_DEMANDE',
      'DEMANDER_COMPLEMENTS_DAE',
      'DEMANDER_COMPLEMENTS_RDE',
      'MODIFIER_DEMANDE',
      'REFUSER_RDE',
    ])
  })

  test('quelles sont mes prochaines étapes sur un titre mécanisé avec franchissements', () => {
    const service = orderAndInterpretMachine([
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: true, franchissements: 1 } },
      },
    ])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-02-03') }, [
      'ACCEPTER_RDE',
      'CLASSER_SANS_SUITE',
      'DEMANDER_COMPLEMENTS_DAE',
      'DEMANDER_COMPLEMENTS_RDE',
      'DEMANDER_MODIFICATION_DE_LA_DEMANDE',
      'DESISTER_PAR_LE_DEMANDEUR',
      'EXEMPTER_DAE',
      'MODIFIER_DEMANDE',
      'REFUSER_RDE',
    ])
  })

  // TODO 2022-04-01: ce projet peut être intéressant pour les tests: https://xstate.js.org/docs/packages/xstate-graph/#quick-start
  // notamment car il permet de trouver tous les chemins possibles vers les états finaux
  test('quelles sont mes prochaines étapes non mécanisé', () => {
    const service = orderAndInterpretMachine([
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: false } },
      },
    ])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-02-03') }, [
      'ACCEPTER_COMPLETUDE',
      'CLASSER_SANS_SUITE',
      'DESISTER_PAR_LE_DEMANDEUR',
      'REFUSER_COMPLETUDE',
      'MODIFIER_DEMANDE',
    ])
  })
  test('peut faire une edm après une asc', () => {
    const etapes = [
      { ...ETES.paiementDesFraisDeDossier.FAIT, date: toCaminoDate('2023-09-01') },
      { ...ETES.demande.FAIT, date: toCaminoDate('2023-09-09'), paysId: PAYS_IDS['Département de la Guyane'], surface: 3.14 },
      { ...ETES.depotDeLaDemande.FAIT, date: toCaminoDate('2023-09-09') },
      { ...ETES.completudeDeLaDemande.COMPLETE, date: toCaminoDate('2023-09-20') },
      { ...ETES.validationDuPaiementDesFraisDeDossier.FAIT, date: toCaminoDate('2023-09-26') },
      { ...ETES.recevabiliteDeLaDemande.FAVORABLE, date: toCaminoDate('2023-09-27') },
      { ...ETES.avisDesServicesEtCommissionsConsultatives.FAIT, date: toCaminoDate('2023-09-27') },
      { ...ETES.expertiseDGTMServicePreventionDesRisquesEtIndustriesExtractives_DATE_.FAVORABLE, date: toCaminoDate('2024-03-27') },
    ]
    expect(() => orderAndInterpretMachine(etapes)).not.toThrowError()
  })
  test('ne peut pas faire une sca avant la asc', () => {
    const etapes = [
      { ...ETES.paiementDesFraisDeDossier.FAIT, date: toCaminoDate('2023-09-01') },
      { ...ETES.demande.FAIT, date: toCaminoDate('2023-09-09'), paysId: PAYS_IDS['Département de la Guyane'], surface: 3.14 },
      { ...ETES.depotDeLaDemande.FAIT, date: toCaminoDate('2023-09-09') },
      { ...ETES.completudeDeLaDemande.COMPLETE, date: toCaminoDate('2023-09-20') },
      { ...ETES.validationDuPaiementDesFraisDeDossier.FAIT, date: toCaminoDate('2023-09-26') },
      { ...ETES.recevabiliteDeLaDemande.FAVORABLE, date: toCaminoDate('2023-09-27') },
      { ...ETES.saisineDeLaCommissionDesAutorisationsDeRecherchesMinieres_CARM_.FAIT, date: toCaminoDate('2023-09-27') },
    ]
    expect(() => orderAndInterpretMachine(etapes)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error: cannot execute step: '{"etapeTypeId":"sca","etapeStatutId":"fai","date":"2023-09-27"}' after '["pfd_fai","mfr_fai","mdp_fai","mcp_com","vfd_fai","mcr_fav"]'. The event {"type":"FAIRE_SAISINE_CARM"} should be one of 'CLASSER_SANS_SUITE,DESISTER_PAR_LE_DEMANDEUR,MODIFIER_DEMANDE,RECEVOIR_EXPERTISE_SERVICE_EAU,RECEVOIR_EXPERTISE_SERVICE_MINES,RENDRE_AVIS_DES_SERVICES_ET_COMMISSIONS_CONSULTATIVES']`
    )
  })
  test('la demande ne peut pas être effectuée après une modification de la demande', () => {
    const service = orderAndInterpretMachine([
      {
        etapeTypeId: 'mod',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-04'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: false } },
      },
    ])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-02-03') }, ['CLASSER_SANS_SUITE', 'DESISTER_PAR_LE_DEMANDEUR', 'MODIFIER_DEMANDE', 'PAYER_FRAIS_DE_DOSSIER'])
  })

  test('on peut faire une demande de compléments après une complétude incomplète', () => {
    const service = orderAndInterpretMachine([
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'inc',
        date: toCaminoDate('2020-02-04'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: false } },
      },
    ])

    expect(service).canOnlyTransitionTo({ machine: armOctMachine, date: toCaminoDate('2020-02-04') }, [
      'CLASSER_SANS_SUITE',
      'DEMANDER_COMPLEMENTS_COMPLETUDE',
      'DESISTER_PAR_LE_DEMANDEUR',
      'MODIFIER_DEMANDE',
    ])
  })

  test.each([
    {
      etapeTypeId: ETAPES_TYPES.demandeDeComplements_DecisionDeLaMissionAutoriteEnvironnementale_ExamenAuCasParCasDuProjet_,
      etapeStatutId: ETAPES_STATUTS.FAIT,
      date: toCaminoDate('2020-01-01'),
    },
    {
      etapeTypeId: ETAPES_TYPES.demandeDeComplements_RecepisseDeDeclarationLoiSurLeau_,
      etapeStatutId: ETAPES_STATUTS.FAIT,
      date: toCaminoDate('2020-01-01'),
    },
  ])('ne peut pas créer une étape "%s" si il n’existe pas d’autres étapes', (etape: Etape) => {
    expect(() => orderAndInterpretMachine([etape])).toThrowErrorMatchingSnapshot()
  })

  test('peut créer une étape "mdp" juste après une "mfr"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2022-04-14'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2022-04-15'),
      },
    ])
  })

  test('ne peut pas créer une étape "mcp" sans "mdp"', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2022-04-14'),
        },
        {
          etapeTypeId: 'mcp',
          etapeStatutId: 'com',
          date: toCaminoDate('2022-04-16'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test('ne peut pas créer 2 "mfr"', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-02'),
        },
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-03'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test('ne peut pas déplacer une étape "mdp" sans "mfr"', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-02-02'),
        },
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-02-03'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test.each([
    {
      typeId: ETAPES_TYPES.recepisseDeDeclarationLoiSurLeau,
      statutId: ETAPES_STATUTS.FAVORABLE,
      contenu: { arm: { franchissements: 1 } },
    },
    {
      typeId: ETAPES_TYPES.decisionDeLaMissionAutoriteEnvironnementale_ExamenAuCasParCasDuProjet_,
      statutId: ETAPES_STATUTS.EXEMPTE,
    },
  ])(
    'peut créer une étape "%s" juste après une "mdp" et que le titre est mécanisé avec franchissement d’eau',
    ({ typeId, statutId, contenu }: { typeId: EtapeTypeId; statutId: EtapeStatutId; contenu?: IContenu }) => {
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
          contenu: { arm: { mecanise: true, franchissements: 1 } },
        },
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-02'),
        },
        {
          etapeTypeId: typeId,
          etapeStatutId: statutId,
          contenu,
          date: toCaminoDate('2020-01-03'),
        },
      ])
    }
  )

  test('peut créer une étape "mcp" après une "mdp"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-03'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-02'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
      },
    ])
  })

  test('peut créer une "des" après "mdp"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-02'),
      },
      {
        etapeTypeId: 'des',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-04'),
      },
    ])
  })

  test('ne peut pas créer deux "des"', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-02'),
        },
        {
          etapeTypeId: 'des',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-03'),
        },
        {
          etapeTypeId: 'des',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-04'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })
  test('ne peut pas créer une "css" après une "des"', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-02'),
        },
        {
          etapeTypeId: 'des',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-04'),
        },
        {
          etapeTypeId: 'css',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-05'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })
  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-01'),
        contenu: { arm: { mecanise: true } },
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-02'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2020-01-03'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-04'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2020-01-05'),
      },
      {
        etapeTypeId: 'mod',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-06'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-06'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2020-01-07'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-09'),
      },
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-10'),
      },
      {
        etapeTypeId: 'aca',
        etapeStatutId: 'fav',
        date: toCaminoDate('2020-01-11'),
      },
      {
        etapeTypeId: 'mnb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-12'),
      },
      {
        etapeTypeId: 'des',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-01-13'),
      },
    ])
  })

  test('ne peut pas créer une "mno" après la "aca" si le titre n’est pas mécanisé', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mdp',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'pfd',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mcp',
          etapeStatutId: 'com',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'vfd',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'mcr',
          etapeStatutId: 'fav',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'asc',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-01'),
        },
        {
          etapeTypeId: 'sca',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-02'),
        },
        {
          etapeTypeId: 'aca',
          etapeStatutId: 'fav',
          date: toCaminoDate('2020-01-03'),
        },
        {
          etapeTypeId: 'mnb',
          etapeStatutId: 'fai',
          date: toCaminoDate('2020-01-04'),
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test('peut créer une "mnd" apres une "aca" défavorable', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mnd',
        date: toCaminoDate('2020-08-18'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'aca',
        date: toCaminoDate('2020-08-18'),
        etapeStatutId: 'def',
      },
      {
        etapeTypeId: 'sca',
        date: toCaminoDate('2020-08-07'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'asc',
        date: toCaminoDate('2020-06-19'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcr',
        date: toCaminoDate('2020-06-15'),
        etapeStatutId: 'fav',
      },
      {
        etapeTypeId: 'vfd',
        date: toCaminoDate('2020-06-15'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcp',
        date: toCaminoDate('2020-05-29'),
        etapeStatutId: 'com',
      },
      {
        etapeTypeId: 'mdp',
        date: toCaminoDate('2020-05-04'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'pfd',
        date: toCaminoDate('2020-05-01'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mfr',
        date: toCaminoDate('2020-04-29'),
        etapeStatutId: 'fai',
      },
    ])
  })

  test('peut créer une "mod" si il n’y a pas de sca', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        date: toCaminoDate('2019-12-12'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mdp',
        date: toCaminoDate('2019-12-12'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'pfd',
        date: toCaminoDate('2019-12-12'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcp',
        date: toCaminoDate('2020-01-21'),
        etapeStatutId: 'com',
      },
      {
        etapeTypeId: 'vfd',
        date: toCaminoDate('2020-02-05'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcr',
        date: toCaminoDate('2020-02-05'),
        etapeStatutId: 'fav',
      },
      {
        etapeTypeId: 'asc',
        date: toCaminoDate('2020-02-05'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mod',
        date: toCaminoDate('2020-06-17'),
        etapeStatutId: 'fai',
      },
    ])
  })

  test('peut créer une "mcp" après une "pfd" et "mdp"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        date: toCaminoDate('2020-01-30'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mdp',
        date: toCaminoDate('2020-02-23'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'pfd',
        date: toCaminoDate('2020-02-23'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcp',
        date: toCaminoDate('2020-02-28'),
        etapeStatutId: 'com',
      },
    ])
  })

  test('peut créer une "sca" après une "asc" et "rde"', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'dae',
        date: toCaminoDate('2020-06-22'),
        etapeStatutId: 'exe',
      },
      {
        etapeTypeId: 'mfr',
        date: toCaminoDate('2020-07-09'),
        etapeStatutId: 'fai',
        contenu: { arm: { mecanise: true, franchissements: 3 } },
      },
      {
        etapeTypeId: 'pfd',
        date: toCaminoDate('2020-07-10'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mdp',
        date: toCaminoDate('2020-07-17'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcp',
        date: toCaminoDate('2020-07-17'),
        etapeStatutId: 'com',
      },
      {
        etapeTypeId: 'rde',
        date: toCaminoDate('2020-07-30'),
        etapeStatutId: 'fav',
        contenu: { arm: { franchissements: 3 } },
      },
      {
        etapeTypeId: 'vfd',
        date: toCaminoDate('2020-07-31'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'mcr',
        date: toCaminoDate('2020-07-31'),
        etapeStatutId: 'fav',
      },
      {
        etapeTypeId: 'asc',
        date: toCaminoDate('2020-08-10'),
        etapeStatutId: 'fai',
      },
      {
        etapeTypeId: 'sca',
        date: toCaminoDate('2020-09-04'),
        etapeStatutId: 'fai',
      },
    ])
  })

  test('peut faire une "sco" après une "aca" favorable en mécanisé', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'sco',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-09-28'),
      },
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-07-17'),
      },
      {
        etapeTypeId: 'pfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-07-16'),
      },
      {
        etapeTypeId: 'mnb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-07-09'),
      },
      {
        etapeTypeId: 'aca',
        etapeStatutId: 'fav',
        date: toCaminoDate('2020-06-17'),
      },
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-06-15'),
      },
      {
        etapeTypeId: 'rde',
        etapeStatutId: 'fav',
        date: toCaminoDate('2020-02-11'),
        contenu: { arm: { franchissements: 3 } },
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-07'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2020-02-06'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-02-05'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2020-01-23'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2020-01-14'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2019-12-13'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2019-12-11'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2019-12-10'),
        contenu: { arm: { mecanise: true, franchissements: 3 } },
      },
    ])
  })

  test('les étapes sont vérifiées dans le bon ordre', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-06-02'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-05-20'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-05-20'),
        contenu: { arm: { mecanise: true, franchissements: 3 } },
      },
      {
        etapeTypeId: 'rde',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-04-09'),
        contenu: { arm: { franchissements: 3 } },
      },
    ])
  })

  test('des étapes qui se font la même journée', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-09-03'),
      },
    ])
  })

  test('peut réaliser une saisine de la CARM après un récépissé de la déclaration sur l’eau défavorable', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-24'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'rde',
        etapeStatutId: 'def',
        date: toCaminoDate('2021-09-22'),
        contenu: { arm: { franchissements: 3 } },
      },
      {
        etapeTypeId: 'edm',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-04-30'),
      },
      {
        etapeTypeId: 'mcb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-16'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-11'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
        contenu: { arm: { mecanise: true, franchissements: 3 } },
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-09-03'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2020-07-28'),
      },
    ])
  })

  test('peut réaliser une demande de compléments après un avis de la CARM ajourné', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-30'),
      },
      {
        etapeTypeId: 'rcs',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-28'),
      },
      {
        etapeTypeId: 'mcs',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-27'),
      },
      {
        etapeTypeId: 'mna',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-26'),
      },
      {
        etapeTypeId: 'aca',
        etapeStatutId: 'ajo',
        date: toCaminoDate('2021-09-25'),
      },
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-24'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-09-03'),
      },
    ])
  })

  test('peut réaliser une demande d’ARM non mécanisée et un avenant', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mnv',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-29'),
      },
      {
        etapeTypeId: 'aco',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-28'),
      },
      {
        etapeTypeId: 'mns',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-27'),
      },
      {
        etapeTypeId: 'sco',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-26'),
      },
      {
        etapeTypeId: 'aca',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-09-25'),
      },
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-24'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-09-03'),
      },
    ])
  })

  test('peut réaliser une demande d’ARM mécanisée et un avenant', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mnv',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-02'),
      },
      {
        etapeTypeId: 'aco',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-01'),
      },
      {
        etapeTypeId: 'sco',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-29'),
      },
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-28'),
      },
      {
        etapeTypeId: 'pfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-27'),
      },
      {
        etapeTypeId: 'mnb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-26'),
      },
      {
        etapeTypeId: 'aca',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-09-25'),
      },
      {
        etapeTypeId: 'sca',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-24'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-11'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-29'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-28'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-02-27'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-25'),
        contenu: { arm: { mecanise: true } },
      },
    ])
  })

  test("peut faire une demande de compléments pour la RDE si les franchissements d'eau ne sont pas spécifiés sur une ARM mécanisée", () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'rcb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-10-08'),
        contenu: {
          arm: {
            franchissements: 4,
          },
        },
      },
      {
        etapeTypeId: 'mcb',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-10-05'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2020-08-25'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-08-25'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-08-20'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2020-07-30'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2020-07-14'),
        contenu: {
          arm: {
            mecanise: true,
          },
        },
      },
    ])
  })

  test('ne peut pas faire de mfr non mécanisée après une dae', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'dae',
          etapeStatutId: 'exe',
          date: toCaminoDate('2021-02-23'),
        },
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2021-02-25'),
          contenu: { arm: { mecanise: false } },
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test('ne peut pas faire de mfr non mécanisée après une rde', () => {
    expect(() =>
      orderAndInterpretMachine([
        {
          etapeTypeId: 'rde',
          etapeStatutId: 'fav',
          date: toCaminoDate('2021-02-23'),
          contenu: { arm: { franchissements: 1 } },
        },
        {
          etapeTypeId: 'mfr',
          etapeStatutId: 'fai',
          date: toCaminoDate('2021-02-25'),
          contenu: { arm: { mecanise: false } },
        },
      ])
    ).toThrowErrorMatchingSnapshot()
  })

  test('peut réaliser une validation des frais de dossier complémentaire après un désistement', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-04'),
      },
      {
        etapeTypeId: 'mnc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-02'),
      },
      {
        etapeTypeId: 'css',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-01'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-11'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-29'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-28'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-02-27'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-25'),
        contenu: { arm: { mecanise: true } },
      },
    ])

    orderAndInterpretMachine([
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-05'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-04'),
      },
      {
        etapeTypeId: 'mnc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-02'),
      },
      {
        etapeTypeId: 'css',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-01'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-29'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-28'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-02-27'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-25'),
        contenu: { arm: { mecanise: true } },
      },
    ])
    orderAndInterpretMachine([
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-04'),
      },
      {
        etapeTypeId: 'des',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-01'),
      },
      {
        etapeTypeId: 'asc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-09-23'),
      },
      {
        etapeTypeId: 'mcr',
        etapeStatutId: 'fav',
        date: toCaminoDate('2021-03-11'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-03-10'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-29'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-28'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-02-27'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-25'),
        contenu: { arm: { mecanise: true } },
      },
    ])

    orderAndInterpretMachine([
      {
        etapeTypeId: 'vfc',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-05'),
      },
      {
        etapeTypeId: 'vfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-04'),
      },
      {
        etapeTypeId: 'des',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-10-01'),
      },
      {
        etapeTypeId: 'mcp',
        etapeStatutId: 'com',
        date: toCaminoDate('2021-02-29'),
      },
      {
        etapeTypeId: 'pfd',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-28'),
      },
      {
        etapeTypeId: 'dae',
        etapeStatutId: 'exe',
        date: toCaminoDate('2021-02-27'),
      },
      {
        etapeTypeId: 'mdp',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-26'),
      },
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2021-02-25'),
        contenu: { arm: { mecanise: true } },
      },
    ])
  })

  test('peut faire une "mfr" non mécanisée avec un franchissement d’eau', () => {
    orderAndInterpretMachine([
      {
        etapeTypeId: 'mfr',
        etapeStatutId: 'fai',
        date: toCaminoDate('2019-12-10'),
        contenu: { arm: { mecanise: false, franchissements: 3 } },
      },
    ])
  })

  // pour regénérer le oct.cas.json: `npm run test:generate-data -w packages/api`
  test.each(etapesProd as any[])('cas réel N°$id', demarche => {
    // ici les étapes sont déjà ordonnées
    interpretMachine(armOctMachine, demarche.etapes)
    expect(armOctMachine.demarcheStatut(demarche.etapes)).toStrictEqual({
      demarcheStatut: demarche.demarcheStatutId,
      publique: demarche.demarchePublique,
    })
  })
})

import { DEMARCHES_TYPES_IDS } from './demarchesTypes.js'
import { DOMAINES_IDS } from './domaines.js'
import { TitresStatutIds } from './titresStatuts.js'
import { TITRES_TYPES_TYPES_IDS } from './titresTypesTypes.js'
import { titrePublicFind } from './titresTypesTypes_domaine_titresStatuts.js'
import { test, expect, describe } from 'vitest'

describe("publicité d'un titre", () => {
  test('un titre est toujours visible par son demandeur ou titulaire', () => {
    expect(titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [])).toMatchObject({
      entreprisesLecture: true
    })
  })

  test("un titre sans démarche n'est pas public", () => {
    expect(titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [])).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `false` n'est pas public", () => {
    expect(
      titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.PERMIS_EXCLUSIF_DE_CARRIERES, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.Octroi, publicLecture: true }])
    ).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la démarche d'octroi n'est pas publique n'est pas public", () => {
    expect(titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.Octroi, publicLecture: false }])).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la démarche de mutation virtuelle n'est pas publique n'est pas public", () => {
    expect(
      titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.MutationPartielle, publicLecture: false }])
    ).toMatchObject({ publicLecture: false })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et qui n'a pas de démarche d'octroi n'est pas public", () => {
    expect(titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.Prolongation, publicLecture: true }])).toMatchObject(
      { publicLecture: false }
    )
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la démarche d'octroi est publique est public", () => {
    expect(titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.Octroi, publicLecture: true }])).toMatchObject({
      publicLecture: true
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la mutation partielle est publique est public", () => {
    expect(
      titrePublicFind(TitresStatutIds.DemandeInitiale, TITRES_TYPES_TYPES_IDS.CONCESSION, DOMAINES_IDS.METAUX, [{ typeId: DEMARCHES_TYPES_IDS.MutationPartielle, publicLecture: true }])
    ).toMatchObject({ publicLecture: true })
  })

  test("les permis exclusifs de carrières du domaine carrière avec une démarche d'octroi publique est publique", () => {
    expect(
      titrePublicFind(TitresStatutIds.Echu, TITRES_TYPES_TYPES_IDS.PERMIS_EXCLUSIF_DE_CARRIERES, DOMAINES_IDS.CARRIERES, [{ typeId: DEMARCHES_TYPES_IDS.Octroi, publicLecture: true }])
    ).toMatchObject({ publicLecture: true })
  })
})

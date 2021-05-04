import { ITitreEtape, IEtapeType } from '../../types'

const titreDemarchePublicLectureFind = (
  publicLecture: boolean,
  demarcheTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreEtape: ITitreEtape,
  titreTypeId?: string
) => {
  // si le type de démarche est retrait de la demande ou déchéance
  // et que le type d'étape est saisine du préfet
  // alors la démarche est publique
  if (['ret', 'dec'].includes(demarcheTypeId) && titreEtape.typeId === 'spp') {
    return true
  }

  // si le type d'étape est un classement sans suite
  // et le type de titre n'est ni ARM ni AXM
  // alors la démarche n'est pas publique
  if (
    titreEtape.typeId === 'css' &&
    (!titreTypeId || !['arm', 'axm'].includes(titreTypeId))
  ) {
    return false
  }

  // si le type d'étape est recevabilité de la demande
  // et que le type de titre n'est pas ARM
  // et que la démarche ne peut contenir de mise en concurrence au JORF ou JOUE
  // alors la démarche est publique
  if (
    titreEtape.typeId === 'mcr' &&
    (!titreTypeId || titreTypeId !== 'arm') &&
    !demarcheTypeEtapesTypes.find(et => ['anf', 'ane'].includes(et.id))
  ) {
    return true
  }

  // si le type d'étape est mise en concurrence au JORF ou JOUE
  // alors la démarche est publique
  if (['anf', 'ane'].includes(titreEtape.typeId)) {
    return true
  }

  // si le type d'étape est participation du public
  // alors la démarche est publique
  if (titreEtape.typeId === 'ppu') {
    return true
  }

  // si le type d'étape est publication de l'avis de décision implicite
  // alors la démarche est publique
  if (titreEtape.typeId === 'apu') {
    return true
  }

  // si le type de titre est ARM
  // et que le type d'étape est saisine de la commission des ARM
  //    ou avis de la commission des ARM (si pas de saisine)
  //    ou décision de l'ONF (étape historique)
  // alors la démarche est publique
  if (
    titreTypeId === 'arm' &&
    ['sca', 'aca', 'def'].includes(titreEtape.typeId)
  ) {
    return true
  }

  // si le type de titre est ARM ou AXM
  // et que le type d'étape est désistement du demandeur
  // alors la démarche est publique
  if (
    titreTypeId &&
    ['arm', 'axm'].includes(titreTypeId) &&
    titreEtape.typeId === 'des'
  ) {
    return true
  }

  // si le type d'étape est décision implicite
  //    ou décision de l'administration
  // et que le statut est rejeté
  if (
    ['dim', 'dex'].includes(titreEtape.typeId) &&
    titreEtape.statutId === 'rej'
  ) {
    //   si le type de titre est AXM
    //   alors la démarche est publique
    //   sinon la démarche n'est pas (plus) publique
    return titreTypeId === 'axm'
  }

  // si le type d'étape est décision implicite
  //    ou décision de l'administration
  //    ou publication au JORF
  // et que le statut est accepté
  // alors la démarche est publique
  if (
    ['dim', 'dex', 'dpu'].includes(titreEtape.typeId) &&
    titreEtape.statutId === 'acc'
  ) {
    return true
  }

  // si le type d'étape est publication de décision unilatérale au JORF
  //    ou décision unilatérale de l'administration
  //    ou publication de décision au recueil des actes administratifs
  // alors la démarche est publique
  if (['dup', 'dux', 'rpu'].includes(titreEtape.typeId)) {
    return true
  }

  // si le type de titre est ARM
  // et que le type d'étape est signature de l'autorisation de recherche minière
  //    ou signature de l'avenant à l'autorisation de recherche minière
  // alors la démarche est publique
  if (titreTypeId === 'arm' && ['sco', 'aco'].includes(titreEtape.typeId)) {
    return true
  }

  //  - le type de l’étape est annulation de la décision (and)
  //  - et si le statut est favorable
  if (['and'].includes(titreEtape.typeId) && titreEtape.statutId === 'fav') {
    //  - alors, la démarche est publique
    return true
  }

  // Si le type de titre est ARM et que le type de démarche est renonciation
  // et que l’expertise de l’onf est cours, ou si la démarche a été désistée ou si classée sans suite
  if (
    titreTypeId === 'arm' &&
    ['ren', 'pro'].includes(demarcheTypeId) &&
    ['eof', 'css', 'des'].includes(titreEtape.typeId)
  ) {
    return true
  }

  return publicLecture
}

/**
 *
 * @param demarcheTypeId - id du type de démarche
 * @param demarcheTypeEtapesTypes - types d'étapes de ce type de démarche
 * @param titreEtapes - étapes de la démarche dans l’ordre chronologique
 * @param titreTypeId - id du type de titre
 */

const titreDemarchePublicFind = (
  demarcheTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreEtapes: ITitreEtape[],
  titreTypeId?: string
) => {
  // calcule la visibilité publique ou non de la démarche
  // on parcourt successivement toutes les étapes
  // pour calculer la visibilité de la démarche
  // en fonction de l'historique
  const publicLecture = titreEtapes.reduce(
    (publicLecture, titreEtape) =>
      titreDemarchePublicLectureFind(
        publicLecture,
        demarcheTypeId,
        demarcheTypeEtapesTypes,
        titreEtape,
        titreTypeId
      ),
    false
  )

  // les entreprises titulaires ou amodiataires peuvent voir la démarche
  // si la démarche est visible au public
  // ou si la démarche contient une demande ou une décision de l'administration unilatérale
  const entreprisesLecture =
    publicLecture ||
    titreEtapes.some(te => ['mfr', 'mfm', 'dex', 'dux'].includes(te.typeId))

  return { publicLecture, entreprisesLecture }
}

export { titreDemarchePublicFind }

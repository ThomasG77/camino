import { canCreateTitre, canLinkTitres, getLinkConfig } from './titres.js'
import { TitresTypesIds, TitreTypeId } from '../static/titresTypes.js'
import { User } from '../roles.js'
import { ADMINISTRATION_IDS, AdministrationId } from '../static/administrations.js'
import { test, expect } from 'vitest'

test('getTitreFromTypeId pas de fusions', () => {
  const titreFromTypeId = TitresTypesIds.reduce<{
    [key in TitreTypeId]?: {
      count: 'single' | 'multiple'
      typeId: TitreTypeId
    } | null
  }>((acc, titreTypeId) => {
    acc[titreTypeId] = getLinkConfig(titreTypeId, [])

    return acc
  }, {})
  expect(titreFromTypeId).toMatchSnapshot()
})
test('getTitreFromTypeId fusions', () => {
  const titreFromTypeId = TitresTypesIds.reduce<{
    [key in TitreTypeId]?: {
      count: 'single' | 'multiple'
      typeId: TitreTypeId
    } | null
  }>((acc, titreTypeId) => {
    acc[titreTypeId] = getLinkConfig(titreTypeId, [{ typeId: 'fus' }])

    return acc
  }, {})
  expect(titreFromTypeId).toMatchSnapshot()
})

test.each<[User, AdministrationId[], boolean]>([
  [{ role: 'super', administrationId: undefined }, [], true],
  [
    {
      role: 'admin',
      administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']
    },
    [ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']],
    true
  ],
  [
    {
      role: 'admin',
      administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']
    },
    [ADMINISTRATION_IDS['DREAL - PAYS DE LA LOIRE']],
    false
  ],
  [{ role: 'defaut', administrationId: undefined }, [ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']], false]
])('un utilisateur $user peut modifier les liaisons d’un titre: $can ', (user, administrationIds, can) => {
  expect(canLinkTitres(user, administrationIds)).toBe(can)
})

test.each<TitreTypeId>(TitresTypesIds)('vérifie si une entreprise peut créer un titre de type %p', titreTypeId => {
  expect(canCreateTitre({ role: 'entreprise', administrationId: null }, titreTypeId)).toMatchSnapshot()
})

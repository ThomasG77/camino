import { dbManager } from '../../../../tests/db-manager'

import { userSuper } from '../../user-super'

import TitresEtapes from '../../models/titres-etapes'
import ActivitesTypesDocumentsTypes from '../../models/activites-types--documents-types'
import TitresActivites from '../../models/titres-activites'
import Document from '../../models/documents'

import { documentCreate, documentGet } from '../documents'
import { etapeTypeDocumentTypeUsedCheck } from './documents'
import { Knex } from 'knex'
import { newDemarcheId } from '../../models/_format/id-create'
import { toCaminoDate } from 'camino-common/src/date'
import { expect, test, describe, afterAll, beforeAll, vi } from 'vitest'
import { EtapeStatutId } from 'camino-common/src/static/etapesStatuts'

console.info = vi.fn()
console.error = vi.fn()
let knex: Knex<any, unknown[]>
beforeAll(async () => {
  knex = await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})

describe('documentSupprimer', () => {
  test.each<[EtapeStatutId, boolean]>([
    ['aco', true],
    ['fai', false]
  ])(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une étape (utilisateur super)',
    async (statutId, suppression) => {
      // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
      await TitresEtapes.query().delete()
      await Document.query().delete()
      await knex.schema.alterTable(TitresEtapes.tableName, table => {
        table.dropColumns('titreDemarcheId')
      })

      await knex.schema.alterTable(TitresEtapes.tableName, table => {
        table.string('titreDemarcheId').index().notNullable()
      })

      await TitresEtapes.query().insertGraph({
        id: 'titreEtapeId',
        typeId: 'dpu',
        titreDemarcheId: newDemarcheId('titreDemarcheId'),
        date: toCaminoDate('2022-01-01'),
        statutId
      })

      const documentId = 'document-id'
      await documentCreate({
        id: documentId,
        typeId: 'dec',
        date: '',
        titreEtapeId: 'titreEtapeId'
      })

      const documentRes = await documentGet(documentId, {}, userSuper)

      expect(documentRes.suppression).toBe(suppression)
    }
  )

  test.each<[boolean | undefined, string, boolean]>([
    [true, 'enc', true],
    [false, 'enc', true],
    [undefined, 'enc', true],
    [true, 'dep', true],
    [false, 'dep', false],
    [undefined, 'dep', false]
  ])(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une activité (utilisateur super)',
    async (optionnel, statutId, suppression) => {
      // suppression de la clé étrangère sur le titre pour ne pas avoir à tout créer
      await TitresActivites.query().delete()
      await Document.query().delete()
      await ActivitesTypesDocumentsTypes.query().delete()
      await knex.schema.alterTable(TitresActivites.tableName, table => {
        table.dropColumns('titreId')
      })

      await knex.schema.alterTable(TitresActivites.tableName, table => {
        table.string('titreId').index().notNullable()
      })

      await TitresActivites.query().insertGraph({
        id: 'titreActiviteId',
        typeId: 'grx',
        titreId: '',
        date: '',
        statutId,
        periodeId: 1,
        annee: 2000
      })

      const documentId = 'document-id'
      await documentCreate({
        id: documentId,
        typeId: 'dec',
        date: '',
        titreActiviteId: 'titreActiviteId'
      })

      await ActivitesTypesDocumentsTypes.query().insertGraph({
        activiteTypeId: 'grx',
        documentTypeId: 'dec',
        optionnel
      })

      const documentRes = await documentGet(documentId, {}, userSuper)

      expect(documentRes.suppression).toBe(suppression)
    }
  )
})

describe('etapeTypeDocumentTypeUsedCheck', () => {
  test('il existe un etapeTypeDocumentType (utilisateur super)', async () => {
    // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
    await TitresEtapes.query().delete()
    await Document.query().delete()
    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.dropColumns('titreDemarcheId')
    })

    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.string('titreDemarcheId').index().notNullable()
    })

    await TitresEtapes.query().insertGraph({
      id: 'titreEtapeId',
      typeId: 'dpu',
      titreDemarcheId: newDemarcheId('titreDemarcheId'),
      date: toCaminoDate('2022-01-01'),
      statutId: 'aco'
    })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'dec',
      date: '',
      titreEtapeId: 'titreEtapeId'
    })

    const check = await etapeTypeDocumentTypeUsedCheck('dpu', 'dec')

    expect(check).toBe(true)
  })

  test('il n’existe pas un etapeTypeDocumentType (utilisateur super)', async () => {
    // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
    await TitresEtapes.query().delete()
    await Document.query().delete()
    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.dropColumns('titreDemarcheId')
    })

    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.string('titreDemarcheId').index().notNullable()
    })

    await TitresEtapes.query().insertGraph({
      id: 'titreEtapeId',
      typeId: 'dpu',
      titreDemarcheId: newDemarcheId('titreDemarcheId'),
      date: toCaminoDate('2022-01-01'),
      statutId: 'aco'
    })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'arr',
      date: '',
      titreEtapeId: 'titreEtapeId'
    })

    const check = await etapeTypeDocumentTypeUsedCheck('dpu', 'dec')

    expect(check).toBe(false)
  })
})

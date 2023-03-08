import { Knex } from 'knex'
export const up = (knex: Knex) =>
  knex.schema
    .createTable('sdomZones', table => {
      table.string('id', 30).primary()
      table.string('nom').notNullable()
    })
    .createTable('titres__sdomZones', table => {
      table.string('titreEtapeId', 128).notNullable().index()
      table.foreign('titreEtapeId').references('titresEtapes.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('sdomZoneId', 30).notNullable().index().references('sdomZones.id')
      table.integer('surface')
      table.primary(['titreEtapeId', 'sdomZoneId'])
    })

export const down = (knex: Knex) => knex.schema.dropTable('sdomZones').dropTable('titres__sdomZones')

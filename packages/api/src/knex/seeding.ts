import { Knex } from 'knex'

const INSERT_SIZE = 3000

export default (
    func: (params: {
      del: (table: Knex.TableDescriptor) => any
      insert: (table: Knex.TableDescriptor, data: any[]) => any
    }) => void
  ) =>
  (knex: Knex) => {
    const del = (table: Knex.TableDescriptor) => {
      console.info(`suppression des données de la table "${table}"`)

      return knex(table).del()
    }

    const insert = (table: Knex.TableDescriptor, data: any[]) => {
      console.info(
        `insertion des données de la table "${table}", (${data.length} élément(s))`
      )

      const arrs = []
      for (let i = 0; i < data.length; i += INSERT_SIZE) {
        arrs.push(data.slice(i, i + INSERT_SIZE))
      }

      return Promise.all(arrs.map(arr => knex(table).insert(arr))).catch(e => {
        // si le message d'erreur est trop long
        // réduit la taille du message à 100 caractères
        const problem = e.message.split(' - ').pop()
        const message = `Table "${table}" - ${problem} - ${e.detail}`

        throw new Error(message)
      })
    }

    return func({ del, insert })
  }

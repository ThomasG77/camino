/* eslint-disable no-restricted-syntax */
import { sql } from '@pgtyped/runtime'
import { AnneeCountStatistique, anneeCountStatistiqueValidator } from 'camino-common/src/statistiques.js'
import { Redefine, dbQueryAndValidate } from '../../../pg-database.js'
import {
  IGetSubstancesByEntrepriseCategoryByAnneeInternalQuery,
  IGetTitreActiviteSubstanceParAnneeInternalQuery,
  IGetsubstancesByAnneeByCommuneInternalQuery,
} from './metaux-metropole.queries.types.js'
import { SUBSTANCES_FISCALES_IDS, SubstanceFiscaleId, substanceFiscaleIdValidator } from 'camino-common/src/static/substancesFiscales.js'
import { z } from 'zod'
import { caminoAnneeValidator } from 'camino-common/src/date.js'
import { communeIdValidator } from 'camino-common/src/static/communes.js'
import { Pool } from 'pg'

export const getTitreActiviteSubstanceParAnnee = async (pool: Pool, params: { substanceFiscale: SubstanceFiscaleId }) =>
  dbQueryAndValidate(getTitreActiviteSubstanceParAnneeInternal, params, pool, anneeCountStatistiqueValidator)

const getTitreActiviteSubstanceParAnneeInternal = sql<Redefine<IGetTitreActiviteSubstanceParAnneeInternalQuery, { substanceFiscale: SubstanceFiscaleId }, AnneeCountStatistique>>`
select
    annee,
    titres_activites.contenu -> 'substancesFiscales' -> $ substanceFiscale as count
from
    titres_activites
where
    titres_activites.contenu -> 'substancesFiscales' ? $ substanceFiscale
`

const substancesByAnneeByCommuneValidator = z.object({
  annee: caminoAnneeValidator,
  communes: z.array(z.object({ id: communeIdValidator })),
  substances: z.record(substanceFiscaleIdValidator, z.coerce.number()),
})

type substancesByAnneeByCommune = z.infer<typeof substancesByAnneeByCommuneValidator>

export const getsubstancesByAnneeByCommune = async (pool: Pool, params: { substancesFiscales: readonly SubstanceFiscaleId[] }) =>
  dbQueryAndValidate(getsubstancesByAnneeByCommuneInternal, params, pool, substancesByAnneeByCommuneValidator)

const getsubstancesByAnneeByCommuneInternal = sql<Redefine<IGetsubstancesByAnneeByCommuneInternalQuery, { substancesFiscales: readonly SubstanceFiscaleId[] }, substancesByAnneeByCommune>>`
select distinct on ("titres"."slug", "titres_activites"."annee")
    "titres_activites"."annee",
    "te"."communes",
    titres_activites.contenu -> 'substancesFiscales' as substances
from
    "titres_activites"
    left join "titres" on "titres"."id" = "titres_activites"."titre_id"
    left join titres_etapes te on te.id = titres.props_titre_etapes_ids ->> 'points'
where
    EXISTS (
        SELECT
            TRUE
        FROM
            jsonb_object_keys(titres_activites.contenu -> 'substancesFiscales') substanceIds
        WHERE
            substanceIds IN $$ substancesFiscales)
order by
    "titres"."slug" asc
`

const substancesByEntrepriseCategoryByAnneeValidator = z.object({
  annee: caminoAnneeValidator,
  categorie: z.enum(['pme', 'autre']),
  aloh: z.coerce.number(),
  naca: z.coerce.number(),
  nacb: z.coerce.number(),
  nacc: z.coerce.number(),
})

type SubstancesByEntrepriseCategoryByAnnee = z.infer<typeof substancesByEntrepriseCategoryByAnneeValidator>

export const getSubstancesByEntrepriseCategoryByAnnee = async (
  pool: Pool,
  params: {
    bauxite: typeof SUBSTANCES_FISCALES_IDS.bauxite
    selContenu: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodiumContenu_
    selSondage: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodium_extraitEnDissolutionParSondage
    selAbattage: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodium_extraitParAbattage
  }
) => dbQueryAndValidate(getSubstancesByEntrepriseCategoryByAnneeInternal, params, pool, substancesByEntrepriseCategoryByAnneeValidator)

const getSubstancesByEntrepriseCategoryByAnneeInternal = sql<
  Redefine<
    IGetSubstancesByEntrepriseCategoryByAnneeInternalQuery,
    {
      bauxite: typeof SUBSTANCES_FISCALES_IDS.bauxite
      selContenu: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodiumContenu_
      selSondage: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodium_extraitEnDissolutionParSondage
      selAbattage: typeof SUBSTANCES_FISCALES_IDS.sel_ChlorureDeSodium_extraitParAbattage
    },
    SubstancesByEntrepriseCategoryByAnnee
  >
>`
select
    case when e_t.categorie = 'PME' then
        'pme'
    else
        'autre'
    end as categorie,
    ta.annee,
    sum((ta.contenu -> 'substancesFiscales' -> $ bauxite)::bigint) as aloh,
    sum((ta.contenu -> 'substancesFiscales' -> $ selContenu)::bigint) as nacc,
    sum((ta.contenu -> 'substancesFiscales' -> $ selSondage)::bigint) as nacb,
    sum((ta.contenu -> 'substancesFiscales' -> $ selAbattage)::bigint) as naca
from
    titres_activites ta
    join titres t on t.id = ta.titre_id
    left join titres_titulaires tt on t.props_titre_etapes_ids ->> 'titulaires' = tt.titre_etape_id
    left join entreprises e_t on e_t.id = tt.entreprise_id
where
    ta.contenu -> 'substancesFiscales' ? $ bauxite
    or ta.contenu -> 'substancesFiscales' ? $ selContenu
    or ta.contenu -> 'substancesFiscales' ? $ selSondage
    or ta.contenu -> 'substancesFiscales' ? $ selAbattage
group by
    case when e_t.categorie = 'PME' then
        'pme'
    else
        'autre'
    end,
    ta.annee
`

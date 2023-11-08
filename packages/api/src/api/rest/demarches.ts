import { HTTP_STATUS } from 'camino-common/src/http.js'
import { CaminoRequest, CustomResponse } from './express-type.js'
import { isSuper } from 'camino-common/src/roles.js'
import type { Pool } from 'pg'
import { DemarcheGet, demarcheIdOrSlugValidator } from 'camino-common/src/demarche.js'
import { getDemarcheQuery } from './demarches.queries.js'

export const getDemarche = (pool: Pool) => async (req: CaminoRequest, res: CustomResponse<DemarcheGet>) => {
  const demarcheId = demarcheIdOrSlugValidator.safeParse(req.params.demarcheId)
  const user = req.auth
  // TODO 2023-10-25 ouvrir cette route aux autres utilisateurs
  if (!isSuper(user)) {
    res.sendStatus(HTTP_STATUS.HTTP_STATUS_FORBIDDEN)
  } else if (!demarcheId.success) {
    res.sendStatus(HTTP_STATUS.HTTP_STATUS_BAD_REQUEST)
  } else {
    try {
      const demarche = await getDemarcheQuery(pool, demarcheId.data, user)

      res.json(demarche)
    } catch (e) {
      console.error(e)

      res.sendStatus(HTTP_STATUS.HTTP_STATUS_NOT_FOUND)
    }
  }
}

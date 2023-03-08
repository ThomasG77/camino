import gql from 'graphql-tag'
import { apiGraphQLFetch } from './_client'

import { fragmentActiviteType, fragmentActiviteTypeDocumentType, fragmentActiviteTypePays } from './fragments/metas-activites'

const activitesMetas = apiGraphQLFetch(
  gql`
    query MetasActivites {
      entreprises {
        elements {
          id
          nom
        }
      }
    }
  `
)

const activitesTypes = apiGraphQLFetch(
  gql`
    query ActivitesTypes {
      activitesTypes {
        ...activiteType
      }
    }

    ${fragmentActiviteType}
  `
)

const activitesTypesDocumentsTypes = apiGraphQLFetch(
  gql`
    query ActivitesTypesDocumentsTypes {
      activitesTypesDocumentsTypes {
        ...activiteTypeDocumentType
      }
    }

    ${fragmentActiviteTypeDocumentType}
  `
)

const activitesTypesPays = apiGraphQLFetch(
  gql`
    query ActivitesTypesPays {
      activitesTypesPays {
        ...activiteTypePays
      }
    }

    ${fragmentActiviteTypePays}
  `
)

export { activitesMetas, activitesTypes, activitesTypesDocumentsTypes, activitesTypesPays }

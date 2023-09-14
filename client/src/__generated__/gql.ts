/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n        }\n      }\n    ": types.MaterialFormContentCreateMaterialMutationDocument,
    "\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n        }\n      }\n    ": types.MaterialFormContentUpdateMaterialMutationDocument,
    "\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n        }\n      }\n    ": types.MaterialFormContentMaterialQueryDocument,
    "\n      query MaterialsContentMaterialsQuery {\n        materials {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          deletedAt\n        }\n      }\n    ": types.MaterialsContentMaterialsQueryDocument,
    "\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n        }\n      }\n    ": types.SupplierFormContentCreateSupplierMutationDocument,
    "\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n        }\n      }\n    ": types.SupplierFormContentUpdateSupplierMutationDocument,
    "\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    ": types.SupplierFormContentSupplierQueryDocument,
    "\n      query SuppliersContentSuppliersQuery {\n        suppliers {\n          id\n          name\n          address\n          email\n          phone\n          deletedAt\n        }\n      }\n    ": types.SuppliersContentSuppliersQueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n        }\n      }\n    "): (typeof documents)["\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query MaterialsContentMaterialsQuery {\n        materials {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          deletedAt\n        }\n      }\n    "): (typeof documents)["\n      query MaterialsContentMaterialsQuery {\n        materials {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          deletedAt\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "): (typeof documents)["\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query SuppliersContentSuppliersQuery {\n        suppliers {\n          id\n          name\n          address\n          email\n          phone\n          deletedAt\n        }\n      }\n    "): (typeof documents)["\n      query SuppliersContentSuppliersQuery {\n        suppliers {\n          id\n          name\n          address\n          email\n          phone\n          deletedAt\n        }\n      }\n    "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
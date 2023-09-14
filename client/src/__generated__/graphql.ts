/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Material = {
  __typename?: 'Material';
  alertQuantity?: Maybe<Scalars['Float']['output']>;
  code: Scalars['String']['output'];
  currentQuantity?: Maybe<Scalars['Float']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  measureUnit: MaterialMeasureUnit;
  name: Scalars['String']['output'];
  suppliers: Array<Supplier>;
};

export enum MaterialMeasureUnit {
  Gr = 'GR',
  Kg = 'KG',
  Lt = 'LT',
  Mt = 'MT',
  Tn = 'TN',
  Unit = 'UNIT'
}

export type Mutation = {
  __typename?: 'Mutation';
  createMaterial: Material;
  createSupplier: Supplier;
  updateMaterial: Material;
  updateSupplier: Supplier;
};


export type MutationCreateMaterialArgs = {
  input: SaveMaterialInput;
};


export type MutationCreateSupplierArgs = {
  input: SaveSupplierInput;
};


export type MutationUpdateMaterialArgs = {
  input: SaveMaterialInput;
  materialId: Scalars['ID']['input'];
};


export type MutationUpdateSupplierArgs = {
  input: SaveSupplierInput;
  supplierId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  material: Material;
  materials: Array<Material>;
  supplier: Supplier;
  suppliers: Array<Supplier>;
};


export type QueryMaterialArgs = {
  materialId: Scalars['ID']['input'];
};


export type QuerySupplierArgs = {
  supplierId: Scalars['ID']['input'];
};

export type SaveMaterialInput = {
  alertQuantity?: InputMaybe<Scalars['Float']['input']>;
  code: Scalars['String']['input'];
  currentQuantity?: InputMaybe<Scalars['Float']['input']>;
  measureUnit: MaterialMeasureUnit;
  name: Scalars['String']['input'];
  suppliers: Array<Scalars['ID']['input']>;
};

export type SaveSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Supplier = {
  __typename?: 'Supplier';
  address?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type MaterialFormContentCreateMaterialMutationMutationVariables = Exact<{
  input: SaveMaterialInput;
}>;


export type MaterialFormContentCreateMaterialMutationMutation = { __typename?: 'Mutation', createMaterial: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MaterialMeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentUpdateMaterialMutationMutationVariables = Exact<{
  materialId: Scalars['ID']['input'];
  input: SaveMaterialInput;
}>;


export type MaterialFormContentUpdateMaterialMutationMutation = { __typename?: 'Mutation', updateMaterial: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MaterialMeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentMaterialQueryQueryVariables = Exact<{
  materialId: Scalars['ID']['input'];
}>;


export type MaterialFormContentMaterialQueryQuery = { __typename?: 'Query', material: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MaterialMeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MaterialFormContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', id: string, name?: string | null }> };

export type MaterialSuppliersContentMaterialQueryQueryVariables = Exact<{
  materialId: Scalars['ID']['input'];
}>;


export type MaterialSuppliersContentMaterialQueryQuery = { __typename?: 'Query', material: { __typename?: 'Material', id: string, name: string } };

export type MaterialsContentMaterialsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MaterialsContentMaterialsQueryQuery = { __typename?: 'Query', materials: Array<{ __typename?: 'Material', id: string, name: string, code: string, measureUnit: MaterialMeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null }> };

export type SupplierFormContentCreateSupplierMutationMutationVariables = Exact<{
  input: SaveSupplierInput;
}>;


export type SupplierFormContentCreateSupplierMutationMutation = { __typename?: 'Mutation', createSupplier: { __typename?: 'Supplier', id: string, name?: string | null, address?: string | null, email?: string | null, phone?: string | null } };

export type SupplierFormContentUpdateSupplierMutationMutationVariables = Exact<{
  supplierId: Scalars['ID']['input'];
  input: SaveSupplierInput;
}>;


export type SupplierFormContentUpdateSupplierMutationMutation = { __typename?: 'Mutation', updateSupplier: { __typename?: 'Supplier', id: string, name?: string | null, address?: string | null, email?: string | null, phone?: string | null } };

export type SupplierFormContentSupplierQueryQueryVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type SupplierFormContentSupplierQueryQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', id: string, name?: string | null, address?: string | null, email?: string | null, phone?: string | null } };

export type SuppliersContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuppliersContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', id: string, name?: string | null, address?: string | null, email?: string | null, phone?: string | null }> };


export const MaterialFormContentCreateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentCreateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentCreateMaterialMutationMutation, MaterialFormContentCreateMaterialMutationMutationVariables>;
export const MaterialFormContentUpdateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentUpdateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentUpdateMaterialMutationMutation, MaterialFormContentUpdateMaterialMutationMutationVariables>;
export const MaterialFormContentMaterialQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentMaterialQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentMaterialQueryQuery, MaterialFormContentMaterialQueryQueryVariables>;
export const MaterialFormContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentSuppliersQueryQuery, MaterialFormContentSuppliersQueryQueryVariables>;
export const MaterialSuppliersContentMaterialQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialSuppliersContentMaterialQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MaterialSuppliersContentMaterialQueryQuery, MaterialSuppliersContentMaterialQueryQueryVariables>;
export const MaterialsContentMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialsContentMaterialsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}}]}}]}}]} as unknown as DocumentNode<MaterialsContentMaterialsQueryQuery, MaterialsContentMaterialsQueryQueryVariables>;
export const SupplierFormContentCreateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentCreateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentCreateSupplierMutationMutation, SupplierFormContentCreateSupplierMutationMutationVariables>;
export const SupplierFormContentUpdateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentUpdateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentUpdateSupplierMutationMutation, SupplierFormContentUpdateSupplierMutationMutationVariables>;
export const SupplierFormContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupplierFormContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentSupplierQueryQuery, SupplierFormContentSupplierQueryQueryVariables>;
export const SuppliersContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuppliersContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SuppliersContentSuppliersQueryQuery, SuppliersContentSuppliersQueryQueryVariables>;
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

export type CreatePurchaseOrderInput = {
  deliveredAt?: InputMaybe<Scalars['DateTime']['input']>;
  deliveryNote?: InputMaybe<Scalars['String']['input']>;
  materials: Array<PurchaseOrderMaterialInput>;
  orderedAt: Scalars['DateTime']['input'];
  payments?: InputMaybe<Array<PurchaseOrderPaymentInput>>;
  supplierId: Scalars['ID']['input'];
  updateStock: Scalars['Boolean']['input'];
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
  cancelPurchaseOrder: Scalars['Boolean']['output'];
  createMaterial: Material;
  createPurchaseOrder: PurchaseOrder;
  createSupplier: Supplier;
  deleteMaterial: Scalars['Boolean']['output'];
  deleteSupplier: Scalars['Boolean']['output'];
  updateMaterial: Material;
  updateSupplier: Supplier;
};


export type MutationCancelPurchaseOrderArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type MutationCreateMaterialArgs = {
  input: SaveMaterialInput;
};


export type MutationCreatePurchaseOrderArgs = {
  input: CreatePurchaseOrderInput;
};


export type MutationCreateSupplierArgs = {
  input: SaveSupplierInput;
};


export type MutationDeleteMaterialArgs = {
  materialId: Scalars['ID']['input'];
};


export type MutationDeleteSupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type MutationUpdateMaterialArgs = {
  input: SaveMaterialInput;
  materialId: Scalars['ID']['input'];
};


export type MutationUpdateSupplierArgs = {
  input: SaveSupplierInput;
  supplierId: Scalars['ID']['input'];
};

export type PaginatedMaterials = {
  __typename?: 'PaginatedMaterials';
  items: Array<Material>;
  paginationInfo: PaginationInfo;
};

export type PaginatedPurchaseOrders = {
  __typename?: 'PaginatedPurchaseOrders';
  items: Array<PurchaseOrder>;
  paginationInfo: PaginationInfo;
};

export type PaginatedSuppliers = {
  __typename?: 'PaginatedSuppliers';
  items: Array<Supplier>;
  paginationInfo: PaginationInfo;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  count: Scalars['Int']['output'];
  pageNumber: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
};

export type PaginationInput = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  deliveryNote?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  materials: Array<PurchaseOrderMaterial>;
  orderedAt: Scalars['DateTime']['output'];
  paidAmount: Scalars['Float']['output'];
  payments?: Maybe<Array<PurchaseOrderPayment>>;
  status: PurchaseOrderStatus;
  supplier: Supplier;
  totalAmount: Scalars['Float']['output'];
};

export type PurchaseOrderMaterial = {
  __typename?: 'PurchaseOrderMaterial';
  material: Material;
  quantity: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type PurchaseOrderMaterialInput = {
  materialId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type PurchaseOrderPayment = {
  __typename?: 'PurchaseOrderPayment';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  method: PurchaseOrderPaymentMethod;
  notes?: Maybe<Scalars['String']['output']>;
  paidAt: Scalars['DateTime']['output'];
};

export type PurchaseOrderPaymentInput = {
  amount: Scalars['Float']['input'];
  method: PurchaseOrderPaymentMethod;
  notes?: InputMaybe<Scalars['String']['input']>;
  paidAt: Scalars['DateTime']['input'];
};

export enum PurchaseOrderPaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  Check = 'CHECK',
  ECheck = 'E_CHECK'
}

export enum PurchaseOrderStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED'
}

export type Query = {
  __typename?: 'Query';
  material: Material;
  materials: PaginatedMaterials;
  purchaseOrder: PurchaseOrder;
  purchaseOrders: PaginatedPurchaseOrders;
  supplier: Supplier;
  suppliers: PaginatedSuppliers;
};


export type QueryMaterialArgs = {
  materialId: Scalars['ID']['input'];
};


export type QueryMaterialsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchMaterialInput>;
};


export type QueryPurchaseOrderArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryPurchaseOrdersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchPurchaseOrderInput>;
};


export type QuerySupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type QuerySuppliersArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchSupplierInput>;
};

export enum QuerySortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type SearchMaterialInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  lowQuantity?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<SearchMaterialQuerySortField>;
  sortOrder?: InputMaybe<QuerySortOrder>;
};

export enum SearchMaterialQuerySortField {
  Code = 'CODE',
  Name = 'NAME'
}

export enum SearchPurchaseOrderDeliveryStatus {
  All = 'ALL',
  Delivered = 'DELIVERED',
  Undelivered = 'UNDELIVERED'
}

export type SearchPurchaseOrderInput = {
  deliveryStatus?: InputMaybe<SearchPurchaseOrderDeliveryStatus>;
  orderedAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  orderedAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  paymentStatus?: InputMaybe<SearchPurchaseOrderPaymentStatus>;
  sortField?: InputMaybe<SearchPurchaseOrderQuerySortField>;
  sortOrder?: InputMaybe<QuerySortOrder>;
  supplierId?: InputMaybe<Scalars['ID']['input']>;
};

export enum SearchPurchaseOrderPaymentStatus {
  All = 'ALL',
  Paid = 'PAID',
  Unpaid = 'UNPAID'
}

export enum SearchPurchaseOrderQuerySortField {
  DeliveredAt = 'DELIVERED_AT',
  OrderedAt = 'ORDERED_AT'
}

export type SearchSupplierInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<QuerySortOrder>;
};

export type Supplier = {
  __typename?: 'Supplier';
  address?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  materials: Array<Material>;
  name: Scalars['String']['output'];
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


export type MaterialFormContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type MaterialsContainerMaterialsQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchMaterialInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MaterialsContainerMaterialsQueryQuery = { __typename?: 'Query', materials: { __typename?: 'PaginatedMaterials', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'Material', id: string, name: string, code: string, measureUnit: MaterialMeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null }> } };

export type MaterialsContainerDeleteMaterialMutationMutationVariables = Exact<{
  materialId: Scalars['ID']['input'];
}>;


export type MaterialsContainerDeleteMaterialMutationMutation = { __typename?: 'Mutation', deleteMaterial: boolean };

export type PurchaseOrderFormContainerCreatePurchaseOrderMutationMutationVariables = Exact<{
  input: CreatePurchaseOrderInput;
}>;


export type PurchaseOrderFormContainerCreatePurchaseOrderMutationMutation = { __typename?: 'Mutation', createPurchaseOrder: { __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, deliveryNote?: string | null, totalAmount: number, paidAmount: number, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'PurchaseOrderMaterial', quantity: number, unitPrice: number, material: { __typename?: 'Material', id: string, name: string } }>, payments?: Array<{ __typename?: 'PurchaseOrderPayment', id: string, amount: number, method: PurchaseOrderPaymentMethod, paidAt: any, notes?: string | null }> | null } };

export type PurchaseOrderFormContainerMaterialsContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PurchaseOrderFormContainerMaterialsContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type PurchaseOrderFormContainerMaterialsContentSupplierQueryQueryVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type PurchaseOrderFormContainerMaterialsContentSupplierQueryQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', id: string, materials: Array<{ __typename?: 'Material', id: string, code: string, name: string, measureUnit: MaterialMeasureUnit }> } };

export type PurchaseOrdersContainerPurchaseOrdersQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchPurchaseOrderInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type PurchaseOrdersContainerPurchaseOrdersQueryQuery = { __typename?: 'Query', purchaseOrders: { __typename?: 'PaginatedPurchaseOrders', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, totalAmount: number, paidAmount: number, status: PurchaseOrderStatus, supplier: { __typename?: 'Supplier', id: string, name: string } }> } };

export type PurchaseOrdersContainerCancelPurchaseOrderMutationMutationVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerCancelPurchaseOrderMutationMutation = { __typename?: 'Mutation', cancelPurchaseOrder: boolean };

export type PurchaseOrdersContainerDetailContentPuchaseOrderQueryQueryVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerDetailContentPuchaseOrderQueryQuery = { __typename?: 'Query', purchaseOrder: { __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, deliveryNote?: string | null, totalAmount: number, paidAmount: number, supplier: { __typename?: 'Supplier', name: string }, materials: Array<{ __typename?: 'PurchaseOrderMaterial', quantity: number, unitPrice: number, material: { __typename?: 'Material', code: string, name: string, measureUnit: MaterialMeasureUnit } }>, payments?: Array<{ __typename?: 'PurchaseOrderPayment', id: string, method: PurchaseOrderPaymentMethod, amount: number, paidAt: any, notes?: string | null }> | null } };

export type SuppliersSelectSuppliersQueryQueryVariables = Exact<{
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SuppliersSelectSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string, deletedAt?: any | null }> } };

export type SupplierFormContentCreateSupplierMutationMutationVariables = Exact<{
  input: SaveSupplierInput;
}>;


export type SupplierFormContentCreateSupplierMutationMutation = { __typename?: 'Mutation', createSupplier: { __typename?: 'Supplier', id: string, name: string, address?: string | null, email?: string | null, phone?: string | null } };

export type SupplierFormContentUpdateSupplierMutationMutationVariables = Exact<{
  supplierId: Scalars['ID']['input'];
  input: SaveSupplierInput;
}>;


export type SupplierFormContentUpdateSupplierMutationMutation = { __typename?: 'Mutation', updateSupplier: { __typename?: 'Supplier', id: string, name: string, address?: string | null, email?: string | null, phone?: string | null } };

export type SupplierFormContentSupplierQueryQueryVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type SupplierFormContentSupplierQueryQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', id: string, name: string, address?: string | null, email?: string | null, phone?: string | null } };

export type SuppliersContainerSuppliersQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchSupplierInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type SuppliersContainerSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'Supplier', id: string, name: string, address?: string | null, email?: string | null, phone?: string | null }> } };

export type SuppliersContainerDeleteSupplierMutationMutationVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type SuppliersContainerDeleteSupplierMutationMutation = { __typename?: 'Mutation', deleteSupplier: boolean };


export const MaterialFormContentCreateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentCreateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentCreateMaterialMutationMutation, MaterialFormContentCreateMaterialMutationMutationVariables>;
export const MaterialFormContentUpdateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentUpdateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentUpdateMaterialMutationMutation, MaterialFormContentUpdateMaterialMutationMutationVariables>;
export const MaterialFormContentMaterialQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentMaterialQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentMaterialQueryQuery, MaterialFormContentMaterialQueryQueryVariables>;
export const MaterialFormContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentSuppliersQueryQuery, MaterialFormContentSuppliersQueryQueryVariables>;
export const MaterialsContainerMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialsContainerMaterialsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchMaterialInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialsContainerMaterialsQueryQuery, MaterialsContainerMaterialsQueryQueryVariables>;
export const MaterialsContainerDeleteMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialsContainerDeleteMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}]}]}}]} as unknown as DocumentNode<MaterialsContainerDeleteMaterialMutationMutation, MaterialsContainerDeleteMaterialMutationMutationVariables>;
export const PurchaseOrderFormContainerCreatePurchaseOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrderFormContainerCreatePurchaseOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePurchaseOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPurchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryNote"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerCreatePurchaseOrderMutationMutation, PurchaseOrderFormContainerCreatePurchaseOrderMutationMutationVariables>;
export const PurchaseOrderFormContainerMaterialsContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrderFormContainerMaterialsContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerMaterialsContentSuppliersQueryQuery, PurchaseOrderFormContainerMaterialsContentSuppliersQueryQueryVariables>;
export const PurchaseOrderFormContainerMaterialsContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrderFormContainerMaterialsContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerMaterialsContentSupplierQueryQuery, PurchaseOrderFormContainerMaterialsContentSupplierQueryQueryVariables>;
export const PurchaseOrdersContainerPurchaseOrdersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrdersContainerPurchaseOrdersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchPurchaseOrderInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerPurchaseOrdersQueryQuery, PurchaseOrdersContainerPurchaseOrdersQueryQueryVariables>;
export const PurchaseOrdersContainerCancelPurchaseOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrdersContainerCancelPurchaseOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelPurchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}]}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerCancelPurchaseOrderMutationMutation, PurchaseOrdersContainerCancelPurchaseOrderMutationMutationVariables>;
export const PurchaseOrdersContainerDetailContentPuchaseOrderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrdersContainerDetailContentPuchaseOrderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryNote"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerDetailContentPuchaseOrderQueryQuery, PurchaseOrdersContainerDetailContentPuchaseOrderQueryQueryVariables>;
export const SuppliersSelectSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuppliersSelectSuppliersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]}}]} as unknown as DocumentNode<SuppliersSelectSuppliersQueryQuery, SuppliersSelectSuppliersQueryQueryVariables>;
export const SupplierFormContentCreateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentCreateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentCreateSupplierMutationMutation, SupplierFormContentCreateSupplierMutationMutationVariables>;
export const SupplierFormContentUpdateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentUpdateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentUpdateSupplierMutationMutation, SupplierFormContentUpdateSupplierMutationMutationVariables>;
export const SupplierFormContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupplierFormContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentSupplierQueryQuery, SupplierFormContentSupplierQueryQueryVariables>;
export const SuppliersContainerSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuppliersContainerSuppliersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchSupplierInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<SuppliersContainerSuppliersQueryQuery, SuppliersContainerSuppliersQueryQueryVariables>;
export const SuppliersContainerDeleteSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuppliersContainerDeleteSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}]}]}}]} as unknown as DocumentNode<SuppliersContainerDeleteSupplierMutationMutation, SuppliersContainerDeleteSupplierMutationMutationVariables>;
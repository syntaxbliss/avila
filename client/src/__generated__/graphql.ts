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
  requestForQuotationId?: InputMaybe<Scalars['ID']['input']>;
  supplierId: Scalars['ID']['input'];
  updateStock: Scalars['Boolean']['input'];
};

export type CreateRequestForQuotationInput = {
  materials: Array<RequestForQuotationMaterialInput>;
  orderedAt: Scalars['DateTime']['input'];
  paymentMethod: PaymentMethod;
  supplierId: Scalars['ID']['input'];
};

export type Machine = {
  __typename?: 'Machine';
  code: Scalars['String']['output'];
  elements: Array<MachineElement>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type MachineElement = {
  __typename?: 'MachineElement';
  element: MachineElementElementUnion;
  id: Scalars['ID']['output'];
  quantity: Scalars['Float']['output'];
};

export enum MachineElementElementType {
  Material = 'MATERIAL',
  Part = 'PART'
}

export type MachineElementElementUnion = Material | Part;

export type MachineElementInput = {
  elementId: Scalars['ID']['input'];
  elementType: MachineElementElementType;
  quantity: Scalars['Float']['input'];
};

export type Material = {
  __typename?: 'Material';
  alertQuantity?: Maybe<Scalars['Float']['output']>;
  code: Scalars['String']['output'];
  currentQuantity?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  measureUnit: MeasureUnit;
  name: Scalars['String']['output'];
  suppliers: Array<Supplier>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export enum MeasureUnit {
  Gr = 'GR',
  Kg = 'KG',
  Lt = 'LT',
  Mt = 'MT',
  Tn = 'TN',
  Unit = 'UNIT'
}

export type Mutation = {
  __typename?: 'Mutation';
  createMachine: Machine;
  createMaterial: Material;
  createPart: Part;
  createPurchaseOrder: PurchaseOrder;
  createRequestForQuotation: RequestForQuotation;
  createSupplier: Supplier;
  deleteMachine: Scalars['Boolean']['output'];
  deleteMaterial: Scalars['Boolean']['output'];
  deletePart: Scalars['Boolean']['output'];
  deletePurchaseOrder: Scalars['Boolean']['output'];
  deleteRequestForQuotation: Scalars['Boolean']['output'];
  deleteSupplier: Scalars['Boolean']['output'];
  printPurchaseOrder: Scalars['String']['output'];
  purchaseOrderDelivered: Scalars['Boolean']['output'];
  registerPurchaseOrderPayment: Scalars['Boolean']['output'];
  saveRequestForQuotationAnswer: Scalars['Boolean']['output'];
  updateMachine: Machine;
  updateMaterial: Material;
  updateMaterialQuantity: Scalars['Boolean']['output'];
  updateMaterialUnitPrice: Material;
  updatePart: Part;
  updateSupplier: Supplier;
};


export type MutationCreateMachineArgs = {
  input: SaveMachineInput;
};


export type MutationCreateMaterialArgs = {
  input: SaveMaterialInput;
};


export type MutationCreatePartArgs = {
  input: SavePartInput;
};


export type MutationCreatePurchaseOrderArgs = {
  input: CreatePurchaseOrderInput;
};


export type MutationCreateRequestForQuotationArgs = {
  input: CreateRequestForQuotationInput;
};


export type MutationCreateSupplierArgs = {
  input: SaveSupplierInput;
};


export type MutationDeleteMachineArgs = {
  machineId: Scalars['ID']['input'];
};


export type MutationDeleteMaterialArgs = {
  materialId: Scalars['ID']['input'];
};


export type MutationDeletePartArgs = {
  partId: Scalars['ID']['input'];
};


export type MutationDeletePurchaseOrderArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type MutationDeleteRequestForQuotationArgs = {
  requestForQuotationId: Scalars['ID']['input'];
};


export type MutationDeleteSupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type MutationPrintPurchaseOrderArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type MutationPurchaseOrderDeliveredArgs = {
  input: PurchaseOrderDeliveredInput;
  purchaseOrderId: Scalars['ID']['input'];
};


export type MutationRegisterPurchaseOrderPaymentArgs = {
  input: PurchaseOrderPaymentInput;
  purchaseOrderId: Scalars['ID']['input'];
};


export type MutationSaveRequestForQuotationAnswerArgs = {
  input: SaveRequestForQuotationAnswerInput;
  requestForQuotationId: Scalars['ID']['input'];
};


export type MutationUpdateMachineArgs = {
  input: SaveMachineInput;
  machineId: Scalars['ID']['input'];
};


export type MutationUpdateMaterialArgs = {
  input: SaveMaterialInput;
  materialId: Scalars['ID']['input'];
};


export type MutationUpdateMaterialQuantityArgs = {
  input: UpdateMaterialQuantityInput;
};


export type MutationUpdateMaterialUnitPriceArgs = {
  materialId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
};


export type MutationUpdatePartArgs = {
  input: SavePartInput;
  partId: Scalars['ID']['input'];
};


export type MutationUpdateSupplierArgs = {
  input: SaveSupplierInput;
  supplierId: Scalars['ID']['input'];
};

export type PaginatedMachines = {
  __typename?: 'PaginatedMachines';
  items: Array<Machine>;
  paginationInfo: PaginationInfo;
};

export type PaginatedMaterials = {
  __typename?: 'PaginatedMaterials';
  items: Array<Material>;
  paginationInfo: PaginationInfo;
};

export type PaginatedParts = {
  __typename?: 'PaginatedParts';
  items: Array<Part>;
  paginationInfo: PaginationInfo;
};

export type PaginatedPurchaseOrders = {
  __typename?: 'PaginatedPurchaseOrders';
  items: Array<PurchaseOrder>;
  paginationInfo: PaginationInfo;
};

export type PaginatedRequestsForQuotation = {
  __typename?: 'PaginatedRequestsForQuotation';
  items: Array<RequestForQuotation>;
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

export type Part = {
  __typename?: 'Part';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  materials: Array<PartMaterial>;
  name: Scalars['String']['output'];
};

export type PartMaterial = {
  __typename?: 'PartMaterial';
  id: Scalars['ID']['output'];
  material: Material;
  quantity: Scalars['Float']['output'];
};

export type PartMaterialInput = {
  materialId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  Check = 'CHECK',
  CurrentAccount = 'CURRENT_ACCOUNT',
  ECheck = 'E_CHECK'
}

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  deliveryNote?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  materials: Array<PurchaseOrderMaterial>;
  orderedAt: Scalars['DateTime']['output'];
  paidAmount: Scalars['Float']['output'];
  payments?: Maybe<Array<PurchaseOrderPayment>>;
  supplier: Supplier;
  totalAmount: Scalars['Float']['output'];
};

export type PurchaseOrderDeliveredInput = {
  deliveredAt: Scalars['DateTime']['input'];
  deliveryNote?: InputMaybe<Scalars['String']['input']>;
  updateStock: Scalars['Boolean']['input'];
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
  method: PaymentMethod;
  notes?: Maybe<Scalars['String']['output']>;
  paidAt: Scalars['DateTime']['output'];
};

export type PurchaseOrderPaymentInput = {
  amount: Scalars['Float']['input'];
  method: PaymentMethod;
  notes?: InputMaybe<Scalars['String']['input']>;
  paidAt: Scalars['DateTime']['input'];
};

export type Query = {
  __typename?: 'Query';
  machine: Machine;
  machines: PaginatedMachines;
  material: Material;
  materials: PaginatedMaterials;
  part: Part;
  parts: PaginatedParts;
  purchaseOrder: PurchaseOrder;
  purchaseOrders: PaginatedPurchaseOrders;
  requestForQuotation: RequestForQuotation;
  requestsForQuotation: PaginatedRequestsForQuotation;
  requestsForQuotationEligibleForPurchaseOrders: Array<RequestForQuotation>;
  supplier: Supplier;
  suppliers: PaginatedSuppliers;
};


export type QueryMachineArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryMachinesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchMachineInput>;
};


export type QueryMaterialArgs = {
  materialId: Scalars['ID']['input'];
};


export type QueryMaterialsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchMaterialInput>;
};


export type QueryPartArgs = {
  partId: Scalars['ID']['input'];
};


export type QueryPartsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchPartInput>;
};


export type QueryPurchaseOrderArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryPurchaseOrdersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchPurchaseOrderInput>;
};


export type QueryRequestForQuotationArgs = {
  requestForQuotationId: Scalars['ID']['input'];
};


export type QueryRequestsForQuotationArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchRequestForQuotationInput>;
};


export type QuerySupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type QuerySuppliersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  searchParams?: InputMaybe<SearchSupplierInput>;
};

export enum QuerySortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type RequestForQuotation = {
  __typename?: 'RequestForQuotation';
  hasAssociatedPurchaseOrder: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  materials: Array<RequestForQuotationMaterial>;
  orderedAt: Scalars['DateTime']['output'];
  paymentMethod: PaymentMethod;
  status: RequestForQuotationStatus;
  supplier: Supplier;
};

export type RequestForQuotationAnswerMaterialInput = {
  materialId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type RequestForQuotationMaterial = {
  __typename?: 'RequestForQuotationMaterial';
  material: Material;
  quantity: Scalars['Float']['output'];
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type RequestForQuotationMaterialInput = {
  materialId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
};

export enum RequestForQuotationStatus {
  Answered = 'ANSWERED',
  Unanswered = 'UNANSWERED'
}

export type SaveMachineInput = {
  code: Scalars['String']['input'];
  elements: Array<MachineElementInput>;
  name: Scalars['String']['input'];
};

export type SaveMaterialInput = {
  alertQuantity?: InputMaybe<Scalars['Float']['input']>;
  code: Scalars['String']['input'];
  currentQuantity?: InputMaybe<Scalars['Float']['input']>;
  measureUnit: MeasureUnit;
  name: Scalars['String']['input'];
  suppliers: Array<Scalars['ID']['input']>;
};

export type SavePartInput = {
  code: Scalars['String']['input'];
  materials: Array<PartMaterialInput>;
  name: Scalars['String']['input'];
};

export type SaveRequestForQuotationAnswerInput = {
  materials: Array<RequestForQuotationAnswerMaterialInput>;
};

export type SaveSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type SearchMachineInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<SearchMachineQuerySortField>;
  sortOrder?: InputMaybe<QuerySortOrder>;
};

export enum SearchMachineQuerySortField {
  Code = 'CODE',
  Name = 'NAME'
}

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

export type SearchPartInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<SearchPartQuerySortField>;
  sortOrder?: InputMaybe<QuerySortOrder>;
};

export enum SearchPartQuerySortField {
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

export type SearchRequestForQuotationInput = {
  orderedAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  orderedAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  sortOrder?: InputMaybe<QuerySortOrder>;
  status?: InputMaybe<SearchRequestForQuotationStatus>;
  supplierId?: InputMaybe<Scalars['ID']['input']>;
};

export enum SearchRequestForQuotationStatus {
  All = 'ALL',
  Answered = 'ANSWERED',
  Unanswered = 'UNANSWERED'
}

export type SearchSupplierInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<QuerySortOrder>;
};

export type Supplier = {
  __typename?: 'Supplier';
  address?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  materials: Array<Material>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type UpdateMaterialQuantityInput = {
  materialId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
};

export type MachineFormContentMachineQueryQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type MachineFormContentMachineQueryQuery = { __typename?: 'Query', machine: { __typename?: 'Machine', id: string, name: string, code: string, elements: Array<{ __typename?: 'MachineElement', id: string, quantity: number, element: { __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit } | { __typename?: 'Part', id: string, code: string, name: string } }> } };

export type MachineFormContentCreateMachineMutationMutationVariables = Exact<{
  input: SaveMachineInput;
}>;


export type MachineFormContentCreateMachineMutationMutation = { __typename?: 'Mutation', createMachine: { __typename?: 'Machine', id: string } };

export type MachineFormContentUpdateMachineMutationMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  input: SaveMachineInput;
}>;


export type MachineFormContentUpdateMachineMutationMutation = { __typename?: 'Mutation', updateMachine: { __typename?: 'Machine', id: string } };

export type MachineFormContainerElementsContentMaterialsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MachineFormContainerElementsContentMaterialsQueryQuery = { __typename?: 'Query', materials: { __typename?: 'PaginatedMaterials', items: Array<{ __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit }> } };

export type MachineFormContainerElementsContentPartsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MachineFormContainerElementsContentPartsQueryQuery = { __typename?: 'Query', parts: { __typename?: 'PaginatedParts', items: Array<{ __typename?: 'Part', id: string, name: string, code: string }> } };

export type MachinesContainerMachinesQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchMachineInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MachinesContainerMachinesQueryQuery = { __typename?: 'Query', machines: { __typename?: 'PaginatedMachines', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'Machine', id: string, name: string, code: string }> } };

export type MachinesContainerDeleteMachineMutationMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type MachinesContainerDeleteMachineMutationMutation = { __typename?: 'Mutation', deleteMachine: boolean };

export type MaterialFormContentCreateMaterialMutationMutationVariables = Exact<{
  input: SaveMaterialInput;
}>;


export type MaterialFormContentCreateMaterialMutationMutation = { __typename?: 'Mutation', createMaterial: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentUpdateMaterialMutationMutationVariables = Exact<{
  materialId: Scalars['ID']['input'];
  input: SaveMaterialInput;
}>;


export type MaterialFormContentUpdateMaterialMutationMutation = { __typename?: 'Mutation', updateMaterial: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentMaterialQueryQueryVariables = Exact<{
  materialId: Scalars['ID']['input'];
}>;


export type MaterialFormContentMaterialQueryQuery = { __typename?: 'Query', material: { __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null, suppliers: Array<{ __typename?: 'Supplier', id: string }> } };

export type MaterialFormContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MaterialFormContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type MaterialsContainerMaterialsQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchMaterialInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MaterialsContainerMaterialsQueryQuery = { __typename?: 'Query', materials: { __typename?: 'PaginatedMaterials', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit, currentQuantity?: number | null, alertQuantity?: number | null }> } };

export type MaterialsContainerDeleteMaterialMutationMutationVariables = Exact<{
  materialId: Scalars['ID']['input'];
}>;


export type MaterialsContainerDeleteMaterialMutationMutation = { __typename?: 'Mutation', deleteMaterial: boolean };

export type MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationMutationVariables = Exact<{
  input: UpdateMaterialQuantityInput;
}>;


export type MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationMutation = { __typename?: 'Mutation', updateMaterialQuantity: boolean };

export type PartFormContentPartQueryQueryVariables = Exact<{
  partId: Scalars['ID']['input'];
}>;


export type PartFormContentPartQueryQuery = { __typename?: 'Query', part: { __typename?: 'Part', id: string, name: string, code: string, materials: Array<{ __typename?: 'PartMaterial', quantity: number, material: { __typename?: 'Material', id: string } }> } };

export type PartFormContentCreatePartMutationMutationVariables = Exact<{
  input: SavePartInput;
}>;


export type PartFormContentCreatePartMutationMutation = { __typename?: 'Mutation', createPart: { __typename?: 'Part', id: string } };

export type PartFormContentUpdatePartMutationMutationVariables = Exact<{
  partId: Scalars['ID']['input'];
  input: SavePartInput;
}>;


export type PartFormContentUpdatePartMutationMutation = { __typename?: 'Mutation', updatePart: { __typename?: 'Part', id: string } };

export type PartFormContainerMaterialsContentMaterialsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PartFormContainerMaterialsContentMaterialsQueryQuery = { __typename?: 'Query', materials: { __typename?: 'PaginatedMaterials', items: Array<{ __typename?: 'Material', id: string, name: string, code: string, measureUnit: MeasureUnit }> } };

export type PartsContainerPartsQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchPartInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type PartsContainerPartsQueryQuery = { __typename?: 'Query', parts: { __typename?: 'PaginatedParts', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'Part', id: string, name: string, code: string }> } };

export type PartsContainerDeletePartMutationMutationVariables = Exact<{
  partId: Scalars['ID']['input'];
}>;


export type PartsContainerDeletePartMutationMutation = { __typename?: 'Mutation', deletePart: boolean };

export type PriceListContentMaterialsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PriceListContentMaterialsQueryQuery = { __typename?: 'Query', materials: { __typename?: 'PaginatedMaterials', items: Array<{ __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit, unitPrice?: number | null }> } };

export type PriceListContentPartsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PriceListContentPartsQueryQuery = { __typename?: 'Query', parts: { __typename?: 'PaginatedParts', items: Array<{ __typename?: 'Part', id: string, code: string, name: string, materials: Array<{ __typename?: 'PartMaterial', quantity: number, material: { __typename?: 'Material', id: string } }> }> } };

export type PriceListContentMachinesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PriceListContentMachinesQueryQuery = { __typename?: 'Query', machines: { __typename?: 'PaginatedMachines', items: Array<{ __typename?: 'Machine', id: string, code: string, name: string, elements: Array<{ __typename?: 'MachineElement', quantity: number, element: { __typename?: 'Material', id: string } | { __typename?: 'Part', id: string } }> }> } };

export type PriceListContentUpdateMaterialUnitPriceMutationMutationVariables = Exact<{
  materialId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
}>;


export type PriceListContentUpdateMaterialUnitPriceMutationMutation = { __typename?: 'Mutation', updateMaterialUnitPrice: { __typename?: 'Material', id: string, unitPrice?: number | null } };

export type PurchaseOrderFormContainerRequestForQuotationQueryQueryVariables = Exact<{
  requestForQuotationId: Scalars['ID']['input'];
}>;


export type PurchaseOrderFormContainerRequestForQuotationQueryQuery = { __typename?: 'Query', requestForQuotation: { __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, hasAssociatedPurchaseOrder: boolean, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'RequestForQuotationMaterial', quantity: number, unitPrice?: number | null, material: { __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit } }> } };

export type PurchaseOrderFormContainerCreatePurchaseOrderMutationMutationVariables = Exact<{
  input: CreatePurchaseOrderInput;
}>;


export type PurchaseOrderFormContainerCreatePurchaseOrderMutationMutation = { __typename?: 'Mutation', createPurchaseOrder: { __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, deliveryNote?: string | null, totalAmount: number, paidAmount: number, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'PurchaseOrderMaterial', quantity: number, unitPrice: number, material: { __typename?: 'Material', id: string, name: string } }>, payments?: Array<{ __typename?: 'PurchaseOrderPayment', id: string, amount: number, method: PaymentMethod, paidAt: any, notes?: string | null }> | null } };

export type EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQueryQuery = { __typename?: 'Query', requestsForQuotationEligibleForPurchaseOrders: Array<{ __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'RequestForQuotationMaterial', quantity: number, unitPrice?: number | null, material: { __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit } }> }> };

export type PurchaseOrderFormContainerMaterialsContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type PurchaseOrderFormContainerMaterialsContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type PurchaseOrderFormContainerMaterialsContentSupplierQueryQueryVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type PurchaseOrderFormContainerMaterialsContentSupplierQueryQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', id: string, materials: Array<{ __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit }> } };

export type PurchaseOrdersContainerPurchaseOrdersQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchPurchaseOrderInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type PurchaseOrdersContainerPurchaseOrdersQueryQuery = { __typename?: 'Query', purchaseOrders: { __typename?: 'PaginatedPurchaseOrders', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, totalAmount: number, paidAmount: number, supplier: { __typename?: 'Supplier', id: string, name: string } }> } };

export type PurchaseOrdersContainerDeletePurchaseOrderMutationMutationVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerDeletePurchaseOrderMutationMutation = { __typename?: 'Mutation', deletePurchaseOrder: boolean };

export type PurchaseOrdersContainerPrintPurchaseOrderMutationMutationVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerPrintPurchaseOrderMutationMutation = { __typename?: 'Mutation', printPurchaseOrder: string };

export type PurchaseOrdersContainerDetailContentPuchaseOrderQueryQueryVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerDetailContentPuchaseOrderQueryQuery = { __typename?: 'Query', purchaseOrder: { __typename?: 'PurchaseOrder', id: string, orderedAt: any, deliveredAt?: any | null, deliveryNote?: string | null, totalAmount: number, paidAmount: number, supplier: { __typename?: 'Supplier', name: string }, materials: Array<{ __typename?: 'PurchaseOrderMaterial', quantity: number, unitPrice: number, material: { __typename?: 'Material', code: string, name: string, measureUnit: MeasureUnit } }>, payments?: Array<{ __typename?: 'PurchaseOrderPayment', id: string, method: PaymentMethod, amount: number, paidAt: any, notes?: string | null }> | null } };

export type SuppliersSelectSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuppliersSelectSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationMutationVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
  input: PurchaseOrderDeliveredInput;
}>;


export type PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationMutation = { __typename?: 'Mutation', purchaseOrderDelivered: boolean };

export type PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryQueryVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
}>;


export type PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryQuery = { __typename?: 'Query', purchaseOrder: { __typename?: 'PurchaseOrder', payments?: Array<{ __typename?: 'PurchaseOrderPayment', method: PaymentMethod, amount: number, paidAt: any, notes?: string | null }> | null } };

export type PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationMutationVariables = Exact<{
  purchaseOrderId: Scalars['ID']['input'];
  input: PurchaseOrderPaymentInput;
}>;


export type PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationMutation = { __typename?: 'Mutation', registerPurchaseOrderPayment: boolean };

export type RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutationMutationVariables = Exact<{
  requestForQuotationId: Scalars['ID']['input'];
  input: SaveRequestForQuotationAnswerInput;
}>;


export type RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutationMutation = { __typename?: 'Mutation', saveRequestForQuotationAnswer: boolean };

export type RequestForQuotationAnswerFormContentRequestForQuotationQueryQueryVariables = Exact<{
  requestForQuotationId: Scalars['ID']['input'];
}>;


export type RequestForQuotationAnswerFormContentRequestForQuotationQueryQuery = { __typename?: 'Query', requestForQuotation: { __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'RequestForQuotationMaterial', quantity: number, material: { __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit } }> } };

export type RequestForQuotationContainerDetailRequestForQuotationQueryQueryVariables = Exact<{
  requestForQuotationId: Scalars['ID']['input'];
}>;


export type RequestForQuotationContainerDetailRequestForQuotationQueryQuery = { __typename?: 'Query', requestForQuotation: { __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, supplier: { __typename?: 'Supplier', name: string }, materials: Array<{ __typename?: 'RequestForQuotationMaterial', quantity: number, unitPrice?: number | null, material: { __typename?: 'Material', code: string, name: string, measureUnit: MeasureUnit } }> } };

export type RequestForQuotationFormContainerCreateRequestForQuotationMutationMutationVariables = Exact<{
  input: CreateRequestForQuotationInput;
}>;


export type RequestForQuotationFormContainerCreateRequestForQuotationMutationMutation = { __typename?: 'Mutation', createRequestForQuotation: { __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, supplier: { __typename?: 'Supplier', id: string, name: string }, materials: Array<{ __typename?: 'RequestForQuotationMaterial', quantity: number, unitPrice?: number | null, material: { __typename?: 'Material', id: string, name: string } }> } };

export type RequestForQuotationFormContainerMaterialsContentSuppliersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type RequestForQuotationFormContainerMaterialsContentSuppliersQueryQuery = { __typename?: 'Query', suppliers: { __typename?: 'PaginatedSuppliers', items: Array<{ __typename?: 'Supplier', id: string, name: string }> } };

export type RequestForQuotationFormContainerMaterialsContentSupplierQueryQueryVariables = Exact<{
  supplierId: Scalars['ID']['input'];
}>;


export type RequestForQuotationFormContainerMaterialsContentSupplierQueryQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', id: string, materials: Array<{ __typename?: 'Material', id: string, code: string, name: string, measureUnit: MeasureUnit }> } };

export type RequestsForQuotationContainerRequestsForQuotationQueryQueryVariables = Exact<{
  searchParams?: InputMaybe<SearchRequestForQuotationInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type RequestsForQuotationContainerRequestsForQuotationQueryQuery = { __typename?: 'Query', requestsForQuotation: { __typename?: 'PaginatedRequestsForQuotation', paginationInfo: { __typename?: 'PaginationInfo', count: number, pageNumber: number, pageSize: number }, items: Array<{ __typename?: 'RequestForQuotation', id: string, orderedAt: any, paymentMethod: PaymentMethod, status: RequestForQuotationStatus, hasAssociatedPurchaseOrder: boolean, supplier: { __typename?: 'Supplier', id: string, name: string } }> } };

export type RequestsForQuotationContainerDeleteRequestForQuotationMutationMutationVariables = Exact<{
  requestForQuotationId: Scalars['ID']['input'];
}>;


export type RequestsForQuotationContainerDeleteRequestForQuotationMutationMutation = { __typename?: 'Mutation', deleteRequestForQuotation: boolean };

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


export const MachineFormContentMachineQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MachineFormContentMachineQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"machine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"machineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"element"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Material"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Part"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MachineFormContentMachineQueryQuery, MachineFormContentMachineQueryQueryVariables>;
export const MachineFormContentCreateMachineMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MachineFormContentCreateMachineMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMachineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMachine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MachineFormContentCreateMachineMutationMutation, MachineFormContentCreateMachineMutationMutationVariables>;
export const MachineFormContentUpdateMachineMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MachineFormContentUpdateMachineMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMachineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMachine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"machineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MachineFormContentUpdateMachineMutationMutation, MachineFormContentUpdateMachineMutationMutationVariables>;
export const MachineFormContainerElementsContentMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MachineFormContainerElementsContentMaterialsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}}]}}]}}]} as unknown as DocumentNode<MachineFormContainerElementsContentMaterialsQueryQuery, MachineFormContainerElementsContentMaterialsQueryQueryVariables>;
export const MachineFormContainerElementsContentPartsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MachineFormContainerElementsContentPartsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<MachineFormContainerElementsContentPartsQueryQuery, MachineFormContainerElementsContentPartsQueryQueryVariables>;
export const MachinesContainerMachinesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MachinesContainerMachinesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchMachineInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"machines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<MachinesContainerMachinesQueryQuery, MachinesContainerMachinesQueryQueryVariables>;
export const MachinesContainerDeleteMachineMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MachinesContainerDeleteMachineMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMachine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"machineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"machineId"}}}]}]}}]} as unknown as DocumentNode<MachinesContainerDeleteMachineMutationMutation, MachinesContainerDeleteMachineMutationMutationVariables>;
export const MaterialFormContentCreateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentCreateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentCreateMaterialMutationMutation, MaterialFormContentCreateMaterialMutationMutationVariables>;
export const MaterialFormContentUpdateMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialFormContentUpdateMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveMaterialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentUpdateMaterialMutationMutation, MaterialFormContentUpdateMaterialMutationMutationVariables>;
export const MaterialFormContentMaterialQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentMaterialQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentMaterialQueryQuery, MaterialFormContentMaterialQueryQueryVariables>;
export const MaterialFormContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialFormContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialFormContentSuppliersQueryQuery, MaterialFormContentSuppliersQueryQueryVariables>;
export const MaterialsContainerMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaterialsContainerMaterialsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchMaterialInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"alertQuantity"}}]}}]}}]}}]} as unknown as DocumentNode<MaterialsContainerMaterialsQueryQuery, MaterialsContainerMaterialsQueryQueryVariables>;
export const MaterialsContainerDeleteMaterialMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialsContainerDeleteMaterialMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMaterial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}}]}]}}]} as unknown as DocumentNode<MaterialsContainerDeleteMaterialMutationMutation, MaterialsContainerDeleteMaterialMutationMutationVariables>;
export const MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMaterialQuantityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMaterialQuantity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationMutation, MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationMutationVariables>;
export const PartFormContentPartQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PartFormContentPartQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"part"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<PartFormContentPartQueryQuery, PartFormContentPartQueryQueryVariables>;
export const PartFormContentCreatePartMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PartFormContentCreatePartMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PartFormContentCreatePartMutationMutation, PartFormContentCreatePartMutationMutationVariables>;
export const PartFormContentUpdatePartMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PartFormContentUpdatePartMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PartFormContentUpdatePartMutationMutation, PartFormContentUpdatePartMutationMutationVariables>;
export const PartFormContainerMaterialsContentMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PartFormContainerMaterialsContentMaterialsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}}]}}]}}]} as unknown as DocumentNode<PartFormContainerMaterialsContentMaterialsQueryQuery, PartFormContainerMaterialsContentMaterialsQueryQueryVariables>;
export const PartsContainerPartsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PartsContainerPartsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchPartInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<PartsContainerPartsQueryQuery, PartsContainerPartsQueryQueryVariables>;
export const PartsContainerDeletePartMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PartsContainerDeletePartMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partId"}}}]}]}}]} as unknown as DocumentNode<PartsContainerDeletePartMutationMutation, PartsContainerDeletePartMutationMutationVariables>;
export const PriceListContentMaterialsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PriceListContentMaterialsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]}}]} as unknown as DocumentNode<PriceListContentMaterialsQueryQuery, PriceListContentMaterialsQueryQueryVariables>;
export const PriceListContentPartsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PriceListContentPartsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PriceListContentPartsQueryQuery, PriceListContentPartsQueryQueryVariables>;
export const PriceListContentMachinesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PriceListContentMachinesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"machines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"element"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Material"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Part"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PriceListContentMachinesQueryQuery, PriceListContentMachinesQueryQueryVariables>;
export const PriceListContentUpdateMaterialUnitPriceMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PriceListContentUpdateMaterialUnitPriceMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unitPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMaterialUnitPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"materialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialId"}}},{"kind":"Argument","name":{"kind":"Name","value":"unitPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unitPrice"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]} as unknown as DocumentNode<PriceListContentUpdateMaterialUnitPriceMutationMutation, PriceListContentUpdateMaterialUnitPriceMutationMutationVariables>;
export const PurchaseOrderFormContainerRequestForQuotationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrderFormContainerRequestForQuotationQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestForQuotationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"hasAssociatedPurchaseOrder"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerRequestForQuotationQueryQuery, PurchaseOrderFormContainerRequestForQuotationQueryQueryVariables>;
export const PurchaseOrderFormContainerCreatePurchaseOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrderFormContainerCreatePurchaseOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePurchaseOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPurchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryNote"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerCreatePurchaseOrderMutationMutation, PurchaseOrderFormContainerCreatePurchaseOrderMutationMutationVariables>;
export const EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestsForQuotationEligibleForPurchaseOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]}}]} as unknown as DocumentNode<EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQueryQuery, EligibleRequestsForQuotationListRequestsForQuotationEligibleForPurchaseOrdersQueryQueryVariables>;
export const PurchaseOrderFormContainerMaterialsContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrderFormContainerMaterialsContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerMaterialsContentSuppliersQueryQuery, PurchaseOrderFormContainerMaterialsContentSuppliersQueryQueryVariables>;
export const PurchaseOrderFormContainerMaterialsContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrderFormContainerMaterialsContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrderFormContainerMaterialsContentSupplierQueryQuery, PurchaseOrderFormContainerMaterialsContentSupplierQueryQueryVariables>;
export const PurchaseOrdersContainerPurchaseOrdersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrdersContainerPurchaseOrdersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchPurchaseOrderInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerPurchaseOrdersQueryQuery, PurchaseOrdersContainerPurchaseOrdersQueryQueryVariables>;
export const PurchaseOrdersContainerDeletePurchaseOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrdersContainerDeletePurchaseOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePurchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}]}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerDeletePurchaseOrderMutationMutation, PurchaseOrdersContainerDeletePurchaseOrderMutationMutationVariables>;
export const PurchaseOrdersContainerPrintPurchaseOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrdersContainerPrintPurchaseOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"printPurchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}]}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerPrintPurchaseOrderMutationMutation, PurchaseOrdersContainerPrintPurchaseOrderMutationMutationVariables>;
export const PurchaseOrdersContainerDetailContentPuchaseOrderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrdersContainerDetailContentPuchaseOrderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryNote"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerDetailContentPuchaseOrderQueryQuery, PurchaseOrdersContainerDetailContentPuchaseOrderQueryQueryVariables>;
export const SuppliersSelectSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuppliersSelectSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SuppliersSelectSuppliersQueryQuery, SuppliersSelectSuppliersQueryQueryVariables>;
export const PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PurchaseOrderDeliveredInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrderDelivered"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationMutation, PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationMutationVariables>;
export const PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryQuery, PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryQueryVariables>;
export const PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PurchaseOrderPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerPurchaseOrderPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"purchaseOrderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purchaseOrderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationMutation, PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationMutationVariables>;
export const RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveRequestForQuotationAnswerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveRequestForQuotationAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestForQuotationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutationMutation, RequestForQuotationAnswerFormSaveRequestForQuotationAnswerMutationMutationVariables>;
export const RequestForQuotationAnswerFormContentRequestForQuotationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestForQuotationAnswerFormContentRequestForQuotationQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestForQuotationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<RequestForQuotationAnswerFormContentRequestForQuotationQueryQuery, RequestForQuotationAnswerFormContentRequestForQuotationQueryQueryVariables>;
export const RequestForQuotationContainerDetailRequestForQuotationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestForQuotationContainerDetailRequestForQuotationQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestForQuotationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]}}]} as unknown as DocumentNode<RequestForQuotationContainerDetailRequestForQuotationQueryQuery, RequestForQuotationContainerDetailRequestForQuotationQueryQueryVariables>;
export const RequestForQuotationFormContainerCreateRequestForQuotationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestForQuotationFormContainerCreateRequestForQuotationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRequestForQuotationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRequestForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]}}]} as unknown as DocumentNode<RequestForQuotationFormContainerCreateRequestForQuotationMutationMutation, RequestForQuotationFormContainerCreateRequestForQuotationMutationMutationVariables>;
export const RequestForQuotationFormContainerMaterialsContentSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestForQuotationFormContainerMaterialsContentSuppliersQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RequestForQuotationFormContainerMaterialsContentSuppliersQueryQuery, RequestForQuotationFormContainerMaterialsContentSuppliersQueryQueryVariables>;
export const RequestForQuotationFormContainerMaterialsContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestForQuotationFormContainerMaterialsContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"materials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}}]}}]}}]}}]} as unknown as DocumentNode<RequestForQuotationFormContainerMaterialsContentSupplierQueryQuery, RequestForQuotationFormContainerMaterialsContentSupplierQueryQueryVariables>;
export const RequestsForQuotationContainerRequestsForQuotationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestsForQuotationContainerRequestsForQuotationQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRequestForQuotationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestsForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"hasAssociatedPurchaseOrder"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RequestsForQuotationContainerRequestsForQuotationQueryQuery, RequestsForQuotationContainerRequestsForQuotationQueryQueryVariables>;
export const RequestsForQuotationContainerDeleteRequestForQuotationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestsForQuotationContainerDeleteRequestForQuotationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRequestForQuotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestForQuotationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestForQuotationId"}}}]}]}}]} as unknown as DocumentNode<RequestsForQuotationContainerDeleteRequestForQuotationMutationMutation, RequestsForQuotationContainerDeleteRequestForQuotationMutationMutationVariables>;
export const SupplierFormContentCreateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentCreateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentCreateSupplierMutationMutation, SupplierFormContentCreateSupplierMutationMutationVariables>;
export const SupplierFormContentUpdateSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupplierFormContentUpdateSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveSupplierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentUpdateSupplierMutationMutation, SupplierFormContentUpdateSupplierMutationMutationVariables>;
export const SupplierFormContentSupplierQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupplierFormContentSupplierQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<SupplierFormContentSupplierQueryQuery, SupplierFormContentSupplierQueryQueryVariables>;
export const SuppliersContainerSuppliersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuppliersContainerSuppliersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchSupplierInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suppliers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginationInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<SuppliersContainerSuppliersQueryQuery, SuppliersContainerSuppliersQueryQueryVariables>;
export const SuppliersContainerDeleteSupplierMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuppliersContainerDeleteSupplierMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"supplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supplierId"}}}]}]}}]} as unknown as DocumentNode<SuppliersContainerDeleteSupplierMutationMutation, SuppliersContainerDeleteSupplierMutationMutationVariables>;
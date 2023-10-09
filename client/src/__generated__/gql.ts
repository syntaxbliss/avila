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
    "\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    ": types.MaterialFormContentCreateMaterialMutationDocument,
    "\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    ": types.MaterialFormContentUpdateMaterialMutationDocument,
    "\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    ": types.MaterialFormContentMaterialQueryDocument,
    "\n      query MaterialFormContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    ": types.MaterialFormContentSuppliersQueryDocument,
    "\n      query MaterialsContainerMaterialsQuery ($searchParams: SearchMaterialInput, $pagination: PaginationInput) {\n        materials (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            code\n            measureUnit\n            currentQuantity\n            alertQuantity\n          }\n        }\n      }\n    ": types.MaterialsContainerMaterialsQueryDocument,
    "\n      mutation MaterialsContainerDeleteMaterialMutation ($materialId: ID!) {\n        deleteMaterial (materialId: $materialId)\n      }\n    ": types.MaterialsContainerDeleteMaterialMutationDocument,
    "\n      mutation MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutation ($input: UpdateMaterialQuantityInput!) {\n        updateMaterialQuantity (input: $input)\n      }\n    ": types.MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutationDocument,
    "\n      mutation PurchaseOrderFormContainerCreatePurchaseOrderMutation($input: CreatePurchaseOrderInput!) {\n        createPurchaseOrder(input: $input) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            amount\n            method\n            paidAt\n            notes\n          }\n        }\n      }\n    ": types.PurchaseOrderFormContainerCreatePurchaseOrderMutationDocument,
    "\n      query PurchaseOrderFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    ": types.PurchaseOrderFormContainerMaterialsContentSuppliersQueryDocument,
    "\n      query PurchaseOrderFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    ": types.PurchaseOrderFormContainerMaterialsContentSupplierQueryDocument,
    "\n      query PurchaseOrdersContainerPurchaseOrdersQuery ($searchParams: SearchPurchaseOrderInput, $pagination: PaginationInput) {\n        purchaseOrders (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            deliveredAt\n            totalAmount\n            paidAmount\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.PurchaseOrdersContainerPurchaseOrdersQueryDocument,
    "\n      mutation PurchaseOrdersContainerCancelPurchaseOrderMutation ($purchaseOrderId: ID!) {\n        cancelPurchaseOrder (purchaseOrderId: $purchaseOrderId)\n      }\n    ": types.PurchaseOrdersContainerCancelPurchaseOrderMutationDocument,
    "\n      query PurchaseOrdersContainerDetailContentPuchaseOrderQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            name\n          }\n          materials {\n            material {\n              code\n              name\n              measureUnit\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    ": types.PurchaseOrdersContainerDetailContentPuchaseOrderQueryDocument,
    "\n      query SuppliersSelectSuppliersQuery ($includeDeleted: Boolean) {\n        suppliers (includeDeleted: $includeDeleted) {\n          items {\n            id\n            name\n            deletedAt\n          }\n        }\n      }\n    ": types.SuppliersSelectSuppliersQueryDocument,
    "\n      mutation PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderDeliveredInput!\n      ) {\n        purchaseOrderDelivered (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    ": types.PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutationDocument,
    "\n      query PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          payments {\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    ": types.PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQueryDocument,
    "\n      mutation PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderPaymentInput!\n      ) {\n        registerPurchaseOrderPayment (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    ": types.PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutationDocument,
    "\n      mutation RequestForQuotationFormContainerCreateRequestForQuotationMutation($input: CreateRequestForQuotationInput!) {\n        createRequestForQuotation(input: $input) {\n          id\n          orderedAt\n          paymentMethod\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n        }\n      }\n    ": types.RequestForQuotationFormContainerCreateRequestForQuotationMutationDocument,
    "\n      query RequestForQuotationFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    ": types.RequestForQuotationFormContainerMaterialsContentSuppliersQueryDocument,
    "\n      query RequestForQuotationFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    ": types.RequestForQuotationFormContainerMaterialsContentSupplierQueryDocument,
    "\n      query RequestsForQuotationContainerRequestsForQuotationQuery ($searchParams: SearchRequestForQuotationInput, $pagination: PaginationInput) {\n        requestsForQuotation (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            paymentMethod\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.RequestsForQuotationContainerRequestsForQuotationQueryDocument,
    "\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    ": types.SupplierFormContentCreateSupplierMutationDocument,
    "\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    ": types.SupplierFormContentUpdateSupplierMutationDocument,
    "\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    ": types.SupplierFormContentSupplierQueryDocument,
    "\n      query SuppliersContainerSuppliersQuery ($searchParams: SearchSupplierInput, $pagination: PaginationInput) {\n        suppliers (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            address\n            email\n            phone\n          }\n        }\n      }\n    ": types.SuppliersContainerSuppliersQueryDocument,
    "\n      mutation SuppliersContainerDeleteSupplierMutation ($supplierId: ID!) {\n        deleteSupplier (supplierId: $supplierId)\n      }\n    ": types.SuppliersContainerDeleteSupplierMutationDocument,
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
export function gql(source: "\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation MaterialFormContentCreateMaterialMutation($input: SaveMaterialInput!) {\n        createMaterial(input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation MaterialFormContentUpdateMaterialMutation($materialId: ID!, $input: SaveMaterialInput!) {\n        updateMaterial(materialId: $materialId, input: $input) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query MaterialFormContentMaterialQuery($materialId: ID!) {\n        material(materialId: $materialId) {\n          id\n          name\n          code\n          measureUnit\n          currentQuantity\n          alertQuantity\n          suppliers {\n            id\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query MaterialFormContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query MaterialFormContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query MaterialsContainerMaterialsQuery ($searchParams: SearchMaterialInput, $pagination: PaginationInput) {\n        materials (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            code\n            measureUnit\n            currentQuantity\n            alertQuantity\n          }\n        }\n      }\n    "): (typeof documents)["\n      query MaterialsContainerMaterialsQuery ($searchParams: SearchMaterialInput, $pagination: PaginationInput) {\n        materials (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            code\n            measureUnit\n            currentQuantity\n            alertQuantity\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation MaterialsContainerDeleteMaterialMutation ($materialId: ID!) {\n        deleteMaterial (materialId: $materialId)\n      }\n    "): (typeof documents)["\n      mutation MaterialsContainerDeleteMaterialMutation ($materialId: ID!) {\n        deleteMaterial (materialId: $materialId)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutation ($input: UpdateMaterialQuantityInput!) {\n        updateMaterialQuantity (input: $input)\n      }\n    "): (typeof documents)["\n      mutation MaterialsContainerUpdateStockFormUpdateMaterialQuantityMutation ($input: UpdateMaterialQuantityInput!) {\n        updateMaterialQuantity (input: $input)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation PurchaseOrderFormContainerCreatePurchaseOrderMutation($input: CreatePurchaseOrderInput!) {\n        createPurchaseOrder(input: $input) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            amount\n            method\n            paidAt\n            notes\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation PurchaseOrderFormContainerCreatePurchaseOrderMutation($input: CreatePurchaseOrderInput!) {\n        createPurchaseOrder(input: $input) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            amount\n            method\n            paidAt\n            notes\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PurchaseOrderFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PurchaseOrderFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PurchaseOrderFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PurchaseOrderFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PurchaseOrdersContainerPurchaseOrdersQuery ($searchParams: SearchPurchaseOrderInput, $pagination: PaginationInput) {\n        purchaseOrders (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            deliveredAt\n            totalAmount\n            paidAmount\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PurchaseOrdersContainerPurchaseOrdersQuery ($searchParams: SearchPurchaseOrderInput, $pagination: PaginationInput) {\n        purchaseOrders (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            deliveredAt\n            totalAmount\n            paidAmount\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation PurchaseOrdersContainerCancelPurchaseOrderMutation ($purchaseOrderId: ID!) {\n        cancelPurchaseOrder (purchaseOrderId: $purchaseOrderId)\n      }\n    "): (typeof documents)["\n      mutation PurchaseOrdersContainerCancelPurchaseOrderMutation ($purchaseOrderId: ID!) {\n        cancelPurchaseOrder (purchaseOrderId: $purchaseOrderId)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PurchaseOrdersContainerDetailContentPuchaseOrderQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            name\n          }\n          materials {\n            material {\n              code\n              name\n              measureUnit\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PurchaseOrdersContainerDetailContentPuchaseOrderQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          id\n          orderedAt\n          deliveredAt\n          deliveryNote\n          totalAmount\n          paidAmount\n          supplier {\n            name\n          }\n          materials {\n            material {\n              code\n              name\n              measureUnit\n            }\n            quantity\n            unitPrice\n          }\n          payments {\n            id\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query SuppliersSelectSuppliersQuery ($includeDeleted: Boolean) {\n        suppliers (includeDeleted: $includeDeleted) {\n          items {\n            id\n            name\n            deletedAt\n          }\n        }\n      }\n    "): (typeof documents)["\n      query SuppliersSelectSuppliersQuery ($includeDeleted: Boolean) {\n        suppliers (includeDeleted: $includeDeleted) {\n          items {\n            id\n            name\n            deletedAt\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderDeliveredInput!\n      ) {\n        purchaseOrderDelivered (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    "): (typeof documents)["\n      mutation PurchaseOrdersContainerOrderDeliveredFormPurchaseOrderDeliveredMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderDeliveredInput!\n      ) {\n        purchaseOrderDelivered (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          payments {\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PurchaseOrdersContainerRegisterPaymentFormPurchaseOrderPaymentsQuery ($purchaseOrderId: ID!) {\n        purchaseOrder (purchaseOrderId: $purchaseOrderId) {\n          payments {\n            method\n            amount\n            paidAt\n            notes\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderPaymentInput!\n      ) {\n        registerPurchaseOrderPayment (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    "): (typeof documents)["\n      mutation PurchaseOrdersContainerRegisterPaymentFormRegisterPurchaseOrderPaymentMutation (\n        $purchaseOrderId: ID!,\n        $input: PurchaseOrderPaymentInput!\n      ) {\n        registerPurchaseOrderPayment (purchaseOrderId: $purchaseOrderId, input: $input)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation RequestForQuotationFormContainerCreateRequestForQuotationMutation($input: CreateRequestForQuotationInput!) {\n        createRequestForQuotation(input: $input) {\n          id\n          orderedAt\n          paymentMethod\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RequestForQuotationFormContainerCreateRequestForQuotationMutation($input: CreateRequestForQuotationInput!) {\n        createRequestForQuotation(input: $input) {\n          id\n          orderedAt\n          paymentMethod\n          supplier {\n            id\n            name\n          }\n          materials {\n            material {\n              id\n              name\n            }\n            quantity\n            unitPrice\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query RequestForQuotationFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query RequestForQuotationFormContainerMaterialsContentSuppliersQuery {\n        suppliers {\n          items {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query RequestForQuotationFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    "): (typeof documents)["\n      query RequestForQuotationFormContainerMaterialsContentSupplierQuery ($supplierId: ID!) {\n        supplier (supplierId: $supplierId) {\n          id\n          materials {\n            id\n            code\n            name\n            measureUnit\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query RequestsForQuotationContainerRequestsForQuotationQuery ($searchParams: SearchRequestForQuotationInput, $pagination: PaginationInput) {\n        requestsForQuotation (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            paymentMethod\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query RequestsForQuotationContainerRequestsForQuotationQuery ($searchParams: SearchRequestForQuotationInput, $pagination: PaginationInput) {\n        requestsForQuotation (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            orderedAt\n            paymentMethod\n            status\n            supplier {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "): (typeof documents)["\n      mutation SupplierFormContentCreateSupplierMutation($input: SaveSupplierInput!) {\n        createSupplier(input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "): (typeof documents)["\n      mutation SupplierFormContentUpdateSupplierMutation($supplierId: ID!, $input: SaveSupplierInput!) {\n        updateSupplier(supplierId: $supplierId, input: $input) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "): (typeof documents)["\n      query SupplierFormContentSupplierQuery($supplierId: ID!) {\n        supplier(supplierId: $supplierId) {\n          id\n          name\n          address\n          email\n          phone\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query SuppliersContainerSuppliersQuery ($searchParams: SearchSupplierInput, $pagination: PaginationInput) {\n        suppliers (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            address\n            email\n            phone\n          }\n        }\n      }\n    "): (typeof documents)["\n      query SuppliersContainerSuppliersQuery ($searchParams: SearchSupplierInput, $pagination: PaginationInput) {\n        suppliers (searchParams: $searchParams, pagination: $pagination) {\n          paginationInfo {\n            count\n            pageNumber\n            pageSize\n          }\n          items {\n            id\n            name\n            address\n            email\n            phone\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation SuppliersContainerDeleteSupplierMutation ($supplierId: ID!) {\n        deleteSupplier (supplierId: $supplierId)\n      }\n    "): (typeof documents)["\n      mutation SuppliersContainerDeleteSupplierMutation ($supplierId: ID!) {\n        deleteSupplier (supplierId: $supplierId)\n      }\n    "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
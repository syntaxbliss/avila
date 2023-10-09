import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  Material_SupplierEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
} from 'src/entities';
import { CreateRequestForQuotationInput, createRequestForQuotationSchema } from 'src/input-types';
import { mapRequestForQuotationEntityToRequestForQuotation } from 'src/mappers';
import { RequestForQuotation } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => RequestForQuotation)
export default class RequestForQuotationResolver {
  constructor(private readonly ds: DataSource) {}

  @Mutation(() => RequestForQuotation)
  async createRequestForQuotation(
    @Args('input') input: CreateRequestForQuotationInput
  ): Promise<RequestForQuotation> {
    const parsedData = createRequestForQuotationSchema.parse(input);

    return this.ds.transaction(async em => {
      // request for quotation
      const requestForQuotation = em.create<RequestForQuotationEntity>(RequestForQuotationEntity, {
        orderedAt: parsedData.orderedAt,
        paymentMethod: parsedData.paymentMethod,
      });
      await em.save(requestForQuotation);

      // materials
      const materialsIds = parsedData.materials.map(material => material.materialId);
      const material_suppliers = await em.find(Material_SupplierEntity, {
        where: { supplierId: parsedData.supplierId, materialId: In(materialsIds) },
      });

      if (material_suppliers.length !== materialsIds.length) {
        throw new GraphQLError('BAD_REQUEST');
      }

      const requestForQuotationMaterials = parsedData.materials.map(material => {
        return em.create<RequestForQuotationMaterialEntity>(RequestForQuotationMaterialEntity, {
          requestForQuotation,
          material_supplier: material_suppliers.find(
            m_s => m_s.materialId === material.materialId
          ) as Material_SupplierEntity,
          quantity: material.quantity,
        });
      });
      await Promise.all(requestForQuotationMaterials.map(pom => em.save(pom)));

      return mapRequestForQuotationEntityToRequestForQuotation(requestForQuotation);
    });
  }
}

import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { GraphQLError } from 'graphql';
import {
  Material_SupplierEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
} from 'src/entities';
import {
  CreateRequestForQuotationInput,
  PaginationInput,
  SearchRequestForQuotationInput,
  SearchRequestForQuotationStatusEnum,
  createRequestForQuotationSchema,
} from 'src/input-types';
import { RequestForQuotationMaterialLoader, SupplierLoader } from 'src/loaders';
import { mapRequestForQuotationEntityToRequestForQuotation } from 'src/mappers';
import {
  PaginatedRequestsForQuotation,
  RequestForQuotation,
  RequestForQuotationMaterial,
  Supplier,
} from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => RequestForQuotation)
export default class RequestForQuotationResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly supplierLoader: SupplierLoader,
    private readonly requestForQuotationMaterialLoader: RequestForQuotationMaterialLoader
  ) {}

  @Query(() => PaginatedRequestsForQuotation)
  async requestsForQuotation(
    @Args('searchParams', { nullable: true }) searchParams?: SearchRequestForQuotationInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedRequestsForQuotation> {
    const query = this.ds.manager.createQueryBuilder(
      RequestForQuotationEntity,
      'request_for_quotation'
    );

    if (searchParams?.orderedAtFrom && searchParams?.orderedAtTo) {
      query.where('request_for_quotation.orderedAt BETWEEN :from AND :to', {
        from: dayjs(searchParams.orderedAtFrom).format('YYYY-MM-DD'),
        to: dayjs(searchParams.orderedAtTo).format('YYYY-MM-DD'),
      });
    } else if (searchParams?.orderedAtFrom) {
      query.where('request_for_quotation.orderedAt >= :from', {
        from: dayjs(searchParams.orderedAtFrom).format('YYYY-MM-DD'),
      });
    } else if (searchParams?.orderedAtTo) {
      query.where('request_for_quotation.orderedAt <= :to', {
        to: dayjs(searchParams.orderedAtTo).format('YYYY-MM-DD'),
      });
    }

    if (searchParams?.supplierId) {
      query
        .innerJoin('request_for_quotation.materials', 'request_for_quotation_material')
        .withDeleted()
        .innerJoin('request_for_quotation_material.material_supplier', 'material__supplier')
        .andWhere('material__supplier.supplierId = :supplierId', {
          supplierId: searchParams.supplierId,
        })
        .groupBy('request_for_quotation.id');
    }

    if (searchParams?.status && searchParams.status !== SearchRequestForQuotationStatusEnum.ALL) {
      query.andWhere('request_for_quotation.status = :status', { status: searchParams.status });
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortOrder = searchParams?.sortOrder ?? 'DESC';
    this.supplierLoader.setSupplierByRequestForQuotation({ orderedAt: sortOrder }, true);
    this.requestForQuotationMaterialLoader.setRequestForQuotationMaterialsByRequestForQuotationOrder(
      true
    );
    query.orderBy('request_for_quotation.orderedAt', sortOrder);

    const [requestsForQuotation, count] = await query.getManyAndCount();

    return {
      items: requestsForQuotation.map(requestForQuotation =>
        mapRequestForQuotationEntityToRequestForQuotation(requestForQuotation)
      ),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

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

  @ResolveField()
  async supplier(@Parent() parent: RequestForQuotation): Promise<Supplier> {
    return this.supplierLoader.loadSupplierByRequestForQuotation(parent.id);
  }

  @ResolveField()
  async materials(@Parent() parent: RequestForQuotation): Promise<RequestForQuotationMaterial[]> {
    return this.requestForQuotationMaterialLoader.loadRequestForQuotationMaterialsByRequestForQuotation(
      parent.id
    );
  }
}

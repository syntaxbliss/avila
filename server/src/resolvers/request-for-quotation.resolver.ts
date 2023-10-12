import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { GraphQLError } from 'graphql';
import {
  MaterialSupplierEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
  RequestForQuotationStatusEnum,
} from 'src/entities';
import {
  CreateRequestForQuotationInput,
  PaginationInput,
  SaveRequestForQuotationAnswerInput,
  SearchRequestForQuotationInput,
  SearchRequestForQuotationStatusEnum,
  createRequestForQuotationSchema,
  saveRequestForQuotationAnswerSchema,
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
        .innerJoin('request_for_quotation_material.material_supplier', 'material_supplier')
        .andWhere('material_supplier.supplierId = :supplierId', {
          supplierId: searchParams.supplierId,
        })
        .groupBy('request_for_quotation.id');
    }

    if (searchParams?.status) {
      if (searchParams.status === SearchRequestForQuotationStatusEnum.ANSWERED_AND_UNANSWERED) {
        query.andWhere('request_for_quotation.status IN (:answered, :unanswered)', {
          answered: SearchRequestForQuotationStatusEnum.ANSWERED,
          unanswered: SearchRequestForQuotationStatusEnum.UNANSWERED,
        });
      } else if (searchParams.status !== SearchRequestForQuotationStatusEnum.ALL) {
        query.andWhere('request_for_quotation.status = :status', { status: searchParams.status });
      }
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortOrder = searchParams?.sortOrder ?? 'DESC';
    this.supplierLoader.setSupplierByRequestForQuotationOrder({ orderedAt: sortOrder });
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

  @Query(() => RequestForQuotation)
  async requestForQuotation(
    @Args('requestForQuotationId', { type: () => ID }) requestForQuotationId: string
  ): Promise<RequestForQuotation> {
    const requestForQuotation = await this.ds.manager.findOneByOrFail(RequestForQuotationEntity, {
      id: requestForQuotationId,
    });

    return mapRequestForQuotationEntityToRequestForQuotation(requestForQuotation);
  }

  @Query(() => [RequestForQuotation])
  async requestsForQuotationEligibleForPurchaseOrders() {
    const requestsForQuotation = await this.ds.manager.find(RequestForQuotationEntity, {
      where: { status: RequestForQuotationStatusEnum.ANSWERED },
      order: { orderedAt: 'DESC' },
      relations: { materials: { materialSupplier: { supplier: true } } },
    });

    this.supplierLoader.setSupplierByRequestForQuotationOrder({ orderedAt: 'DESC' });

    return requestsForQuotation.reduce((acc, rfq) => {
      if (rfq.materials[0].materialSupplier) {
        acc.push(mapRequestForQuotationEntityToRequestForQuotation(rfq));
      }

      return acc;
    }, [] as RequestForQuotation[]);
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
      const materialSuppliers = await em.find(MaterialSupplierEntity, {
        where: { supplierId: parsedData.supplierId, materialId: In(materialsIds) },
      });

      if (materialSuppliers.length !== materialsIds.length) {
        throw new GraphQLError('BAD_REQUEST');
      }

      const requestForQuotationMaterials = parsedData.materials.map(material => {
        return em.create<RequestForQuotationMaterialEntity>(RequestForQuotationMaterialEntity, {
          requestForQuotation,
          materialSupplier: materialSuppliers.find(
            ms => ms.materialId === material.materialId
          ) as MaterialSupplierEntity,
          quantity: material.quantity,
        });
      });
      await Promise.all(requestForQuotationMaterials.map(pom => em.save(pom)));

      return mapRequestForQuotationEntityToRequestForQuotation(requestForQuotation);
    });
  }

  @Mutation(() => Boolean)
  async saveRequestForQuotationAnswer(
    @Args('requestForQuotationId', { type: () => ID }) requestForQuotationId: string,
    @Args('input') input: SaveRequestForQuotationAnswerInput
  ) {
    const parsedData = saveRequestForQuotationAnswerSchema.parse(input);
    const requestForQuotation = await this.ds.manager.findOneOrFail(RequestForQuotationEntity, {
      where: { id: requestForQuotationId },
      relations: { materials: { materialSupplier: { material: true } } },
    });

    if (parsedData.materials.length !== requestForQuotation.materials.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      const promises = requestForQuotation.materials.map(rfqm => {
        const receivedRFQM = parsedData.materials.find(
          m => m.materialId === rfqm.materialSupplier.materialId
        );

        if (!receivedRFQM) {
          throw new Error();
        }

        rfqm.unitPrice = receivedRFQM.unitPrice;
        return em.save(rfqm);
      });
      await Promise.all(promises);

      requestForQuotation.status = RequestForQuotationStatusEnum.ANSWERED;
      await em.save(requestForQuotation);

      return true;
    });
  }

  @Mutation(() => Boolean)
  async cancelRequestForQuotation(
    @Args('requestForQuotationId', { type: () => ID }) requestForQuotationId: string
  ): Promise<boolean> {
    const requestForQuotation = await this.ds.manager.findOneByOrFail(RequestForQuotationEntity, {
      id: requestForQuotationId,
    });

    requestForQuotation.status = RequestForQuotationStatusEnum.CANCELLED;
    await this.ds.manager.save(requestForQuotation);

    return true;
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

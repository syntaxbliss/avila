import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { RequestForQuotationEntity } from 'src/entities';
import { mapRequestForQuotationMaterialEntityToRequestForQuotationMaterial } from 'src/mappers';
import { RequestForQuotationMaterial } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class RequestForQuotationMaterialLoader {
  private requestForQuotationMaterialsByRequestForQuotation: {
    loader: DataLoader<string, RequestForQuotationMaterial[]>;
    findOptions: FindManyOptions<RequestForQuotationEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createRequestForQuotationMaterialsByRequestForQuotationLoader();
  }

  private createRequestForQuotationMaterialsByRequestForQuotationLoader() {
    const findOptions: typeof this.requestForQuotationMaterialsByRequestForQuotation.findOptions = {
      relations: { materials: { material_supplier: true } },
      order: { orderedAt: 'DESC', materials: { material_supplier: { material: { name: 'ASC' } } } },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const requestsForQuotation = await this.ds.manager.find(RequestForQuotationEntity, {
          where: { id: In(ids) },
          ...this.requestForQuotationMaterialsByRequestForQuotation.findOptions,
        });

        return ids.map(id => {
          const requestForQuotation = requestsForQuotation.find(rfq => rfq.id === id);

          if (!requestForQuotation) {
            throw new Error();
          }

          return requestForQuotation.materials.map(rfqm =>
            mapRequestForQuotationMaterialEntityToRequestForQuotationMaterial(rfqm)
          );
        });
      },
      { cache: false }
    );

    this.requestForQuotationMaterialsByRequestForQuotation = { findOptions, loader };
  }

  setRequestForQuotationMaterialsByRequestForQuotationOrder(includeDeleted = false) {
    this.requestForQuotationMaterialsByRequestForQuotation.findOptions.withDeleted = includeDeleted;
  }

  loadRequestForQuotationMaterialsByRequestForQuotation(id: string) {
    return this.requestForQuotationMaterialsByRequestForQuotation.loader.load(id);
  }
}

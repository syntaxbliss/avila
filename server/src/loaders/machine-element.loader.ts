import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MachineElementEntity, MachineEntity, MaterialEntity, PartEntity } from 'src/entities';
import {
  mapMachineElementEntityToMachineElement,
  mapMaterialEntityToMaterial,
  mapPartEntityToPart,
} from 'src/mappers';
import { MachineElement, MachineElementUnion } from 'src/object-types';
import { DataSource, FindManyOptions, In } from 'typeorm';

@Injectable()
export default class MachineElementLoader {
  private machineElementsByMachine: {
    loader: DataLoader<string, MachineElement[]>;
    findOptions: FindManyOptions<MachineEntity>;
  };

  private elementByMachineElement: {
    loader: DataLoader<string, typeof MachineElementUnion>;
    findOptions: FindManyOptions<MachineElementEntity>;
  };

  constructor(private readonly ds: DataSource) {
    this.createMachineElementsByMachineLoader();
    this.createElementByMachineElementLoader();
  }

  private createMachineElementsByMachineLoader() {
    const findOptions: typeof this.machineElementsByMachine.findOptions = {
      relations: { elements: true },
      order: { name: 'ASC', elements: { material: { name: 'ASC' }, part: { name: 'ASC' } } },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const machines = await this.ds.manager.find(MachineEntity, {
          where: { id: In(ids) },
          ...this.machineElementsByMachine.findOptions,
        });

        return ids.map(id => {
          const machine = machines.find(m => m.id === id);

          if (!machine) {
            throw new Error();
          }

          return machine.elements.map(e => mapMachineElementEntityToMachineElement(e));
        });
      },
      { cache: false }
    );

    this.machineElementsByMachine = { findOptions, loader };
  }

  private createElementByMachineElementLoader() {
    const findOptions: typeof this.elementByMachineElement.findOptions = {
      relations: { material: true, part: true },
    };

    const loader = new DataLoader(
      async (ids: readonly string[]) => {
        const machineElements = await this.ds.manager.find(MachineElementEntity, {
          where: { id: In(ids) },
          ...this.elementByMachineElement.findOptions,
        });

        return ids.map(id => {
          const machineElement = machineElements.find(me => me.id === id);

          if (!machineElement) {
            throw new Error();
          }

          if (machineElement.materialId) {
            return mapMaterialEntityToMaterial(machineElement.material as MaterialEntity);
          }

          return mapPartEntityToPart(machineElement.part as PartEntity);
        });
      },
      { cache: false }
    );

    this.elementByMachineElement = { findOptions, loader };
  }

  setMachineElementsByMachineOrder(order: FindManyOptions<MachineEntity>['order']) {
    this.machineElementsByMachine.findOptions.order = order;
  }

  loadMachineElementsByMachine(id: string): Promise<MachineElement[]> {
    return this.machineElementsByMachine.loader.load(id);
  }

  loadElementByMachineElement(id: string): Promise<typeof MachineElementUnion> {
    return this.elementByMachineElement.loader.load(id);
  }
}

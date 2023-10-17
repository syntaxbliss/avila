import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as _ from 'lodash';
import {
  MachineElementEntity,
  MachineElementTypeEnum,
  MachineEntity,
  MaterialEntity,
  PartEntity,
} from 'src/entities';
import {
  PaginationInput,
  SaveMachineInput,
  SearchMachineInput,
  saveMachineSchema,
} from 'src/input-types';
import { MachineElementLoader } from 'src/loaders';
import { mapMachineEntityToMachine } from 'src/mappers';
import { Machine, MachineElement, PaginatedMachines } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => Machine)
export default class MachineResolver {
  constructor(
    private readonly ds: DataSource,
    private readonly machineElementLoader: MachineElementLoader
  ) {}

  @Query(() => PaginatedMachines)
  async machines(
    @Args('searchParams', { nullable: true }) searchParams?: SearchMachineInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedMachines> {
    const query = this.ds.manager.createQueryBuilder(MachineEntity, 'machine');

    if (searchParams?.name) {
      query.where('machine.name LIKE :name', { name: `%${searchParams.name}%` });
    }

    if (searchParams?.code) {
      query.andWhere('machine.code LIKE :code', { code: `%${searchParams.code}%` });
    }

    if (pagination) {
      query.offset((pagination.pageNumber - 1) * pagination.pageSize).limit(pagination.pageSize);
    }

    const sortField = searchParams?.sortField ?? 'name';
    const sortOrder = searchParams?.sortOrder ?? 'ASC';
    this.machineElementLoader.setMachineElementsByMachineOrder({
      [sortField]: sortOrder,
      elements: { material: { name: 'ASC' }, part: { name: 'ASC' } },
    });
    query.orderBy(`machine.${sortField}`, sortOrder);

    const [machines, count] = await query.getManyAndCount();

    return {
      items: machines.map(machine => mapMachineEntityToMachine(machine)),
      paginationInfo: {
        count,
        pageNumber: pagination?.pageNumber ?? 1,
        pageSize: pagination?.pageSize ?? count,
      },
    };
  }

  @Query(() => Machine)
  async machine(@Args('machineId', { type: () => ID }) machineId: string): Promise<Machine> {
    const machine = await this.ds.manager.findOneByOrFail(MachineEntity, { id: machineId });

    this.machineElementLoader.setMachineElementsByMachineOrder({
      name: 'ASC',
      elements: { material: { name: 'ASC' }, part: { name: 'ASC' } },
    });

    return mapMachineEntityToMachine(machine);
  }

  @Mutation(() => Machine)
  async createMachine(@Args('input') input: SaveMachineInput): Promise<Machine> {
    const parsedData = saveMachineSchema.parse(input);

    const [receivedMaterials, receivedParts] = _.partition(
      parsedData.elements,
      e => e.elementType === MachineElementTypeEnum.MATERIAL
    );

    const materials = await this.ds.manager.find(MaterialEntity, {
      where: { id: In(receivedMaterials.map(rm => rm.elementId)) },
    });

    const parts = await this.ds.manager.find(PartEntity, {
      where: { id: In(receivedParts.map(rp => rp.elementId)) },
    });

    if (materials.length !== receivedMaterials.length || parts.length !== receivedParts.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      // machine
      const machine = em.create<MachineEntity>(MachineEntity, {
        name: parsedData.name,
        code: parsedData.code,
      });
      await em.save(machine);

      // machine elements -> materials
      const machineMaterials = receivedMaterials.map(rm => {
        const material = materials.find(m => m.id === rm.elementId);

        if (!material) {
          throw new Error();
        }

        const machineElement = em.create<MachineElementEntity>(MachineElementEntity, {
          machine,
          elementType: MachineElementTypeEnum.MATERIAL,
          quantity: rm.quantity,
          material,
        });

        return machineElement;
      });

      // machine elements -> parts
      const machineParts = receivedParts.map(rp => {
        const part = parts.find(p => p.id === rp.elementId);

        if (!part) {
          throw new Error();
        }

        const machineElement = em.create<MachineElementEntity>(MachineElementEntity, {
          machine,
          elementType: MachineElementTypeEnum.PART,
          quantity: rp.quantity,
          part,
        });

        return machineElement;
      });

      await Promise.all([...machineMaterials, ...machineParts].map(me => em.save(me)));

      return mapMachineEntityToMachine(machine);
    });
  }

  @Mutation(() => Machine)
  async updateMachine(
    @Args('machineId', { type: () => ID }) machineId: string,
    @Args('input') input: SaveMachineInput
  ): Promise<Machine> {
    const parsedData = saveMachineSchema.parse(input);
    const machine = await this.ds.manager.findOneByOrFail(MachineEntity, { id: machineId });

    const [receivedMaterials, receivedParts] = _.partition(
      parsedData.elements,
      e => e.elementType === MachineElementTypeEnum.MATERIAL
    );

    const materials = await this.ds.manager.find(MaterialEntity, {
      where: { id: In(receivedMaterials.map(rm => rm.elementId)) },
    });

    const parts = await this.ds.manager.find(PartEntity, {
      where: { id: In(receivedParts.map(rp => rp.elementId)) },
    });

    if (materials.length !== receivedMaterials.length || parts.length !== receivedParts.length) {
      throw new GraphQLError('BAD_REQUEST');
    }

    return this.ds.transaction(async em => {
      // machine
      machine.name = parsedData.name;
      machine.code = parsedData.code;
      await em.save(machine);

      // machine elements
      const operations = [];
      const alreadySavedMachineElements = await this.ds.manager.find(MachineElementEntity, {
        where: { machineId },
      });

      parsedData.elements.map(element => {
        const alreadySavedMachineElement = alreadySavedMachineElements.find(
          e => e.materialId === element.elementId || e.partId === element.elementId
        );

        if (alreadySavedMachineElement) {
          alreadySavedMachineElement.quantity = element.quantity;
          operations.push(em.save(alreadySavedMachineElement));
        } else {
          const newMachineElement = em.create<MachineElementEntity>(MachineElementEntity, {
            machine,
            elementType: element.elementType,
            quantity: element.quantity,
            material: materials.find(m => m.id === element.elementId),
            part: parts.find(p => p.id === element.elementId),
          });

          if (!newMachineElement.material && !newMachineElement.part) {
            throw new Error();
          }

          operations.push(em.save(newMachineElement));
        }
      });

      const toDelete = alreadySavedMachineElements.filter(me => {
        return !parsedData.elements.some(
          e => e.elementId === me.materialId || e.elementId === me.partId
        );
      });
      operations.push(...toDelete.map(me => em.remove(me)));

      await Promise.all(operations);

      return mapMachineEntityToMachine(machine);
    });
  }

  @Mutation(() => Boolean)
  async deleteMachine(@Args('machineId', { type: () => ID }) machineId: string): Promise<boolean> {
    await this.ds.manager.delete(MachineEntity, { id: machineId });

    return true;
  }

  @ResolveField()
  async elements(@Parent() parent: Machine): Promise<MachineElement[]> {
    return this.machineElementLoader.loadMachineElementsByMachine(parent.id);
  }
}

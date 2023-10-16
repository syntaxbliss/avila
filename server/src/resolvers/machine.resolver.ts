import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as _ from 'lodash';
import {
  MachineElementEntity,
  MachineElementTypeEnum,
  MachineEntity,
  MaterialEntity,
  PartEntity,
} from 'src/entities';
import { SaveMachineInput, saveMachineSchema } from 'src/input-types';
import { mapMachineEntityToMachine } from 'src/mappers';
import { Machine } from 'src/object-types';
import { DataSource, In } from 'typeorm';

@Resolver(() => Machine)
export default class MachineResolver {
  constructor(private readonly ds: DataSource) {}

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
          part,
        });

        return machineElement;
      });

      await Promise.all([...machineMaterials, ...machineParts].map(me => em.save(me)));

      return mapMachineEntityToMachine(machine);
    });
  }
}

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MachineElementLoader } from 'src/loaders';
import { MachineElement, MachineElementUnion } from 'src/object-types';

@Resolver(() => MachineElement)
export default class MachineElementResolver {
  constructor(private readonly machineElementLoader: MachineElementLoader) {}

  @ResolveField()
  async element(@Parent() parent: MachineElement): Promise<typeof MachineElementUnion> {
    return this.machineElementLoader.loadElementByMachineElement(parent.id);
  }
}

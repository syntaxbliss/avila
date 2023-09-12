import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export default class TestResolver {
  @Query(() => String)
  _() {
    return 'Carpincho!';
  }
}

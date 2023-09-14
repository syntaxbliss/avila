import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import * as _ from 'lodash';

export class PopulateSupplierTable1694686864562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const companies = faker.helpers.uniqueArray(faker.company.name, 50);
    const values = companies.map(company => {
      const id = v4();
      const name = company;
      const address = faker.datatype.boolean()
        ? `"${faker.location.streetAddress()}, ${faker.location.city()}"`
        : null;
      const email = faker.datatype.boolean() ? `"info@${_.kebabCase(name)}.com"` : null;
      const phone = faker.datatype.boolean() ? `"${faker.phone.number()}"` : null;

      return `("${id}", "${name}", ${address}, ${email}, ${phone})`;
    });

    await queryRunner.query(`
      INSERT INTO supplier (id, name, address, email, phone)
      VALUES ${values.join(', ')}
    `);
  }

  public async down(): Promise<void> {
    //
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { MeasureUnitEnum } from 'src/entities';

export class PopulateMaterialTable1694602992720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const materials = faker.helpers.uniqueArray(faker.commerce.productName, 100);
    const codes = new Set();
    const values = materials.map((material, index) => {
      const id = v4();
      const name = material;
      let code = name
        .split(' ')
        .map(word => word.substring(0, 3).toUpperCase())
        .join('-');

      if (codes.has(code)) {
        code = `${code}-${index}`;
      }

      codes.add(code);

      const measureUnit = faker.helpers.enumValue(MeasureUnitEnum);
      const stockable = faker.datatype.boolean();
      const currentQuantity = stockable ? `"${faker.finance.amount(0, 99999.99)}"` : null;
      const alertQuantity = stockable ? `"${faker.finance.amount(0, 99999.99)}"` : null;

      return `("${id}", "${name}", "${code}", "${measureUnit}", ${currentQuantity}, ${alertQuantity})`;
    });

    await queryRunner.query(`
      INSERT INTO material (id, name, code, measureUnit, currentQuantity, alertQuantity)
      VALUES ${values.join(', ')}
    `);
  }

  public async down(): Promise<void> {
    //
  }
}

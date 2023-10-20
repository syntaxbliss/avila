import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';

export class PopulateConfigurationTable1697770254520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const parameters = [
      { name: 'COMPANY_NAME', value: 'ÁVILA, Juan Pablo' },
      {
        name: 'COMPANY_ADDRESS',
        value: 'Área Industrial - Lotes 13 y 14, Roldán (2134), Santa Fe',
      },
      { name: 'TAX_CONDITION', value: 'IVA Responsable Inscripto' },
      { name: 'NRO_DE_CUIT', value: '23-24002918-9' },
      { name: 'NRO_DE_INGRESOS_BRUTOS', value: '916419770' },
      { name: 'COMPANY_PHONE', value: '3413 486215' },
      { name: 'COMPANY_EMAIL', value: 'administracion@avilamaquinaria.com.ar' },
    ];

    await queryRunner.query(`
      INSERT INTO configuration (id, parameter, value)
      VALUES ${parameters.map(p => `("${v4()}", "${p.name}", "${p.value}")`).join(', ')}
    `);
  }

  public async down(): Promise<void> {
    //
  }
}

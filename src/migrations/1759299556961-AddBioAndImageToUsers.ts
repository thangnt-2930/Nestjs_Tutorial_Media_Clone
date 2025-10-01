import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBioAndImageToUsers1759299556961 implements MigrationInterface {
  name = 'AddBioAndImageToUsers1759299556961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'bio',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'image',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'bio');
    await queryRunner.dropColumn('users', 'image');
  }
}

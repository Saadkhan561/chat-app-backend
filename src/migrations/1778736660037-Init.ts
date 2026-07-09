import type { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778736660037 implements MigrationInterface {
  name = "Init1778736660037";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "parentMessageId" uuid`);
    await queryRunner.query(
      `ALTER TYPE "public"."workspace-members_role_enum" RENAME TO "workspace-members_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workspace-members_role_enum" AS ENUM('admin', 'employee')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" TYPE "public"."workspace-members_role_enum" USING "role"::"text"::"public"."workspace-members_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" SET DEFAULT 'employee'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workspace-members_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_575b24e003b8881e64fa53cd16d" FOREIGN KEY ("parentMessageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_575b24e003b8881e64fa53cd16d"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workspace-members_role_enum_old" AS ENUM('super_admin', 'director', 'manager', 'employee')`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" TYPE "public"."workspace-members_role_enum_old" USING "role"::"text"::"public"."workspace-members_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace-members" ALTER COLUMN "role" SET DEFAULT 'employee'`,
    );
    await queryRunner.query(`DROP TYPE "public"."workspace-members_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."workspace-members_role_enum_old" RENAME TO "workspace-members_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP COLUMN "parentMessageId"`,
    );
  }
}

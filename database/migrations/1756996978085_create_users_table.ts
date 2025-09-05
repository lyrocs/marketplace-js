import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
      table.string('email').notNullable().unique()
      table.timestamp('email_verified').nullable()
      table.string('image').nullable()
      table.string('password').nullable()
      table.string('matrix_login').nullable()
      table.string('matrix_password').nullable()
      table.string('matrix_token').nullable()
      table.enum('role', ['USER', 'ADMIN']).defaultTo('USER')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('matrix_login')
      table.dropColumn('matrix_password')
      table.dropColumn('matrix_token')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('matrix_login').nullable()
      table.string('matrix_password').nullable()
      table.string('matrix_token').nullable()
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'specs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('type').notNullable()
      table.string('value').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
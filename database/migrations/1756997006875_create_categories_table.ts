import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('key').notNullable().unique()
      table.string('image')
      table.string('description')
      table.integer('parent_id').unsigned().nullable().references('id').inTable('categories')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_spec_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.integer('spec_type_id').unsigned().notNullable().references('id').inTable('spec_types')
      table.primary(['category_id', 'spec_type_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
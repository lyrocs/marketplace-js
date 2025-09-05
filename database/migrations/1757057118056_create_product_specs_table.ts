import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_specs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.integer('spec_id').unsigned().notNullable().references('id').inTable('specs')
      table.primary(['product_id', 'spec_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}


import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.integer('brand_id').unsigned().nullable().references('id').inTable('brands')
      table.json('images')
      table.text('description')
      table.json('features')
      table.string('status').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
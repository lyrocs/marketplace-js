import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('user_id').unsigned().notNullable().references('id').inTable('users')
      table.enum('status', ['DRAFT', 'PUBLISHED', 'DECLINED', 'EXPIRED', 'SOLD', 'ARCHIVED']).defaultTo('DRAFT')
      table.decimal('price')
      table.string('currency')
      table.string('location')
      table.string('title')
      table.text('description')
      table.json('images')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
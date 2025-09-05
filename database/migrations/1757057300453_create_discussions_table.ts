import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'discussions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('deal_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('deals')
        .onDelete('CASCADE')
      table.uuid('buyer_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('seller_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('matrix_room_id').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
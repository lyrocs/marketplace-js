import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    // Add matrixLogin and matrixPassword to users table
    this.schema.alterTable('users', (table) => {
      table.string('matrix_login').nullable()
      table.string('matrix_password').nullable()
    })

    // Create discussions table
    this.schema.createTable('discussions', (table) => {
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

    // Create discussion_status table
    this.schema.createTable('discussion_status', (table) => {
      table.increments('id').primary()
      table
        .integer('discussion_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('discussions')
        .onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('new_message').defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable('discussion_status')
    this.schema.dropTable('discussions')
    this.schema.alterTable('users', (table) => {
      table.dropColumn('matrix_login')
      table.dropColumn('matrix_password')
    })
  }
}

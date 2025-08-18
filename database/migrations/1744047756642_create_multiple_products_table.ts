import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Remove images column from deals table
    this.schema.alterTable('deals', (table) => {
      table.dropColumn('product_id')
      table.dropColumn('images')
    })

    // Create deal_products table for many-to-many relationship between deals and products
    this.schema.createTable('deal_products', (table) => {
      table.increments('id')
      table
        .integer('deal_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('deals')
        .onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table.unique(['deal_id', 'product_id'])
      table.integer('quantity').unsigned().notNullable().defaultTo(1)
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })

    // Create deal_images table for storing images related to deals
    this.schema.createTable('deal_images', (table) => {
      table.increments('id')
      table
        .integer('deal_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('deals')
        .onDelete('CASCADE')
      table.string('url').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })

    // Create product_components table for self-referential relationship in products
    this.schema.createTable('product_components', (table) => {
      table.increments('id')
      table
        .integer('drone_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('component_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table.unique(['drone_id', 'component_id'])
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    // Drop product_components table
    this.schema.dropTable('product_components')

    // Drop deal_images table
    this.schema.dropTable('deal_images')

    // Drop deal_products table
    this.schema.dropTable('deal_products')

    // Re-add product_id column to deals table
    this.schema.alterTable('deals', (table) => {
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table.json('images')
    })
  }
}

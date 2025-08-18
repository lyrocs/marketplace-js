import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {


  async up() {

    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable('users', (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
      table.string('email').notNullable().unique()
      table.timestamp('email_verified').nullable()
      table.string('image').nullable()
      table.string('password').nullable()
      table.timestamps(true)
    })

    this.schema.createTable('categories', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.json('specs_types').notNullable()
      table.integer('parent_id').unsigned().nullable().references('id').inTable('categories')
    })

    this.schema.createTable('brands', (table) => {
      table.increments('id')
      table.string('name').notNullable()
    })


    this.schema.createTable('specs', (table) => {
      table.increments('id')
      table.string('type').notNullable()
      table.string('value').notNullable()
    })

    this.schema.createTable('quads', (table) => {
      table.increments('id')
      table.string('name')
      table.text('description')
      table.json('images')
      table.boolean('draft')
      table.timestamps(true)
    })

    this.schema.createTable('products', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.integer('brand_id').unsigned().nullable().references('id').inTable('brands')
      table.json('images')
      table.string('status').notNullable()
      table.timestamps(true)
    })

    this.schema.createTable('product_translations', (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.string('language')
      table.string('name')
      table.text('description')
      table.json('features')
      table.timestamps(true)
    })

    this.schema.createTable('product_specs', (table) => {
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.integer('spec_id').unsigned().notNullable().references('id').inTable('specs')
      table.primary(['product_id', 'spec_id'])
    })

    this.schema.createTable('product_quads', (table) => {
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.integer('quad_id').unsigned().notNullable().references('id').inTable('quads')
      table.primary(['product_id', 'quad_id'])
    })

    this.schema.createTable('deals', (table) => {
      table.increments('id')
      table.uuid('user_id').unsigned().notNullable().references('id').inTable('users')
      table.decimal('price')
      table.string('currency')
      table.string('location')
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.string('title')
      table.text('description')
      table.json('images')
      table.timestamps(true)
    })

    this.schema.createTable('accounts', (table) => {
      table.uuid('user_id').unsigned().notNullable().references('id').inTable('users')
      table.string('type')
      table.string('provider')
      table.text('provider_account_id')
      table.text('refresh_token')
      table.text('access_token')
      table.integer('expires_at')
      table.string('token_type')
      table.text('scope')
      table.text('id_token')
      table.text('session_state')
      table.primary(['provider', 'provider_account_id'])
      table.timestamps(true)
    })

    this.schema.createTable('sources', (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.string('url').notNullable()
      table.float('price')
      table.string('currency')
      table.boolean('available')
      table.string('shop').notNullable()
      table.string('language').notNullable()
      table.timestamps(true)
    })

  }

  async down() {
    this.schema.dropTable('users')
    this.schema.dropTable('quads')
    this.schema.dropTable('products')
    this.schema.dropTable('product_translations')
    this.schema.dropTable('product_specs')
    this.schema.dropTable('product_quads')
    this.schema.dropTable('deals')
    this.schema.dropTable('categories')
    this.schema.dropTable('brands')
    this.schema.dropTable('accounts')
    this.schema.dropTable('specs')
    this.schema.dropTable('sources')
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')

  }
}
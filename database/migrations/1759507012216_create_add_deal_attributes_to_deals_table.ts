import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deals'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('invoice_available').defaultTo(false)
      table.text('selling_reason').nullable()
      table.boolean('can_be_delivered').defaultTo(false)
      table.json('features').defaultTo('[]')
      table.enum('condition', ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).defaultTo('GOOD')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('invoice_available')
      table.dropColumn('selling_reason')
      table.dropColumn('can_be_delivered')
      table.dropColumn('features')
      table.dropColumn('condition')
    })
  }
}
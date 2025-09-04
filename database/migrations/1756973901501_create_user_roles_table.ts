import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.enum('role', ['USER', 'ADMIN']).defaultTo('USER')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('role')
    })
  }
}

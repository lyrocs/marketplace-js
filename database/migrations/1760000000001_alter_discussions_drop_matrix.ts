import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'discussions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('matrix_room_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('matrix_room_id').notNullable().defaultTo('')
    })
  }
}

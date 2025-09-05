import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
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
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
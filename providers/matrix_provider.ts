import type { ApplicationService } from '@adonisjs/core/types'
import { MatrixContractService } from '#contracts/matrix_service'

export default class MatrixProvider {
  constructor(protected app: ApplicationService) { }

  /**
   * Register bindings to the container
   */
  register() { }

  /**
   * The container bindings have booted
   */
  async boot() {
    const { MatrixService } = await import('#services/matrix_service')

    this.app.container.singleton(MatrixContractService, () => {
      return this.app.container.make(MatrixService)
    })
  }

  /**
   * The application has been booted
   */
  async start() { }

  /**
   * The process has been started
   */
  async ready() {
    try {
      const matrix = await this.app.container.make(MatrixContractService)
      await matrix.start()
    } catch (error) {
      console.warn('Matrix service failed to start:', error.message)
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() { }
}

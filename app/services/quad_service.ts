import Quad from '#models/quad'

export class QuadService {
  async all() {
    const quads = await Quad.query().preload('products')
    return quads
  }
}
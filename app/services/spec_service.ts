import Spec from '#models/spec'

export class SpecService {
  async byTypes(types: string[]) {
    const specs = await Spec.query().whereIn('type', types)
    return specs
  }
  async all() {
    const specs = await Spec.query()
    return specs
  }
  async createMany(specsPayload: { type: string; value: string; }[]) {
    const specs = await Promise.all(specsPayload.map(async (spec) => {
      const existingSpec = await Spec.query().where('type', spec.type).andWhere('value', spec.value).first()
      if (!existingSpec) {
        const newSpec = await Spec.create(spec)
        return newSpec
      }
      return existingSpec
    }))

    return specs
  }
}
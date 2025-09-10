import Spec from '#models/spec'
import SpecType from '#models/spec_type'

export class SpecService {
  async byTypes(data: string[]) {
    const typesIds = await SpecType.query().whereIn('key', data).select('id')
    const specs = await Spec.query().whereIn('spec_type_id', typesIds.map((type: any) => type.id))
    return specs
  }
  async all() {
    const specs = await Spec.query().preload('type')
    return specs
  }
  async allTypes() {
    const types = await SpecType.query()
    return types
  }
  async createMany(specsPayload: { type: string; value: string; }[]) {
    const specs: Spec[] = []
    for (const specPayload of specsPayload) {
      let type = await SpecType.query().where('key', specPayload.type).first()
      if (!type) {
        type = await SpecType.create({ key: specPayload.type, label: specPayload.type })
      }
      const spec = await this.create({ specTypeId: type.id, value: specPayload.value })
      specs.push(spec)
    }
    return specs
  }
  async create(data: { specTypeId: number; value: string; }) {
    let spec = await Spec.query().where('spec_type_id', data.specTypeId).andWhere('value', data.value).first()
    if (!spec) {
      spec = await Spec.create({ specTypeId: data.specTypeId, value: data.value })
    }
    return spec
  }
  async update(id: number, data: { specTypeId: number; value: string; }) {
    const spec = await Spec.findOrFail(id)
    spec.merge({
      specTypeId: data.specTypeId,
      value: data.value
    })
    return spec.save()
  }
  async delete(id: number) {
    const spec = await Spec.findOrFail(id)
    return spec.delete()
  }
}
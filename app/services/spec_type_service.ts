import SpecType from '#models/spec_type'

export class SpecTypeService {
  async all() {
    const specs = await SpecType.query()
    return specs
  }
  async create(data: { key: string; label: string; description: string; }) {
    let spec = await SpecType.query().where('key', data.key).first()
    if (!spec) {
      spec = await SpecType.create({ key: data.key, label: data.label, description: data.description })
    }
    return spec
  }
  async update(id: number, data: { key: string; label: string; description: string; }) {
    const spec = await SpecType.findOrFail(id)
    spec.merge({
      key: data.key,
      label: data.label,
      description: data.description
    })
    return spec.save()
  }
  async delete(id: number) {
    const spec = await SpecType.findOrFail(id)
    return spec.delete()
  }
}
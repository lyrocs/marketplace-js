import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'


export default class extends BaseSeeder {
  async run() {
    const electronic = await Category.create({ name: 'ELECTRONIC', specsTypes: JSON.parse(JSON.stringify([])) })
    await Category.createMany([
      { name: 'MOTOR', parentId: electronic.id, specsTypes: JSON.parse(JSON.stringify(["kv"])) },
      { name: 'ESC', parentId: electronic.id, specsTypes: JSON.parse(JSON.stringify(["stack_size", "stack_amp"])) },
      { name: 'FC', parentId: electronic.id, specsTypes: JSON.parse(JSON.stringify(["stack_size"])) },
      { name: 'STACK', parentId: electronic.id, specsTypes: JSON.parse(JSON.stringify(["stack_size", "stack_amp"])) },
    ])
    const video = await Category.create({ name: 'VIDEO', specsTypes: JSON.parse(JSON.stringify([])) })
    await Category.createMany([
      { name: 'CAMERA', parentId: video.id, specsTypes: JSON.parse(JSON.stringify(["camera_size", "video_system"])) },
      { name: 'VTX', parentId: video.id, specsTypes: JSON.parse(JSON.stringify(["vtx_size", "video_system"])) },
      { name: 'VRX', parentId: video.id, specsTypes: JSON.parse(JSON.stringify(["video_system"])) },
      { name: 'GOGGLES', parentId: video.id, specsTypes: JSON.parse(JSON.stringify(["video_system"])) },
    ])
    const radio = await Category.create({ name: 'RADIO', specsTypes: JSON.parse(JSON.stringify([])) })
    await Category.createMany([
      { name: 'RX', parentId: radio.id, specsTypes: JSON.parse(JSON.stringify(["protocol"])) },
      { name: 'TX', parentId: radio.id, specsTypes: JSON.parse(JSON.stringify(["protocol"])) },
      { name: 'RADIO', parentId: radio.id, specsTypes: JSON.parse(JSON.stringify(["protocol"])) },
    ])
    const frame = await Category.create({ name: 'FRAME', specsTypes: JSON.parse(JSON.stringify([])) })
    await Category.createMany([
      { name: 'FRAME_KIT', parentId: frame.id, specsTypes: JSON.parse(JSON.stringify(["frame_size"])) },
      { name: 'FRAME_PART', parentId: frame.id, specsTypes: JSON.parse(JSON.stringify(["frame_size"])) },
    ])
    const battery = await Category.create({ name: 'POWER', specsTypes: JSON.parse(JSON.stringify([])) })
    await Category.createMany([
      { name: 'CHARGEUR', parentId: battery.id, specsTypes: JSON.parse(JSON.stringify(["battery_cell", "battery_type", "battery_connector"])) },
      { name: 'BATTERY', parentId: battery.id, specsTypes: JSON.parse(JSON.stringify(["battery_cell", "battery_capacity", "battery_connector", "battery_type"])) },
    ])
  }
}
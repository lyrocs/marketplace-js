import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'


export default class extends BaseSeeder {
  async run() {
    const electronic = await Category.create({ name: 'ELECTRONIC', specsTypes: [] })
    await Category.createMany([
      { name: 'MOTOR', parentId: electronic.id, specsTypes: ["kv"] },
      { name: 'ESC', parentId: electronic.id, specsTypes: ["stack_size", "stack_amp"] },
      { name: 'FC', parentId: electronic.id, specsTypes: ["stack_size"] },
      { name: 'STACK', parentId: electronic.id, specsTypes: ["stack_size", "stack_amp"] },
    ])
    const video = await Category.create({ name: 'VIDEO', specsTypes: [] })
    await Category.createMany([
      { name: 'CAMERA', parentId: video.id, specsTypes: ["camera_size", "video_system"] },
      { name: 'VTX', parentId: video.id, specsTypes: ["vtx_size", "video_system"] },
      { name: 'VRX', parentId: video.id, specsTypes: ["video_system"] },
      { name: 'GOGGLES', parentId: video.id, specsTypes: ["video_system"] },
    ])
    const radio = await Category.create({ name: 'RADIO', specsTypes: [] })
    await Category.createMany([
      { name: 'RX', parentId: radio.id, specsTypes: ["protocol"] },
      { name: 'TX', parentId: radio.id, specsTypes: ["protocol"] },
      { name: 'RADIO', parentId: radio.id, specsTypes: ["protocol"] },
    ])
    const frame = await Category.create({ name: 'FRAME', specsTypes: [] })
    await Category.createMany([
      { name: 'FRAME_KIT', parentId: frame.id, specsTypes: ["frame_size"] },
      { name: 'FRAME_PART', parentId: frame.id, specsTypes: ["frame_size"] },
    ])
    const battery = await Category.create({ name: 'POWER', specsTypes: [] })
    await Category.createMany([
      { name: 'CHARGEUR', parentId: battery.id, specsTypes: ["battery_cell", "battery_type", "battery_connector"] },
      { name: 'BATTERY', parentId: battery.id, specsTypes: ["battery_cell", "battery_capacity", "battery_connector", "battery_type"] },
    ])
  }
}
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Brand from '#models/brand'
import SpecType from '#models/spec_type'
import Spec from '#models/spec'
import Category from '#models/category'
import Product from '#models/product'
import Shop from '#models/shop'
import User from '#models/user'
import Deal from '#models/deal'
import DealProduct from '#models/deal_product'
import ProductStatus from '#enums/product_status'
import DealStatus from '#enums/deal_status'
import DealCondition from '#enums/deal_condition'
import Roles from '#enums/roles'

export default class DemoSeeder extends BaseSeeder {
  async run() {
    console.log('🎵 Starting Demo Seeder - Audio & Photography Marketplace')

    // ========================================
    // 1. BRANDS
    // ========================================
    console.log('📦 Creating brands...')
    const brands = await Brand.createMany([
      // Audio Brands
      { name: 'Sony' },
      { name: 'Sennheiser' },
      { name: 'Audio-Technica' },
      { name: 'Shure' },
      { name: 'Bose' },
      { name: 'JBL' },
      { name: 'Beyerdynamic' },
      { name: 'Rode' },
      { name: 'Focusrite' },
      { name: 'Universal Audio' },
      { name: 'Yamaha' },
      { name: 'Roland' },
      // Photography Brands
      { name: 'Canon' },
      { name: 'Nikon' },
      { name: 'Fujifilm' },
      { name: 'Panasonic' },
      { name: 'Leica' },
      { name: 'Sigma' },
      { name: 'Tamron' },
      { name: 'Godox' },
      { name: 'Manfrotto' },
      { name: 'Peak Design' },
      { name: 'DJI' },
      { name: 'Blackmagic Design' },
    ])

    const brandMap = brands.reduce(
      (acc, brand) => {
        acc[brand.name] = brand.id
        return acc
      },
      {} as Record<string, number>
    )

    // ========================================
    // 2. SPEC TYPES
    // ========================================
    console.log('🔧 Creating spec types...')
    const specTypes = await SpecType.createMany([
      // Audio Spec Types
      { key: 'DRIVER_SIZE', label: 'Driver Size', description: 'Size of the audio driver in mm' },
      { key: 'FREQUENCY_RESPONSE', label: 'Frequency Response', description: 'Audio frequency range' },
      { key: 'IMPEDANCE', label: 'Impedance', description: 'Electrical impedance in Ohms' },
      { key: 'SENSITIVITY', label: 'Sensitivity', description: 'Audio sensitivity in dB' },
      { key: 'CONNECTIVITY', label: 'Connectivity', description: 'Connection type' },
      { key: 'BATTERY_LIFE', label: 'Battery Life', description: 'Battery duration in hours' },
      { key: 'NOISE_CANCELLATION', label: 'Noise Cancellation', description: 'ANC technology type' },
      { key: 'MICROPHONE_TYPE', label: 'Microphone Type', description: 'Type of microphone' },
      { key: 'POLAR_PATTERN', label: 'Polar Pattern', description: 'Microphone polar pattern' },
      { key: 'SAMPLE_RATE', label: 'Sample Rate', description: 'Audio sample rate' },
      { key: 'BIT_DEPTH', label: 'Bit Depth', description: 'Audio bit depth' },
      { key: 'INPUT_CHANNELS', label: 'Input Channels', description: 'Number of input channels' },
      { key: 'POWER_OUTPUT', label: 'Power Output', description: 'Amplifier power output in watts' },
      // Photography Spec Types
      { key: 'SENSOR_SIZE', label: 'Sensor Size', description: 'Camera sensor format' },
      { key: 'MEGAPIXELS', label: 'Megapixels', description: 'Image resolution in megapixels' },
      { key: 'ISO_RANGE', label: 'ISO Range', description: 'Sensitivity range' },
      { key: 'VIDEO_RESOLUTION', label: 'Video Resolution', description: 'Maximum video resolution' },
      { key: 'AUTOFOCUS_POINTS', label: 'Autofocus Points', description: 'Number of AF points' },
      { key: 'SHUTTER_SPEED', label: 'Shutter Speed', description: 'Shutter speed range' },
      { key: 'FOCAL_LENGTH', label: 'Focal Length', description: 'Lens focal length' },
      { key: 'APERTURE', label: 'Aperture', description: 'Maximum aperture' },
      { key: 'IMAGE_STABILIZATION', label: 'Image Stabilization', description: 'Stabilization type' },
      { key: 'LENS_MOUNT', label: 'Lens Mount', description: 'Compatible lens mount' },
      { key: 'FLASH_POWER', label: 'Flash Power', description: 'Flash guide number' },
      { key: 'COLOR_TEMP', label: 'Color Temperature', description: 'Light color temperature range' },
      { key: 'MAX_LOAD', label: 'Max Load', description: 'Maximum weight capacity' },
      { key: 'MATERIAL', label: 'Material', description: 'Construction material' },
    ])

    const specTypeMap = specTypes.reduce(
      (acc, st) => {
        acc[st.key] = st.id
        return acc
      },
      {} as Record<string, number>
    )

    // ========================================
    // 3. SPECS (Values for each spec type)
    // ========================================
    console.log('📊 Creating specs...')
    const specsData = [
      // Driver Size
      { specTypeId: specTypeMap['DRIVER_SIZE'], value: '40mm' },
      { specTypeId: specTypeMap['DRIVER_SIZE'], value: '50mm' },
      { specTypeId: specTypeMap['DRIVER_SIZE'], value: '53mm' },
      // Frequency Response
      { specTypeId: specTypeMap['FREQUENCY_RESPONSE'], value: '20Hz - 20kHz' },
      { specTypeId: specTypeMap['FREQUENCY_RESPONSE'], value: '10Hz - 40kHz' },
      { specTypeId: specTypeMap['FREQUENCY_RESPONSE'], value: '5Hz - 50kHz' },
      // Impedance
      { specTypeId: specTypeMap['IMPEDANCE'], value: '32 Ohms' },
      { specTypeId: specTypeMap['IMPEDANCE'], value: '80 Ohms' },
      { specTypeId: specTypeMap['IMPEDANCE'], value: '250 Ohms' },
      { specTypeId: specTypeMap['IMPEDANCE'], value: '600 Ohms' },
      // Sensitivity
      { specTypeId: specTypeMap['SENSITIVITY'], value: '98 dB' },
      { specTypeId: specTypeMap['SENSITIVITY'], value: '102 dB' },
      { specTypeId: specTypeMap['SENSITIVITY'], value: '105 dB' },
      // Connectivity
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'Wired 3.5mm' },
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'Bluetooth 5.0' },
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'Bluetooth 5.3' },
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'USB-C' },
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'XLR' },
      { specTypeId: specTypeMap['CONNECTIVITY'], value: 'USB + XLR' },
      // Battery Life
      { specTypeId: specTypeMap['BATTERY_LIFE'], value: '20 hours' },
      { specTypeId: specTypeMap['BATTERY_LIFE'], value: '30 hours' },
      { specTypeId: specTypeMap['BATTERY_LIFE'], value: '40 hours' },
      { specTypeId: specTypeMap['BATTERY_LIFE'], value: '60 hours' },
      // Noise Cancellation
      { specTypeId: specTypeMap['NOISE_CANCELLATION'], value: 'Active (ANC)' },
      { specTypeId: specTypeMap['NOISE_CANCELLATION'], value: 'Passive' },
      { specTypeId: specTypeMap['NOISE_CANCELLATION'], value: 'Adaptive ANC' },
      // Microphone Type
      { specTypeId: specTypeMap['MICROPHONE_TYPE'], value: 'Dynamic' },
      { specTypeId: specTypeMap['MICROPHONE_TYPE'], value: 'Condenser' },
      { specTypeId: specTypeMap['MICROPHONE_TYPE'], value: 'Ribbon' },
      { specTypeId: specTypeMap['MICROPHONE_TYPE'], value: 'USB Condenser' },
      // Polar Pattern
      { specTypeId: specTypeMap['POLAR_PATTERN'], value: 'Cardioid' },
      { specTypeId: specTypeMap['POLAR_PATTERN'], value: 'Supercardioid' },
      { specTypeId: specTypeMap['POLAR_PATTERN'], value: 'Omnidirectional' },
      { specTypeId: specTypeMap['POLAR_PATTERN'], value: 'Figure-8' },
      { specTypeId: specTypeMap['POLAR_PATTERN'], value: 'Multi-pattern' },
      // Sample Rate
      { specTypeId: specTypeMap['SAMPLE_RATE'], value: '48 kHz' },
      { specTypeId: specTypeMap['SAMPLE_RATE'], value: '96 kHz' },
      { specTypeId: specTypeMap['SAMPLE_RATE'], value: '192 kHz' },
      // Bit Depth
      { specTypeId: specTypeMap['BIT_DEPTH'], value: '16-bit' },
      { specTypeId: specTypeMap['BIT_DEPTH'], value: '24-bit' },
      { specTypeId: specTypeMap['BIT_DEPTH'], value: '32-bit float' },
      // Input Channels
      { specTypeId: specTypeMap['INPUT_CHANNELS'], value: '2 inputs' },
      { specTypeId: specTypeMap['INPUT_CHANNELS'], value: '4 inputs' },
      { specTypeId: specTypeMap['INPUT_CHANNELS'], value: '8 inputs' },
      { specTypeId: specTypeMap['INPUT_CHANNELS'], value: '18 inputs' },
      // Power Output
      { specTypeId: specTypeMap['POWER_OUTPUT'], value: '50W' },
      { specTypeId: specTypeMap['POWER_OUTPUT'], value: '100W' },
      { specTypeId: specTypeMap['POWER_OUTPUT'], value: '200W' },
      { specTypeId: specTypeMap['POWER_OUTPUT'], value: '500W' },
      // Sensor Size
      { specTypeId: specTypeMap['SENSOR_SIZE'], value: 'Full Frame' },
      { specTypeId: specTypeMap['SENSOR_SIZE'], value: 'APS-C' },
      { specTypeId: specTypeMap['SENSOR_SIZE'], value: 'Micro 4/3' },
      { specTypeId: specTypeMap['SENSOR_SIZE'], value: 'Medium Format' },
      { specTypeId: specTypeMap['SENSOR_SIZE'], value: '1-inch' },
      // Megapixels
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '24.2 MP' },
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '26.1 MP' },
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '33 MP' },
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '45 MP' },
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '61 MP' },
      { specTypeId: specTypeMap['MEGAPIXELS'], value: '102 MP' },
      // ISO Range
      { specTypeId: specTypeMap['ISO_RANGE'], value: '100-51200' },
      { specTypeId: specTypeMap['ISO_RANGE'], value: '100-102400' },
      { specTypeId: specTypeMap['ISO_RANGE'], value: '50-204800' },
      // Video Resolution
      { specTypeId: specTypeMap['VIDEO_RESOLUTION'], value: '4K 30fps' },
      { specTypeId: specTypeMap['VIDEO_RESOLUTION'], value: '4K 60fps' },
      { specTypeId: specTypeMap['VIDEO_RESOLUTION'], value: '4K 120fps' },
      { specTypeId: specTypeMap['VIDEO_RESOLUTION'], value: '6K' },
      { specTypeId: specTypeMap['VIDEO_RESOLUTION'], value: '8K' },
      // Autofocus Points
      { specTypeId: specTypeMap['AUTOFOCUS_POINTS'], value: '153 points' },
      { specTypeId: specTypeMap['AUTOFOCUS_POINTS'], value: '425 points' },
      { specTypeId: specTypeMap['AUTOFOCUS_POINTS'], value: '693 points' },
      { specTypeId: specTypeMap['AUTOFOCUS_POINTS'], value: '759 points' },
      // Shutter Speed
      { specTypeId: specTypeMap['SHUTTER_SPEED'], value: '1/4000 - 30s' },
      { specTypeId: specTypeMap['SHUTTER_SPEED'], value: '1/8000 - 30s' },
      { specTypeId: specTypeMap['SHUTTER_SPEED'], value: '1/16000 - 30s' },
      // Focal Length
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '24mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '35mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '50mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '85mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '24-70mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '70-200mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '100-400mm' },
      { specTypeId: specTypeMap['FOCAL_LENGTH'], value: '14-24mm' },
      // Aperture
      { specTypeId: specTypeMap['APERTURE'], value: 'f/1.2' },
      { specTypeId: specTypeMap['APERTURE'], value: 'f/1.4' },
      { specTypeId: specTypeMap['APERTURE'], value: 'f/1.8' },
      { specTypeId: specTypeMap['APERTURE'], value: 'f/2.8' },
      { specTypeId: specTypeMap['APERTURE'], value: 'f/4' },
      // Image Stabilization
      { specTypeId: specTypeMap['IMAGE_STABILIZATION'], value: 'In-Body (IBIS)' },
      { specTypeId: specTypeMap['IMAGE_STABILIZATION'], value: 'Optical (OIS)' },
      { specTypeId: specTypeMap['IMAGE_STABILIZATION'], value: 'IBIS + OIS' },
      { specTypeId: specTypeMap['IMAGE_STABILIZATION'], value: 'None' },
      // Lens Mount
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Sony E-Mount' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Canon RF' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Canon EF' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Nikon Z' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Nikon F' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Fujifilm X' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Leica L' },
      { specTypeId: specTypeMap['LENS_MOUNT'], value: 'Micro 4/3' },
      // Flash Power
      { specTypeId: specTypeMap['FLASH_POWER'], value: 'GN 36' },
      { specTypeId: specTypeMap['FLASH_POWER'], value: 'GN 60' },
      { specTypeId: specTypeMap['FLASH_POWER'], value: '200Ws' },
      { specTypeId: specTypeMap['FLASH_POWER'], value: '400Ws' },
      { specTypeId: specTypeMap['FLASH_POWER'], value: '600Ws' },
      // Color Temperature
      { specTypeId: specTypeMap['COLOR_TEMP'], value: '2700K - 6500K' },
      { specTypeId: specTypeMap['COLOR_TEMP'], value: '3200K - 5600K' },
      { specTypeId: specTypeMap['COLOR_TEMP'], value: '5600K (Daylight)' },
      // Max Load
      { specTypeId: specTypeMap['MAX_LOAD'], value: '4 kg' },
      { specTypeId: specTypeMap['MAX_LOAD'], value: '8 kg' },
      { specTypeId: specTypeMap['MAX_LOAD'], value: '12 kg' },
      { specTypeId: specTypeMap['MAX_LOAD'], value: '20 kg' },
      // Material
      { specTypeId: specTypeMap['MATERIAL'], value: 'Aluminum' },
      { specTypeId: specTypeMap['MATERIAL'], value: 'Carbon Fiber' },
      { specTypeId: specTypeMap['MATERIAL'], value: 'Magnesium Alloy' },
    ]

    const specs = await Spec.createMany(specsData)
    const specMap: Record<string, number> = {}
    for (const spec of specs) {
      const specType = specTypes.find((st) => st.id === spec.specTypeId)
      if (specType) {
        specMap[`${specType.key}:${spec.value}`] = spec.id
      }
    }

    // ========================================
    // 4. CATEGORIES
    // ========================================
    console.log('📁 Creating categories...')

    // Root Categories
    const audioCategory = await Category.create({
      name: 'Audio',
      key: 'AUDIO',
      description: 'Professional and consumer audio equipment',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    })

    const photographyCategory = await Category.create({
      name: 'Photography',
      key: 'PHOTOGRAPHY',
      description: 'Cameras, lenses, and photography accessories',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    })

    const videoCategory = await Category.create({
      name: 'Video Production',
      key: 'VIDEO_PRODUCTION',
      description: 'Video cameras, monitors, and production gear',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    })

    // Audio Subcategories
    const headphonesCategory = await Category.create({
      name: 'Headphones',
      key: 'HEADPHONES',
      description: 'Over-ear, on-ear, and in-ear headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      parentId: audioCategory.id,
    })
    await headphonesCategory
      .related('specTypes')
      .attach([
        specTypeMap['DRIVER_SIZE'],
        specTypeMap['FREQUENCY_RESPONSE'],
        specTypeMap['IMPEDANCE'],
        specTypeMap['SENSITIVITY'],
        specTypeMap['CONNECTIVITY'],
        specTypeMap['BATTERY_LIFE'],
        specTypeMap['NOISE_CANCELLATION'],
      ])

    const speakersCategory = await Category.create({
      name: 'Speakers',
      key: 'SPEAKERS',
      description: 'Studio monitors and portable speakers',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
      parentId: audioCategory.id,
    })
    await speakersCategory
      .related('specTypes')
      .attach([
        specTypeMap['DRIVER_SIZE'],
        specTypeMap['FREQUENCY_RESPONSE'],
        specTypeMap['POWER_OUTPUT'],
        specTypeMap['CONNECTIVITY'],
      ])

    const microphonesCategory = await Category.create({
      name: 'Microphones',
      key: 'MICROPHONES',
      description: 'Recording and broadcast microphones',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
      parentId: audioCategory.id,
    })
    await microphonesCategory
      .related('specTypes')
      .attach([
        specTypeMap['MICROPHONE_TYPE'],
        specTypeMap['POLAR_PATTERN'],
        specTypeMap['FREQUENCY_RESPONSE'],
        specTypeMap['CONNECTIVITY'],
      ])

    const audioInterfacesCategory = await Category.create({
      name: 'Audio Interfaces',
      key: 'AUDIO_INTERFACES',
      description: 'USB and Thunderbolt audio interfaces',
      image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',
      parentId: audioCategory.id,
    })
    await audioInterfacesCategory
      .related('specTypes')
      .attach([
        specTypeMap['SAMPLE_RATE'],
        specTypeMap['BIT_DEPTH'],
        specTypeMap['INPUT_CHANNELS'],
        specTypeMap['CONNECTIVITY'],
      ])

    // Photography Subcategories
    const camerasCategory = await Category.create({
      name: 'Cameras',
      key: 'CAMERAS',
      description: 'Mirrorless and DSLR cameras',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      parentId: photographyCategory.id,
    })
    await camerasCategory
      .related('specTypes')
      .attach([
        specTypeMap['SENSOR_SIZE'],
        specTypeMap['MEGAPIXELS'],
        specTypeMap['ISO_RANGE'],
        specTypeMap['VIDEO_RESOLUTION'],
        specTypeMap['AUTOFOCUS_POINTS'],
        specTypeMap['SHUTTER_SPEED'],
        specTypeMap['IMAGE_STABILIZATION'],
        specTypeMap['LENS_MOUNT'],
      ])

    const lensesCategory = await Category.create({
      name: 'Lenses',
      key: 'LENSES',
      description: 'Prime and zoom lenses',
      image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
      parentId: photographyCategory.id,
    })
    await lensesCategory
      .related('specTypes')
      .attach([
        specTypeMap['FOCAL_LENGTH'],
        specTypeMap['APERTURE'],
        specTypeMap['IMAGE_STABILIZATION'],
        specTypeMap['LENS_MOUNT'],
      ])

    const lightingCategory = await Category.create({
      name: 'Lighting',
      key: 'LIGHTING',
      description: 'Studio strobes and continuous lights',
      image: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=800',
      parentId: photographyCategory.id,
    })
    await lightingCategory
      .related('specTypes')
      .attach([specTypeMap['FLASH_POWER'], specTypeMap['COLOR_TEMP'], specTypeMap['CONNECTIVITY']])

    const tripodsCategory = await Category.create({
      name: 'Tripods & Support',
      key: 'TRIPODS',
      description: 'Tripods, monopods, and camera support',
      image: 'https://images.unsplash.com/photo-1617727553252-65863c156eb0?w=800',
      parentId: photographyCategory.id,
    })
    await tripodsCategory.related('specTypes').attach([specTypeMap['MAX_LOAD'], specTypeMap['MATERIAL']])

    // Video Subcategories
    const videoCamerasCategory = await Category.create({
      name: 'Video Cameras',
      key: 'VIDEO_CAMERAS',
      description: 'Cinema cameras and camcorders',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      parentId: videoCategory.id,
    })
    await videoCamerasCategory
      .related('specTypes')
      .attach([
        specTypeMap['SENSOR_SIZE'],
        specTypeMap['VIDEO_RESOLUTION'],
        specTypeMap['ISO_RANGE'],
        specTypeMap['LENS_MOUNT'],
      ])

    const accessoriesCategory = await Category.create({
      name: 'Accessories',
      key: 'ACCESSORIES',
      description: 'Bags, straps, and camera accessories',
      image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800',
      parentId: photographyCategory.id,
    })

    // ========================================
    // 5. PRODUCTS
    // ========================================
    console.log('🎧 Creating products...')

    // HEADPHONES
    const sonyWH1000XM5 = await Product.create({
      name: 'Sony WH-1000XM5',
      category_id: headphonesCategory.id,
      brand_id: brandMap['Sony'],
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      ],
      description:
        'Industry-leading noise canceling with Auto NC Optimizer. Exceptional sound quality with newly developed 30mm driver unit. Crystal-clear hands-free calling with 4 beamforming microphones.',
      features: [
        { title: 'Audio Quality', items: ['30mm driver unit', 'LDAC support', 'DSEE Extreme upscaling'] },
        { title: 'Noise Cancellation', items: ['Auto NC Optimizer', '8 microphones for ANC', 'Ambient Sound mode'] },
        { title: 'Comfort', items: ['Ultra-lightweight design', 'Soft-fit leather', 'Foldable design'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sonyWH1000XM5.related('specs').attach([
      specMap['DRIVER_SIZE:40mm'],
      specMap['FREQUENCY_RESPONSE:20Hz - 20kHz'],
      specMap['IMPEDANCE:32 Ohms'],
      specMap['CONNECTIVITY:Bluetooth 5.3'],
      specMap['BATTERY_LIFE:30 hours'],
      specMap['NOISE_CANCELLATION:Adaptive ANC'],
    ])

    const sennheiserHD660S2 = await Product.create({
      name: 'Sennheiser HD 660S2',
      category_id: headphonesCategory.id,
      brand_id: brandMap['Sennheiser'],
      images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'],
      description:
        'Open-back audiophile headphones with exceptional clarity and natural sound reproduction. Perfect for critical listening and mixing.',
      features: [
        { title: 'Sound', items: ['Open-back design', 'Hand-selected transducers', 'Detailed sound stage'] },
        { title: 'Build', items: ['Made in Ireland', 'Replaceable ear pads', 'Premium materials'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sennheiserHD660S2.related('specs').attach([
      specMap['DRIVER_SIZE:50mm'],
      specMap['FREQUENCY_RESPONSE:10Hz - 40kHz'],
      specMap['IMPEDANCE:250 Ohms'],
      specMap['SENSITIVITY:102 dB'],
      specMap['CONNECTIVITY:Wired 3.5mm'],
      specMap['NOISE_CANCELLATION:Passive'],
    ])

    const beyerdynamicDT1990Pro = await Product.create({
      name: 'Beyerdynamic DT 1990 Pro',
      category_id: headphonesCategory.id,
      brand_id: brandMap['Beyerdynamic'],
      images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800'],
      description:
        'Reference-class studio headphones for mixing, mastering, and editing. Tesla technology for outstanding resolution.',
      features: [
        { title: 'Professional', items: ['Tesla drivers', 'Two ear pad options', 'Accurate frequency response'] },
        { title: 'Build Quality', items: ['Made in Germany', 'Replaceable parts', 'Robust construction'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await beyerdynamicDT1990Pro.related('specs').attach([
      specMap['DRIVER_SIZE:50mm'],
      specMap['FREQUENCY_RESPONSE:5Hz - 50kHz'],
      specMap['IMPEDANCE:250 Ohms'],
      specMap['SENSITIVITY:102 dB'],
      specMap['CONNECTIVITY:Wired 3.5mm'],
    ])

    // MICROPHONES
    const shureSM7B = await Product.create({
      name: 'Shure SM7B',
      category_id: microphonesCategory.id,
      brand_id: brandMap['Shure'],
      images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'],
      description:
        'Professional dynamic microphone for broadcast, podcast, and recording. Legendary vocal sound with built-in pop filter.',
      features: [
        { title: 'Sound', items: ['Flat, wide-range frequency response', 'Bass rolloff control', 'Mid-range emphasis'] },
        {
          title: 'Features',
          items: ['Internal air suspension', 'Electromagnetic shielding', 'Built-in pop filter'],
        },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await shureSM7B.related('specs').attach([
      specMap['MICROPHONE_TYPE:Dynamic'],
      specMap['POLAR_PATTERN:Cardioid'],
      specMap['FREQUENCY_RESPONSE:20Hz - 20kHz'],
      specMap['CONNECTIVITY:XLR'],
    ])

    const rodeNTUSB = await Product.create({
      name: 'Rode NT-USB+',
      category_id: microphonesCategory.id,
      brand_id: brandMap['Rode'],
      images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'],
      description:
        'Professional USB condenser microphone with studio-quality sound. Perfect for podcasting, streaming, and voice-over.',
      features: [
        { title: 'Audio', items: ['Studio-grade condenser capsule', 'Internal DSP', 'High-resolution ADC'] },
        { title: 'Features', items: ['Built-in pop filter', 'Headphone monitoring', 'Zero-latency playback'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await rodeNTUSB.related('specs').attach([
      specMap['MICROPHONE_TYPE:USB Condenser'],
      specMap['POLAR_PATTERN:Cardioid'],
      specMap['FREQUENCY_RESPONSE:20Hz - 20kHz'],
      specMap['CONNECTIVITY:USB-C'],
      specMap['SAMPLE_RATE:48 kHz'],
      specMap['BIT_DEPTH:24-bit'],
    ])

    const audioTechnicaAT2020 = await Product.create({
      name: 'Audio-Technica AT2020',
      category_id: microphonesCategory.id,
      brand_id: brandMap['Audio-Technica'],
      images: ['https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800'],
      description:
        'Side-address cardioid condenser microphone with exceptional detail and low noise. Ideal for project and home studios.',
      features: [
        { title: 'Performance', items: ['Low mass diaphragm', 'Wide dynamic range', 'Low self-noise'] },
        { title: 'Build', items: ['Rugged construction', 'Pivoting stand mount', 'Custom shock mount'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await audioTechnicaAT2020.related('specs').attach([
      specMap['MICROPHONE_TYPE:Condenser'],
      specMap['POLAR_PATTERN:Cardioid'],
      specMap['FREQUENCY_RESPONSE:20Hz - 20kHz'],
      specMap['CONNECTIVITY:XLR'],
    ])

    // AUDIO INTERFACES
    const focusriteScarlett2i2 = await Product.create({
      name: 'Focusrite Scarlett 2i2 4th Gen',
      category_id: audioInterfacesCategory.id,
      brand_id: brandMap['Focusrite'],
      images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'],
      description:
        'Professional USB audio interface with legendary Focusrite preamps. Auto Gain feature for perfect levels every time.',
      features: [
        { title: 'Preamps', items: ['Two Scarlett preamps', 'Air mode for brightness', 'Auto Gain'] },
        { title: 'Conversion', items: ['24-bit/192kHz', 'Ultra-low latency', 'USB-C connectivity'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await focusriteScarlett2i2.related('specs').attach([
      specMap['SAMPLE_RATE:192 kHz'],
      specMap['BIT_DEPTH:24-bit'],
      specMap['INPUT_CHANNELS:2 inputs'],
      specMap['CONNECTIVITY:USB-C'],
    ])

    const universalAudioApollo = await Product.create({
      name: 'Universal Audio Apollo Twin X',
      category_id: audioInterfacesCategory.id,
      brand_id: brandMap['Universal Audio'],
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      description:
        'Premium desktop audio interface with Unison preamps and UAD-2 processing. Record through classic analog emulations in real time.',
      features: [
        { title: 'Preamps', items: ['2 Unison preamps', 'Hi-Z instrument input', 'Console application'] },
        { title: 'Processing', items: ['UAD-2 QUAD Core', 'Real-time plugins', 'Near-zero latency'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await universalAudioApollo.related('specs').attach([
      specMap['SAMPLE_RATE:192 kHz'],
      specMap['BIT_DEPTH:24-bit'],
      specMap['INPUT_CHANNELS:2 inputs'],
      specMap['CONNECTIVITY:USB-C'],
    ])

    // SPEAKERS
    const yamahaHS8 = await Product.create({
      name: 'Yamaha HS8',
      category_id: speakersCategory.id,
      brand_id: brandMap['Yamaha'],
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'],
      description:
        'Powered studio monitor with 8-inch cone woofer. Delivers flat, accurate response for mixing and mastering.',
      features: [
        { title: 'Drivers', items: ['8" white polypropylene cone', '1" dome tweeter', 'Bi-amplified design'] },
        { title: 'Sound', items: ['75W LF + 45W HF', 'Flat response', 'Room control switches'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await yamahaHS8.related('specs').attach([
      specMap['FREQUENCY_RESPONSE:20Hz - 20kHz'],
      specMap['POWER_OUTPUT:100W'],
      specMap['CONNECTIVITY:XLR'],
    ])

    // CAMERAS
    const sonyA7IV = await Product.create({
      name: 'Sony Alpha 7 IV',
      category_id: camerasCategory.id,
      brand_id: brandMap['Sony'],
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800',
      ],
      description:
        'Full-frame mirrorless camera with 33MP sensor. Advanced Real-time Eye AF for humans, animals, and birds. 4K 60p video recording.',
      features: [
        { title: 'Image Quality', items: ['33MP full-frame sensor', 'BIONZ XR processor', '15-stop dynamic range'] },
        { title: 'Autofocus', items: ['759 phase-detection points', 'Real-time Eye AF', 'Bird eye tracking'] },
        { title: 'Video', items: ['4K 60p 10-bit', 'S-Cinetone profile', 'Active stabilization'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sonyA7IV.related('specs').attach([
      specMap['SENSOR_SIZE:Full Frame'],
      specMap['MEGAPIXELS:33 MP'],
      specMap['ISO_RANGE:100-51200'],
      specMap['VIDEO_RESOLUTION:4K 60fps'],
      specMap['AUTOFOCUS_POINTS:759 points'],
      specMap['SHUTTER_SPEED:1/8000 - 30s'],
      specMap['IMAGE_STABILIZATION:In-Body (IBIS)'],
      specMap['LENS_MOUNT:Sony E-Mount'],
    ])

    const canonR6II = await Product.create({
      name: 'Canon EOS R6 Mark II',
      category_id: camerasCategory.id,
      brand_id: brandMap['Canon'],
      images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'],
      description:
        'Full-frame mirrorless with 24.2MP sensor and advanced subject tracking. Up to 40fps electronic shutter and 6K RAW video.',
      features: [
        { title: 'Speed', items: ['40 fps electronic shutter', '12 fps mechanical', 'Pre-shooting RAW burst'] },
        { title: 'AF System', items: ['Deep learning subject detection', 'Vehicle tracking', 'Eye AF for animals'] },
        { title: 'Video', items: ['4K 60p oversampled', '6K RAW output', 'Canon Log 3'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await canonR6II.related('specs').attach([
      specMap['SENSOR_SIZE:Full Frame'],
      specMap['MEGAPIXELS:24.2 MP'],
      specMap['ISO_RANGE:100-102400'],
      specMap['VIDEO_RESOLUTION:4K 60fps'],
      specMap['IMAGE_STABILIZATION:In-Body (IBIS)'],
      specMap['LENS_MOUNT:Canon RF'],
    ])

    const fujifilmXT5 = await Product.create({
      name: 'Fujifilm X-T5',
      category_id: camerasCategory.id,
      brand_id: brandMap['Fujifilm'],
      images: ['https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800'],
      description:
        'APS-C mirrorless with 40.2MP X-Trans sensor. Classic analog dials and legendary Fujifilm color science.',
      features: [
        { title: 'Image Quality', items: ['40.2MP X-Trans 5 HR', '7-stop IBIS', 'Film simulation modes'] },
        { title: 'Design', items: ['Analog control dials', 'Compact body', 'Weather-sealed'] },
        { title: 'Video', items: ['6.2K 30p internal', 'F-Log2', '4K 60p'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await fujifilmXT5.related('specs').attach([
      specMap['SENSOR_SIZE:APS-C'],
      specMap['MEGAPIXELS:45 MP'],
      specMap['ISO_RANGE:100-51200'],
      specMap['VIDEO_RESOLUTION:6K'],
      specMap['IMAGE_STABILIZATION:In-Body (IBIS)'],
      specMap['LENS_MOUNT:Fujifilm X'],
    ])

    const nikonZ8 = await Product.create({
      name: 'Nikon Z8',
      category_id: camerasCategory.id,
      brand_id: brandMap['Nikon'],
      images: ['https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800'],
      description:
        'Full-frame flagship mirrorless with 45.7MP stacked sensor. 8K internal recording and 120fps RAW video.',
      features: [
        { title: 'Sensor', items: ['45.7MP stacked CMOS', 'EXPEED 7 processor', '14-bit RAW'] },
        { title: 'Speed', items: ['20 fps RAW', '120 fps 1080p', 'Blackout-free EVF'] },
        { title: 'Video', items: ['8K 60p internal', 'N-RAW & ProRes', '12-bit RAW output'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await nikonZ8.related('specs').attach([
      specMap['SENSOR_SIZE:Full Frame'],
      specMap['MEGAPIXELS:45 MP'],
      specMap['ISO_RANGE:50-204800'],
      specMap['VIDEO_RESOLUTION:8K'],
      specMap['AUTOFOCUS_POINTS:493 points'],
      specMap['SHUTTER_SPEED:1/16000 - 30s'],
      specMap['IMAGE_STABILIZATION:In-Body (IBIS)'],
      specMap['LENS_MOUNT:Nikon Z'],
    ])

    // LENSES
    const sony2470GM2 = await Product.create({
      name: 'Sony FE 24-70mm f/2.8 GM II',
      category_id: lensesCategory.id,
      brand_id: brandMap['Sony'],
      images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800'],
      description:
        'Professional standard zoom lens with constant f/2.8 aperture. Compact, lightweight design with outstanding resolution.',
      features: [
        { title: 'Optical', items: ['XA element', 'Nano AR Coating II', 'ED glass elements'] },
        { title: 'Build', items: ['695g weight', 'Dust/moisture resistant', 'Fluorine coating'] },
        { title: 'AF', items: ['4 XD Linear motors', 'Near-silent operation', 'Floating focus'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sony2470GM2.related('specs').attach([
      specMap['FOCAL_LENGTH:24-70mm'],
      specMap['APERTURE:f/2.8'],
      specMap['LENS_MOUNT:Sony E-Mount'],
      specMap['IMAGE_STABILIZATION:None'],
    ])

    const canon85f12 = await Product.create({
      name: 'Canon RF 85mm f/1.2L USM',
      category_id: lensesCategory.id,
      brand_id: brandMap['Canon'],
      images: ['https://images.unsplash.com/photo-1606986628407-d293b1920e62?w=800'],
      description:
        'Portrait prime lens with ultra-fast f/1.2 aperture. Exceptional bokeh and corner-to-corner sharpness.',
      features: [
        { title: 'Optical', items: ['BR optics', 'Air Sphere Coating', 'UD element'] },
        { title: 'Portrait', items: ['f/1.2 max aperture', 'Defocus Smoothing version available', 'Ring USM'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await canon85f12.related('specs').attach([
      specMap['FOCAL_LENGTH:85mm'],
      specMap['APERTURE:f/1.2'],
      specMap['LENS_MOUNT:Canon RF'],
      specMap['IMAGE_STABILIZATION:None'],
    ])

    const sigma35f14Art = await Product.create({
      name: 'Sigma 35mm f/1.4 DG DN Art',
      category_id: lensesCategory.id,
      brand_id: brandMap['Sigma'],
      images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800'],
      description:
        'Fast wide-angle prime designed for mirrorless. Outstanding sharpness and beautiful rendering.',
      features: [
        { title: 'Design', items: ['Native mirrorless design', 'Compact form factor', 'Metal construction'] },
        { title: 'Optical', items: ['SLD glass elements', 'Super Multi-Layer Coating', 'Minimal distortion'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sigma35f14Art.related('specs').attach([
      specMap['FOCAL_LENGTH:35mm'],
      specMap['APERTURE:f/1.4'],
      specMap['LENS_MOUNT:Sony E-Mount'],
      specMap['IMAGE_STABILIZATION:None'],
    ])

    const tamron70180 = await Product.create({
      name: 'Tamron 70-180mm f/2.8 Di III VXD G2',
      category_id: lensesCategory.id,
      brand_id: brandMap['Tamron'],
      images: ['https://images.unsplash.com/photo-1606986628407-d293b1920e62?w=800'],
      description:
        'Compact telephoto zoom with constant f/2.8 aperture. VXD linear motor for fast, quiet autofocus.',
      features: [
        { title: 'Versatility', items: ['70-180mm range', 'f/2.8 constant', '0.85m minimum focus'] },
        { title: 'Performance', items: ['VXD linear motor', 'BBAR-G2 coating', 'Weather-sealed'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await tamron70180.related('specs').attach([
      specMap['FOCAL_LENGTH:70-200mm'],
      specMap['APERTURE:f/2.8'],
      specMap['LENS_MOUNT:Sony E-Mount'],
      specMap['IMAGE_STABILIZATION:None'],
    ])

    // LIGHTING
    const godoxAD600Pro = await Product.create({
      name: 'Godox AD600 Pro',
      category_id: lightingCategory.id,
      brand_id: brandMap['Godox'],
      images: ['https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=800'],
      description:
        'Portable strobe with 600Ws power. TTL and HSS support for Canon, Nikon, Sony, and Fujifilm.',
      features: [
        { title: 'Power', items: ['600Ws', '0.01-1s recycle', '9-stop range'] },
        { title: 'Features', items: ['TTL/HSS', 'Built-in 2.4G', 'Bowens mount'] },
        { title: 'Battery', items: ['360 full power flashes', 'Li-ion battery', 'AC power option'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await godoxAD600Pro.related('specs').attach([
      specMap['FLASH_POWER:600Ws'],
      specMap['COLOR_TEMP:5600K (Daylight)'],
      specMap['CONNECTIVITY:Bluetooth 5.0'],
    ])

    const godoxSL60W = await Product.create({
      name: 'Godox SL-60W',
      category_id: lightingCategory.id,
      brand_id: brandMap['Godox'],
      images: ['https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800'],
      description:
        'Continuous LED video light with 60W output. Quiet fan cooling and wireless remote control.',
      features: [
        { title: 'Output', items: ['60W LED', '5600K daylight', '93+ CRI'] },
        { title: 'Control', items: ['0-100% dimming', 'Wireless remote', 'Bowens mount'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await godoxSL60W.related('specs').attach([
      specMap['FLASH_POWER:200Ws'],
      specMap['COLOR_TEMP:5600K (Daylight)'],
    ])

    // TRIPODS
    const manfrottoMT055 = await Product.create({
      name: 'Manfrotto MT055CXPRO4',
      category_id: tripodsCategory.id,
      brand_id: brandMap['Manfrotto'],
      images: ['https://images.unsplash.com/photo-1617727553252-65863c156eb0?w=800'],
      description:
        'Professional carbon fiber tripod with 4-section legs. 90° center column mechanism for versatile positioning.',
      features: [
        { title: 'Build', items: ['Carbon fiber', '4-section legs', 'Quick power locks'] },
        { title: 'Features', items: ['90° center column', 'Easy link connector', 'Bubble level'] },
        { title: 'Specs', items: ['9kg max load', '170cm max height', '2.1kg weight'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await manfrottoMT055.related('specs').attach([
      specMap['MAX_LOAD:8 kg'],
      specMap['MATERIAL:Carbon Fiber'],
    ])

    const peakDesignTravel = await Product.create({
      name: 'Peak Design Travel Tripod',
      category_id: tripodsCategory.id,
      brand_id: brandMap['Peak Design'],
      images: ['https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=800'],
      description:
        'Ultra-compact travel tripod with innovative folding design. Packs to the size of a water bottle.',
      features: [
        { title: 'Portability', items: ['39cm packed length', '1.27kg carbon', 'Quick deploy'] },
        { title: 'Function', items: ['9.1kg max load', '152cm max height', 'Inverted ball head'] },
        { title: 'Design', items: ['Machined aluminum', 'Hex wrench storage', 'Phone mount included'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await peakDesignTravel.related('specs').attach([
      specMap['MAX_LOAD:8 kg'],
      specMap['MATERIAL:Carbon Fiber'],
    ])

    // VIDEO CAMERAS
    const blackmagicPocket6K = await Product.create({
      name: 'Blackmagic Pocket Cinema Camera 6K Pro',
      category_id: videoCamerasCategory.id,
      brand_id: brandMap['Blackmagic Design'],
      images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'],
      description:
        'Professional cinema camera with Super 35 sensor and EF lens mount. Records 6K Blackmagic RAW.',
      features: [
        { title: 'Sensor', items: ['Super 35 sensor', '6144x3456', '13 stops dynamic range'] },
        { title: 'Recording', items: ['Blackmagic RAW', 'ProRes 422', 'USB-C SSD recording'] },
        { title: 'Pro Features', items: ['Built-in ND filters', 'XLR audio inputs', 'HDR touchscreen'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await blackmagicPocket6K.related('specs').attach([
      specMap['SENSOR_SIZE:APS-C'],
      specMap['VIDEO_RESOLUTION:6K'],
      specMap['ISO_RANGE:100-102400'],
      specMap['LENS_MOUNT:Canon EF'],
    ])

    const sonyFX3 = await Product.create({
      name: 'Sony FX3',
      category_id: videoCamerasCategory.id,
      brand_id: brandMap['Sony'],
      images: ['https://images.unsplash.com/photo-1589872307379-0ffdf9829123?w=800'],
      description:
        'Full-frame cinema line camera in compact body. Active stabilization and advanced heat dissipation for unlimited recording.',
      features: [
        { title: 'Video', items: ['4K 120p', 'S-Cinetone', '16-bit RAW output'] },
        { title: 'Audio', items: ['XLR handle unit', 'Digital audio interface', '4-channel recording'] },
        { title: 'Design', items: ['Active cooling', 'Tally lights', 'Multiple 1/4" threads'] },
      ],
      status: ProductStatus.PUBLISHED,
    })
    await sonyFX3.related('specs').attach([
      specMap['SENSOR_SIZE:Full Frame'],
      specMap['VIDEO_RESOLUTION:4K 120fps'],
      specMap['ISO_RANGE:50-204800'],
      specMap['LENS_MOUNT:Sony E-Mount'],
    ])

    // ========================================
    // 6. SHOPS (Retailer prices)
    // ========================================
    console.log('🏪 Creating shops...')

    // Sony WH-1000XM5 shops
    await Shop.createMany([
      { product_id: sonyWH1000XM5.id, name: 'Amazon', url: 'https://amazon.com/sony-wh1000xm5', price: 349.99, currency: 'USD', available: true },
      { product_id: sonyWH1000XM5.id, name: 'Best Buy', url: 'https://bestbuy.com/sony-wh1000xm5', price: 379.99, currency: 'USD', available: true },
      { product_id: sonyWH1000XM5.id, name: 'B&H Photo', url: 'https://bhphoto.com/sony-wh1000xm5', price: 348.00, currency: 'USD', available: true },
    ])

    // Sennheiser HD660S2 shops
    await Shop.createMany([
      { product_id: sennheiserHD660S2.id, name: 'Amazon', url: 'https://amazon.com/sennheiser-hd660s2', price: 499.95, currency: 'USD', available: true },
      { product_id: sennheiserHD660S2.id, name: 'Thomann', url: 'https://thomann.de/sennheiser-hd660s2', price: 449.00, currency: 'EUR', available: true },
    ])

    // Beyerdynamic DT1990 Pro
    await Shop.createMany([
      { product_id: beyerdynamicDT1990Pro.id, name: 'Amazon', url: 'https://amazon.com/beyerdynamic-dt1990', price: 549.00, currency: 'USD', available: true },
      { product_id: beyerdynamicDT1990Pro.id, name: 'Sweetwater', url: 'https://sweetwater.com/beyerdynamic-dt1990', price: 549.00, currency: 'USD', available: true },
    ])

    // Shure SM7B shops
    await Shop.createMany([
      { product_id: shureSM7B.id, name: 'Amazon', url: 'https://amazon.com/shure-sm7b', price: 399.00, currency: 'USD', available: true },
      { product_id: shureSM7B.id, name: 'Sweetwater', url: 'https://sweetwater.com/shure-sm7b', price: 399.00, currency: 'USD', available: true },
      { product_id: shureSM7B.id, name: 'Guitar Center', url: 'https://guitarcenter.com/shure-sm7b', price: 399.00, currency: 'USD', available: false },
    ])

    // Rode NT-USB+
    await Shop.createMany([
      { product_id: rodeNTUSB.id, name: 'Amazon', url: 'https://amazon.com/rode-nt-usb-plus', price: 169.00, currency: 'USD', available: true },
      { product_id: rodeNTUSB.id, name: 'B&H Photo', url: 'https://bhphoto.com/rode-nt-usb-plus', price: 169.00, currency: 'USD', available: true },
    ])

    // Audio-Technica AT2020
    await Shop.createMany([
      { product_id: audioTechnicaAT2020.id, name: 'Amazon', url: 'https://amazon.com/audio-technica-at2020', price: 99.00, currency: 'USD', available: true },
      { product_id: audioTechnicaAT2020.id, name: 'Sweetwater', url: 'https://sweetwater.com/audio-technica-at2020', price: 99.00, currency: 'USD', available: true },
    ])

    // Focusrite Scarlett 2i2
    await Shop.createMany([
      { product_id: focusriteScarlett2i2.id, name: 'Amazon', url: 'https://amazon.com/focusrite-scarlett-2i2', price: 189.99, currency: 'USD', available: true },
      { product_id: focusriteScarlett2i2.id, name: 'Sweetwater', url: 'https://sweetwater.com/focusrite-scarlett-2i2', price: 189.99, currency: 'USD', available: true },
      { product_id: focusriteScarlett2i2.id, name: 'Guitar Center', url: 'https://guitarcenter.com/focusrite-scarlett-2i2', price: 189.99, currency: 'USD', available: true },
    ])

    // Universal Audio Apollo Twin
    await Shop.createMany([
      { product_id: universalAudioApollo.id, name: 'Sweetwater', url: 'https://sweetwater.com/ua-apollo-twin', price: 1299.00, currency: 'USD', available: true },
      { product_id: universalAudioApollo.id, name: 'B&H Photo', url: 'https://bhphoto.com/ua-apollo-twin', price: 1299.00, currency: 'USD', available: true },
    ])

    // Yamaha HS8
    await Shop.createMany([
      { product_id: yamahaHS8.id, name: 'Amazon', url: 'https://amazon.com/yamaha-hs8', price: 349.99, currency: 'USD', available: true },
      { product_id: yamahaHS8.id, name: 'Sweetwater', url: 'https://sweetwater.com/yamaha-hs8', price: 349.99, currency: 'USD', available: true },
    ])

    // Sony A7 IV
    await Shop.createMany([
      { product_id: sonyA7IV.id, name: 'Amazon', url: 'https://amazon.com/sony-a7iv', price: 2498.00, currency: 'USD', available: true },
      { product_id: sonyA7IV.id, name: 'B&H Photo', url: 'https://bhphoto.com/sony-a7iv', price: 2498.00, currency: 'USD', available: true },
      { product_id: sonyA7IV.id, name: 'Adorama', url: 'https://adorama.com/sony-a7iv', price: 2498.00, currency: 'USD', available: true },
    ])

    // Canon R6 II
    await Shop.createMany([
      { product_id: canonR6II.id, name: 'Amazon', url: 'https://amazon.com/canon-r6-ii', price: 2499.00, currency: 'USD', available: true },
      { product_id: canonR6II.id, name: 'B&H Photo', url: 'https://bhphoto.com/canon-r6-ii', price: 2499.00, currency: 'USD', available: true },
    ])

    // Fujifilm X-T5
    await Shop.createMany([
      { product_id: fujifilmXT5.id, name: 'Amazon', url: 'https://amazon.com/fujifilm-xt5', price: 1699.00, currency: 'USD', available: true },
      { product_id: fujifilmXT5.id, name: 'B&H Photo', url: 'https://bhphoto.com/fujifilm-xt5', price: 1699.00, currency: 'USD', available: true },
    ])

    // Nikon Z8
    await Shop.createMany([
      { product_id: nikonZ8.id, name: 'Amazon', url: 'https://amazon.com/nikon-z8', price: 3996.95, currency: 'USD', available: true },
      { product_id: nikonZ8.id, name: 'B&H Photo', url: 'https://bhphoto.com/nikon-z8', price: 3996.95, currency: 'USD', available: true },
      { product_id: nikonZ8.id, name: 'Adorama', url: 'https://adorama.com/nikon-z8', price: 3996.95, currency: 'USD', available: false },
    ])

    // Sony 24-70mm GM II
    await Shop.createMany([
      { product_id: sony2470GM2.id, name: 'Amazon', url: 'https://amazon.com/sony-2470-gm2', price: 2298.00, currency: 'USD', available: true },
      { product_id: sony2470GM2.id, name: 'B&H Photo', url: 'https://bhphoto.com/sony-2470-gm2', price: 2298.00, currency: 'USD', available: true },
    ])

    // Canon RF 85mm f/1.2
    await Shop.createMany([
      { product_id: canon85f12.id, name: 'Amazon', url: 'https://amazon.com/canon-rf-85-12', price: 2699.00, currency: 'USD', available: true },
      { product_id: canon85f12.id, name: 'B&H Photo', url: 'https://bhphoto.com/canon-rf-85-12', price: 2699.00, currency: 'USD', available: true },
    ])

    // Sigma 35mm f/1.4 Art
    await Shop.createMany([
      { product_id: sigma35f14Art.id, name: 'Amazon', url: 'https://amazon.com/sigma-35-14-art', price: 899.00, currency: 'USD', available: true },
      { product_id: sigma35f14Art.id, name: 'B&H Photo', url: 'https://bhphoto.com/sigma-35-14-art', price: 899.00, currency: 'USD', available: true },
    ])

    // Tamron 70-180mm
    await Shop.createMany([
      { product_id: tamron70180.id, name: 'Amazon', url: 'https://amazon.com/tamron-70180', price: 1199.00, currency: 'USD', available: true },
      { product_id: tamron70180.id, name: 'B&H Photo', url: 'https://bhphoto.com/tamron-70180', price: 1199.00, currency: 'USD', available: true },
    ])

    // Godox AD600 Pro
    await Shop.createMany([
      { product_id: godoxAD600Pro.id, name: 'Amazon', url: 'https://amazon.com/godox-ad600-pro', price: 899.00, currency: 'USD', available: true },
      { product_id: godoxAD600Pro.id, name: 'B&H Photo', url: 'https://bhphoto.com/godox-ad600-pro', price: 899.00, currency: 'USD', available: true },
    ])

    // Godox SL-60W
    await Shop.createMany([
      { product_id: godoxSL60W.id, name: 'Amazon', url: 'https://amazon.com/godox-sl60w', price: 139.00, currency: 'USD', available: true },
    ])

    // Manfrotto MT055
    await Shop.createMany([
      { product_id: manfrottoMT055.id, name: 'Amazon', url: 'https://amazon.com/manfrotto-mt055', price: 439.88, currency: 'USD', available: true },
      { product_id: manfrottoMT055.id, name: 'B&H Photo', url: 'https://bhphoto.com/manfrotto-mt055', price: 439.88, currency: 'USD', available: true },
    ])

    // Peak Design Travel Tripod
    await Shop.createMany([
      { product_id: peakDesignTravel.id, name: 'Peak Design', url: 'https://peakdesign.com/travel-tripod', price: 599.95, currency: 'USD', available: true },
      { product_id: peakDesignTravel.id, name: 'Amazon', url: 'https://amazon.com/peak-design-tripod', price: 599.95, currency: 'USD', available: true },
    ])

    // Blackmagic Pocket 6K
    await Shop.createMany([
      { product_id: blackmagicPocket6K.id, name: 'Amazon', url: 'https://amazon.com/blackmagic-pocket-6k', price: 2495.00, currency: 'USD', available: true },
      { product_id: blackmagicPocket6K.id, name: 'B&H Photo', url: 'https://bhphoto.com/blackmagic-pocket-6k', price: 2495.00, currency: 'USD', available: true },
    ])

    // Sony FX3
    await Shop.createMany([
      { product_id: sonyFX3.id, name: 'Amazon', url: 'https://amazon.com/sony-fx3', price: 3898.00, currency: 'USD', available: true },
      { product_id: sonyFX3.id, name: 'B&H Photo', url: 'https://bhphoto.com/sony-fx3', price: 3898.00, currency: 'USD', available: true },
    ])

    // ========================================
    // 7. DEMO USERS
    // ========================================
    console.log('👥 Creating demo users...')

    const demoUser1 = await User.create({
      name: 'John Photographer',
      email: 'john@demo.marketplace.com',
      password: 'demo123456',
      role: Roles.USER,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    })

    const demoUser2 = await User.create({
      name: 'Sarah Audio Pro',
      email: 'sarah@demo.marketplace.com',
      password: 'demo123456',
      role: Roles.USER,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    })

    const demoUser3 = await User.create({
      name: 'Mike Studio',
      email: 'mike@demo.marketplace.com',
      password: 'demo123456',
      role: Roles.USER,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    })

    const adminUser = await User.create({
      name: 'Admin Demo',
      email: 'admin@demo.marketplace.com',
      password: 'admin123456',
      role: Roles.ADMIN,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    })

    // ========================================
    // 8. DEMO DEALS
    // ========================================
    console.log('💰 Creating demo deals...')

    // Deal 1: Sony A7 IV Kit
    const deal1 = await Deal.create({
      user_id: demoUser1.id,
      title: 'Sony A7 IV with 24-70mm GM II - Mint Condition',
      description:
        'Selling my Sony A7 IV with the 24-70mm f/2.8 GM II lens. Both in mint condition, purchased 8 months ago. Shutter count under 5000. Includes original boxes, all accessories, and extra battery. Perfect for professional work or serious enthusiasts.',
      price: 4200,
      currency: 'USD',
      location: 'New York, NY',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.LIKE_NEW,
      invoiceAvailable: true,
      canBeDelivered: true,
      sellingReason: 'Upgrading to Sony A1 for wildlife photography',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800',
      ],
      features: [
        { label: 'Shutter Count', value: '<5000' },
        { label: 'Purchased', value: '8 months ago' },
        { label: 'Extras', value: '2 batteries, SD cards' },
      ],
    })
    await DealProduct.createMany([
      { deal_id: deal1.id, product_id: sonyA7IV.id, quantity: 1 },
      { deal_id: deal1.id, product_id: sony2470GM2.id, quantity: 1 },
    ])

    // Deal 2: Audio Recording Setup
    const deal2 = await Deal.create({
      user_id: demoUser2.id,
      title: 'Complete Podcast Setup - Shure SM7B + Focusrite',
      description:
        'Professional podcast recording setup. Includes Shure SM7B microphone with Focusrite Scarlett 2i2 interface. Also includes boom arm, pop filter, and XLR cables. Used for about 50 podcast episodes, always stored properly.',
      price: 550,
      currency: 'USD',
      location: 'Los Angeles, CA',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: true,
      canBeDelivered: true,
      sellingReason: 'Moving to a Rode setup',
      images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'],
      features: [
        { label: 'Usage', value: '~50 episodes recorded' },
        { label: 'Includes', value: 'Boom arm, pop filter, cables' },
      ],
    })
    await DealProduct.createMany([
      { deal_id: deal2.id, product_id: shureSM7B.id, quantity: 1 },
      { deal_id: deal2.id, product_id: focusriteScarlett2i2.id, quantity: 1 },
    ])

    // Deal 3: Studio Headphones
    const deal3 = await Deal.create({
      user_id: demoUser3.id,
      title: 'Beyerdynamic DT 1990 Pro - Like New',
      description:
        'Selling my DT 1990 Pro headphones. Purchased for mixing but prefer my HD650s. Includes both ear pad sets (analytical and balanced), original case and cables. Excellent condition.',
      price: 420,
      currency: 'USD',
      location: 'Austin, TX',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.LIKE_NEW,
      invoiceAvailable: false,
      canBeDelivered: true,
      sellingReason: 'Prefer different sound signature for mixing',
      images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800'],
      features: [
        { label: 'Includes', value: 'Both ear pad sets' },
        { label: 'Condition', value: 'Minimal use, no marks' },
      ],
    })
    await DealProduct.createMany([{ deal_id: deal3.id, product_id: beyerdynamicDT1990Pro.id, quantity: 1 }])

    // Deal 4: Canon Kit
    const deal4 = await Deal.create({
      user_id: demoUser1.id,
      title: 'Canon EOS R6 II + RF 85mm f/1.2L - Wedding Kit',
      description:
        'My wedding photography backup kit. Canon R6 Mark II body with the stunning RF 85mm f/1.2L USM. Both in excellent condition with low usage. The 85mm produces incredible portraits with dreamy bokeh.',
      price: 4800,
      currency: 'USD',
      location: 'Miami, FL',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: true,
      canBeDelivered: false,
      sellingReason: 'Consolidating to one camera system',
      images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'],
      features: [
        { label: 'Shutter Count', value: '~12,000' },
        { label: 'Usage', value: 'Backup for weddings' },
      ],
    })
    await DealProduct.createMany([
      { deal_id: deal4.id, product_id: canonR6II.id, quantity: 1 },
      { deal_id: deal4.id, product_id: canon85f12.id, quantity: 1 },
    ])

    // Deal 5: Studio Monitors
    const deal5 = await Deal.create({
      user_id: demoUser2.id,
      title: 'Yamaha HS8 Pair - Studio Monitors',
      description:
        'Pair of Yamaha HS8 studio monitors. Great flat response for mixing. Some minor cosmetic wear but work perfectly. Selling because I upgraded to larger monitors for my new studio space.',
      price: 480,
      currency: 'USD',
      location: 'Chicago, IL',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: false,
      canBeDelivered: false,
      sellingReason: 'Upgraded to larger monitors',
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'],
      features: [
        { label: 'Quantity', value: 'Pair (2 monitors)' },
        { label: 'Age', value: '3 years' },
      ],
    })
    await DealProduct.createMany([{ deal_id: deal5.id, product_id: yamahaHS8.id, quantity: 2 }])

    // Deal 6: Fujifilm Kit
    const deal6 = await Deal.create({
      user_id: demoUser3.id,
      title: 'Fujifilm X-T5 + Sigma 35mm f/1.4 - Street Setup',
      description:
        'Perfect street photography combo. The X-T5 retro design with amazing film simulations paired with the sharp Sigma 35mm Art lens. Light, compact, and produces stunning images. Selling to switch to medium format.',
      price: 2350,
      currency: 'USD',
      location: 'Seattle, WA',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.LIKE_NEW,
      invoiceAvailable: true,
      canBeDelivered: true,
      sellingReason: 'Switching to medium format',
      images: ['https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800'],
      features: [
        { label: 'Shutter Count', value: '<8000' },
        { label: 'Includes', value: 'Peak Design strap, extra battery' },
      ],
    })
    await DealProduct.createMany([
      { deal_id: deal6.id, product_id: fujifilmXT5.id, quantity: 1 },
      { deal_id: deal6.id, product_id: sigma35f14Art.id, quantity: 1 },
    ])

    // Deal 7: Lighting Kit
    const deal7 = await Deal.create({
      user_id: demoUser1.id,
      title: 'Godox AD600 Pro + SL-60W - Complete Lighting',
      description:
        'Professional lighting setup. Godox AD600 Pro strobe for powerful output and SL-60W LED for video. Both in excellent working condition. Includes batteries, chargers, and softboxes.',
      price: 850,
      currency: 'USD',
      location: 'Denver, CO',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: false,
      canBeDelivered: true,
      sellingReason: 'Moving to Profoto system',
      images: ['https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=800'],
      features: [
        { label: 'Flash Count', value: 'Under 10,000' },
        { label: 'Includes', value: '2 softboxes, grid, stands' },
      ],
    })
    await DealProduct.createMany([
      { deal_id: deal7.id, product_id: godoxAD600Pro.id, quantity: 1 },
      { deal_id: deal7.id, product_id: godoxSL60W.id, quantity: 1 },
    ])

    // Deal 8: Video Camera
    const deal8 = await Deal.create({
      user_id: demoUser2.id,
      title: 'Blackmagic Pocket 6K Pro - Cinema Camera',
      description:
        'Blackmagic Pocket Cinema Camera 6K Pro with cage, SSD mount, and 1TB Samsung T5. Incredible image quality for indie filmmaking. Well maintained, always used with proper accessories.',
      price: 2100,
      currency: 'USD',
      location: 'Portland, OR',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: true,
      canBeDelivered: true,
      sellingReason: 'Got a RED Komodo',
      images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'],
      features: [
        { label: 'Extras', value: 'Cage, SSD mount, Samsung T5' },
        { label: 'Usage', value: '2 short films, multiple music videos' },
      ],
    })
    await DealProduct.createMany([{ deal_id: deal8.id, product_id: blackmagicPocket6K.id, quantity: 1 }])

    // Deal 9: Premium Tripod
    const deal9 = await Deal.create({
      user_id: demoUser3.id,
      title: 'Peak Design Travel Tripod Carbon',
      description:
        'The most packable full-size tripod. Carbon fiber version, incredibly light and compact. Perfect for travel photography. Minor scuffs from use but fully functional.',
      price: 450,
      currency: 'USD',
      location: 'San Francisco, CA',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.GOOD,
      invoiceAvailable: false,
      canBeDelivered: true,
      sellingReason: 'Need a heavier tripod for video work',
      images: ['https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=800'],
      features: [
        { label: 'Material', value: 'Carbon Fiber' },
        { label: 'Weight', value: '1.27kg' },
      ],
    })
    await DealProduct.createMany([{ deal_id: deal9.id, product_id: peakDesignTravel.id, quantity: 1 }])

    // Deal 10: Sony Wireless Headphones
    const deal10 = await Deal.create({
      user_id: demoUser2.id,
      title: 'Sony WH-1000XM5 - Best ANC Headphones',
      description:
        'Industry-leading noise cancellation headphones. Black color, excellent condition. Only used for about 6 months during commuting. Includes all original accessories and case.',
      price: 280,
      currency: 'USD',
      location: 'Boston, MA',
      status: DealStatus.PUBLISHED,
      condition: DealCondition.LIKE_NEW,
      invoiceAvailable: true,
      canBeDelivered: true,
      sellingReason: 'Got AirPods Max as a gift',
      images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'],
      features: [
        { label: 'Color', value: 'Black' },
        { label: 'Usage', value: '6 months commuting' },
      ],
    })
    await DealProduct.createMany([{ deal_id: deal10.id, product_id: sonyWH1000XM5.id, quantity: 1 }])

    console.log('✅ Demo seeder completed successfully!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   - ${brands.length} brands created`)
    console.log(`   - ${specTypes.length} spec types created`)
    console.log(`   - ${specs.length} specs created`)
    console.log('   - 3 root categories + 10 subcategories created')
    console.log('   - 24 products created with shops')
    console.log('   - 4 users created (including 1 admin)')
    console.log('   - 10 deals created')
    console.log('')
    console.log('🔐 Demo Accounts:')
    console.log('   User: john@demo.marketplace.com / demo123456')
    console.log('   User: sarah@demo.marketplace.com / demo123456')
    console.log('   User: mike@demo.marketplace.com / demo123456')
    console.log('   Admin: admin@demo.marketplace.com / admin123456')
  }
}

import { test } from '@japa/runner'
import { ProductService } from '#services/product_service'
import Product from '#models/product'
import Category from '#models/category'
import Brand from '#models/brand'
import Spec from '#models/spec'
import SpecType from '#models/spec_type'
import Shop from '#models/shop'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('ProductService', (group) => {
  let productService: ProductService

  group.setup(async () => {
    productService = new ProductService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create a new product', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const productData = {
      name: 'Test Product',
      images: ['image1.jpg', 'image2.jpg'],
      status: 'ACTIVE',
      category_id: category.id,
      description: 'Test product description',
      features: [
        { title: 'Specifications', items: ['Item 1', 'Item 2'] }
      ],
      brand_id: brand.id
    }

    const product = await productService.create(productData)

    assert.equal(product.name, productData.name)
    assert.deepEqual(product.images, productData.images)
    assert.equal(product.status, productData.status)
    assert.equal(product.category_id, productData.category_id)
    assert.equal(product.description, productData.description)
    assert.deepEqual(product.features, productData.features)
    assert.equal(product.brand_id, productData.brand_id)
    assert.isTrue(product.id > 0)
  })

  test('should create product with minimal data', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const productData = {
      name: 'Minimal Product',
      images: [],
      status: 'DRAFT',
      category_id: category.id,
      brand_id: brand.id
    }

    const product = await productService.create(productData)

    assert.equal(product.name, productData.name)
    assert.deepEqual(product.images, productData.images)
    assert.equal(product.status, productData.status)
    assert.equal(product.category_id, productData.category_id)
    assert.equal(product.brand_id, productData.brand_id)
    assert.isTrue(product.id > 0)
  })

  test('should get product by id', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Test Product', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const retrievedProduct = await productService.one(product.id)

    assert.equal(retrievedProduct.id, product.id)
    assert.equal(retrievedProduct.name, product.name)
    assert.equal(retrievedProduct.category_id, product.category_id)
    assert.equal(retrievedProduct.brand_id, product.brand_id)
  })

  test('should throw error when getting non-existent product', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => productService.one(nonExistentId),
      'Row not found'
    )
  })

  test('should update product', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Original Product', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const updateData = {
      name: 'Updated Product',
      images: ['new-image.jpg'],
      status: 'ACTIVE'
    }

    const updatedProduct = await productService.update(product.id, updateData)

    assert.equal(updatedProduct.id, product.id)
    assert.equal(updatedProduct.name, updateData.name)
    assert.deepEqual(updatedProduct.images, updateData.images)
    assert.equal(updatedProduct.status, updateData.status)
  })

  test('should throw error when updating non-existent product', async ({ assert }) => {
    const nonExistentId = 99999
    const updateData = {
      name: 'Updated Product'
    }

    await assert.rejects(
      () => productService.update(nonExistentId, updateData),
      'Row not found'
    )
  })

  test('should get products by category', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category1 = await TestUtils.createCategory({ name: 'Electronics' })
    const category2 = await TestUtils.createCategory({ name: 'Books' })
    
    const product1 = await TestUtils.createProduct({ 
      name: 'Laptop', 
      brandId: brand.id, 
      categoryId: category1.id 
    })
    const product2 = await TestUtils.createProduct({ 
      name: 'Novel', 
      brandId: brand.id, 
      categoryId: category2.id 
    })

    const products = await productService.byCategory({ category: category1.id })

    assert.isArray(products.rows)
    assert.isTrue(products.rows.length >= 1)
    
    const foundProduct = products.rows.find(p => p.id === product1.id)
    assert.isNotNull(foundProduct)
    assert.equal(foundProduct?.category_id, category1.id)
  })

  test('should get products by status', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const product1 = await TestUtils.createProduct({ 
      name: 'Active Product', 
      brandId: brand.id, 
      categoryId: category.id 
    })
    const product2 = await TestUtils.createProduct({ 
      name: 'Draft Product', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    // Update product status
    await productService.update(product1.id, { status: 'ACTIVE' })
    await productService.update(product2.id, { status: 'DRAFT' })

    const activeProducts = await productService.byCategory({ status: 'ACTIVE' })

    assert.isArray(activeProducts.rows)
    assert.isTrue(activeProducts.rows.length >= 1)
    
    const foundProduct = activeProducts.rows.find(p => p.id === product1.id)
    assert.isNotNull(foundProduct)
    assert.equal(foundProduct?.status, 'ACTIVE')
  })

  test('should search products by name', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const product1 = await TestUtils.createProduct({ 
      name: 'Laptop Computer', 
      brandId: brand.id, 
      categoryId: category.id 
    })
    const product2 = await TestUtils.createProduct({ 
      name: 'Desktop Computer', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const searchResults = await productService.search({ name: 'Computer' })

    assert.isArray(searchResults.rows)
    assert.isTrue(searchResults.rows.length >= 2)
    
    const productNames = searchResults.rows.map(p => p.name)
    assert.include(productNames, 'Laptop Computer')
    assert.include(productNames, 'Desktop Computer')
  })

  test('should search products by category', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category1 = await TestUtils.createCategory({ name: `Electronics ${Date.now()}` })
    const category2 = await TestUtils.createCategory({ name: `Books ${Date.now()}` })
    
    const product1 = await TestUtils.createProduct({ 
      name: 'Laptop', 
      brandId: brand.id, 
      categoryId: category1.id 
    })
    const product2 = await TestUtils.createProduct({ 
      name: 'Novel', 
      brandId: brand.id, 
      categoryId: category2.id 
    })

    const searchResults = await productService.search({ category: category1.id })

    assert.isArray(searchResults.rows)
    assert.isTrue(searchResults.rows.length >= 1)
    
    const foundProduct = searchResults.rows.find(p => p.id === product1.id)
    assert.isNotNull(foundProduct)
    assert.equal(foundProduct?.category_id, category1.id)
  })

  test('should get recent products', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    // Create multiple products
    await TestUtils.createProduct({ 
      name: 'Product 1', 
      brandId: brand.id, 
      categoryId: category.id 
    })
    await TestUtils.createProduct({ 
      name: 'Product 2', 
      brandId: brand.id, 
      categoryId: category.id 
    })
    await TestUtils.createProduct({ 
      name: 'Product 3', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const recentProducts = await productService.recent()

    assert.isArray(recentProducts)
    assert.isTrue(recentProducts.length >= 3)
    
    // Should be ordered by created_at desc
    for (let i = 0; i < recentProducts.length - 1; i++) {
      assert.isTrue(
        recentProducts[i].createdAt >= recentProducts[i + 1].createdAt
      )
    }
  })

  test('should attach specs to product', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Product with Specs', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    // Create spec type first
    const specType = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color'
    })

    // Create specs
    const spec1 = await Spec.create({
      specTypeId: specType.id,
      value: 'Red'
    })
    const spec2 = await Spec.create({
      specTypeId: specType.id,
      value: 'Large'
    })

    await productService.attachSpecs(product, [spec1, spec2])

    // Reload product with specs
    const productWithSpecs = await Product.query()
      .where('id', product.id)
      .preload('specs')
      .firstOrFail()

    assert.isArray(productWithSpecs.specs)
    assert.lengthOf(productWithSpecs.specs, 2)
    
    const specIds = productWithSpecs.specs.map(s => s.id)
    assert.include(specIds, spec1.id)
    assert.include(specIds, spec2.id)
  })

  test('should handle duplicate specs when attaching', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Product with Duplicate Specs', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    // Create spec type first
    const specType = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color'
    })

    // Create spec
    const spec = await Spec.create({
      specTypeId: specType.id,
      value: 'Red'
    })

    // Try to attach the same spec twice
    await productService.attachSpecs(product, [spec, spec])

    // Reload product with specs
    const productWithSpecs = await Product.query()
      .where('id', product.id)
      .preload('specs')
      .firstOrFail()

    assert.isArray(productWithSpecs.specs)
    assert.lengthOf(productWithSpecs.specs, 1) // Should not have duplicates
    assert.equal(productWithSpecs.specs[0].id, spec.id)
  })

  test('should sync specs to product', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Product with Synced Specs', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    // Create spec type first
    const specType = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color'
    })

    // Create specs
    const spec1 = await Spec.create({
      specTypeId: specType.id,
      value: 'Red'
    })
    const spec2 = await Spec.create({
      specTypeId: specType.id,
      value: 'Large'
    })
    const spec3 = await Spec.create({
      specTypeId: specType.id,
      value: 'Cotton'
    })

    // First attach specs 1 and 2
    await productService.attachSpecs(product, [spec1, spec2])

    // Then sync with specs 2 and 3 (should replace all existing specs)
    await productService.syncSpecs(product, [spec2.id, spec3.id])

    // Reload product with specs
    const productWithSpecs = await Product.query()
      .where('id', product.id)
      .preload('specs')
      .firstOrFail()

    assert.isArray(productWithSpecs.specs)
    assert.lengthOf(productWithSpecs.specs, 2)
    
    const specIds = productWithSpecs.specs.map(s => s.id)
    assert.include(specIds, spec2.id)
    assert.include(specIds, spec3.id)
    assert.notInclude(specIds, spec1.id) // Should be removed
  })

  test('should create shop for product', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ 
      name: 'Product with Shop', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const shopData = {
      product_id: product.id,
      url: 'https://example.com/product',
      name: 'Example Shop',
      price: 99.99,
      currency: 'EUR',
      available: true
    }

    const shop = await productService.createShop(shopData)

    assert.equal(shop.productId, product.id)
    assert.equal(shop.url, shopData.url)
    assert.equal(shop.name, shopData.name)
    assert.equal(shop.price, shopData.price)
    assert.equal(shop.currency, shopData.currency)
    assert.equal(shop.available, shopData.available)
    assert.isTrue(shop.id > 0)
  })

  test('should get product by shop URL', async ({ assert }) => {
    const brand = await TestUtils.createBrand({ name: `Brand ${Date.now()}` })
    const category = await TestUtils.createCategory({ name: `Category ${Date.now()}` })
    const product = await TestUtils.createProduct({ 
      name: `Product with Shop ${Date.now()}`, 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const shopUrl = `https://example.com/product-${Date.now()}`
    await productService.createShop({
      product_id: product.id,
      url: shopUrl,
      name: 'Example Shop',
      price: 99.99,
      currency: 'EUR',
      available: true
    })

    const foundProduct = await productService.getByShop(shopUrl)

    assert.isNotNull(foundProduct)
    assert.equal(foundProduct?.id, product.id)
    assert.equal(foundProduct?.name, product.name)
  })

  test('should return null for non-existent shop URL', async ({ assert }) => {
    const nonExistentUrl = 'https://example.com/non-existent'

    const product = await productService.getByShop(nonExistentUrl)

    assert.isNull(product)
  })

  test('should handle case-insensitive search', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const product = await TestUtils.createProduct({ 
      name: 'LAPTOP COMPUTER', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const searchResults = await productService.search({ name: 'laptop' })

    assert.isArray(searchResults.rows)
    assert.isTrue(searchResults.rows.length >= 1)
    
    const foundProduct = searchResults.rows.find(p => p.id === product.id)
    assert.isNotNull(foundProduct)
  })

  test('should handle special characters in product name', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const specialName = 'Product & Co. (Ltd.) - "Premium" €500'
    const product = await TestUtils.createProduct({ 
      name: specialName, 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const retrievedProduct = await productService.one(product.id)

    assert.equal(retrievedProduct.name, specialName)
  })

  test('should handle very long product name', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const longName = 'A'.repeat(255)
    const product = await TestUtils.createProduct({ 
      name: longName, 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const retrievedProduct = await productService.one(product.id)

    assert.equal(retrievedProduct.name, longName)
  })

  test('should handle empty search results', async ({ assert }) => {
    const searchResults = await productService.search({ name: 'NonExistentProduct' })

    assert.isArray(searchResults.rows)
    assert.lengthOf(searchResults.rows, 0)
  })

  test('should handle products with complex features', async ({ assert }) => {
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const complexFeatures = [
      { title: 'Technical Specifications', items: ['CPU: Intel i7', 'RAM: 16GB', 'Storage: 512GB SSD'] },
      { title: 'Dimensions', items: ['Width: 30cm', 'Height: 20cm', 'Depth: 5cm'] },
      { title: 'Warranty', items: ['2 years manufacturer warranty', 'Extended warranty available'] }
    ]

    const productData = {
      name: 'Complex Product',
      images: ['image1.jpg', 'image2.jpg'],
      status: 'ACTIVE',
      category_id: category.id,
      description: 'Product with complex features',
      features: complexFeatures,
      brand_id: brand.id
    }

    const product = await productService.create(productData)

    assert.deepEqual(product.features, complexFeatures)
    assert.lengthOf(product.features, 3)
    assert.equal(product.features[0].title, 'Technical Specifications')
    assert.lengthOf(product.features[0].items, 3)
  })

  test('should maintain data integrity when updating product', async ({ assert }) => {
    const brand = await TestUtils.createBrand({ name: `Brand ${Date.now()}` })
    const category = await TestUtils.createCategory({ name: `Category ${Date.now()}` })
    const product = await TestUtils.createProduct({ 
      name: 'Original Product', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const originalId = product.id
    const originalCategoryId = product.category_id
    const originalBrandId = product.brand_id

    const updateData = {
      name: 'Updated Product',
      images: ['new-image.jpg'],
      status: 'ACTIVE'
    }

    const updatedProduct = await productService.update(product.id, updateData)

    assert.equal(updatedProduct.id, originalId)
    assert.equal(updatedProduct.category_id, originalCategoryId)
    assert.equal(updatedProduct.brand_id, originalBrandId)
    assert.equal(updatedProduct.name, updateData.name)
    assert.deepEqual(updatedProduct.images, updateData.images)
    assert.equal(updatedProduct.status, updateData.status)
  })
})
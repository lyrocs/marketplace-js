import { test } from '@japa/runner'
import { DealService } from '#services/deal_service'
import Deal from '#models/deal'
import Product from '#models/product'
import DealProduct from '#models/deal_product'
import User from '#models/user'
import Brand from '#models/brand'
import Category from '#models/category'
import DealStatus from '#enums/deal_status'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('DealService', (group) => {
  let dealService: DealService

  group.setup(async () => {
    dealService = new DealService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create a new deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const dealData = { user_id: user.id }

    const deal = await dealService.create(dealData)

    assert.equal(deal.user_id, user.id)
    assert.equal(deal.status, DealStatus.DRAFT)
    assert.isTrue(deal.id > 0)
  })

  test('should return existing empty deal for user', async ({ assert }) => {
    const user = await TestUtils.createUser()
    
    // Create first deal
    const firstDeal = await dealService.create({ user_id: user.id })
    
    // Try to create another deal for same user
    const secondDeal = await dealService.create({ user_id: user.id })

    // Should return the same deal
    assert.equal(firstDeal.id, secondDeal.id)
    assert.equal(firstDeal.user_id, user.id)
  })

  test('should get all deals', async ({ assert }) => {
    // Create test deals
    const user1 = await TestUtils.createUser()
    const user2 = await TestUtils.createUser()
    
    await dealService.create({ user_id: user1.id })
    await dealService.create({ user_id: user2.id })

    const deals = await dealService.all()

    assert.isArray(deals)
    assert.isTrue(deals.length >= 2)
  })

  test('should get deal by id', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })

    const retrievedDeal = await dealService.one(deal.id)

    assert.equal(retrievedDeal.id, deal.id)
    assert.equal(retrievedDeal.user_id, user.id)
  })

  test('should throw error when getting non-existent deal', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => dealService.one(nonExistentId),
      'Row not found'
    )
  })

  test('should get deals by user', async ({ assert }) => {
    const user1 = await TestUtils.createUser()
    const user2 = await TestUtils.createUser()
    
    await dealService.create({ user_id: user1.id })
    await dealService.create({ user_id: user2.id })

    const userDeals = await dealService.byUser(user1.id)

    assert.isArray(userDeals)
    assert.lengthOf(userDeals, 1)
    userDeals.forEach(deal => {
      assert.equal(deal.user_id, user1.id)
    })
  })

  test('should update deal status', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })

    const updatedDeal = await dealService.updateStatus(deal.id, DealStatus.PUBLISHED)

    assert.equal(updatedDeal.id, deal.id)
    assert.equal(updatedDeal.status, DealStatus.PUBLISHED)
  })

  test('should update deal status with reason', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })
    const reason = 'Product not available'

    const updatedDeal = await dealService.updateStatus(deal.id, DealStatus.DECLINED, reason)

    assert.equal(updatedDeal.id, deal.id)
    assert.equal(updatedDeal.status, DealStatus.DECLINED)
    assert.equal(updatedDeal.reasonDeclined, reason)
  })

  test('should throw error when updating status of non-existent deal', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => dealService.updateStatus(nonExistentId, DealStatus.PUBLISHED),
      'Row not found'
    )
  })

  test('should get paginated deals by status', async ({ assert }) => {
    const user = await TestUtils.createUser()
    
    // Create deals with different statuses
    const deal1 = await dealService.create({ user_id: user.id })
    const deal2 = await dealService.create({ user_id: user.id })
    
    await dealService.updateStatus(deal1.id, DealStatus.PUBLISHED)
    await dealService.updateStatus(deal2.id, DealStatus.DRAFT)

    const publishedDeals = await dealService.getPaginated({
      status: DealStatus.PUBLISHED,
      page: 1,
      limit: 10
    })

    assert.isArray(publishedDeals.rows)
    assert.equal(publishedDeals.rows.length, 1)
    assert.equal(publishedDeals.rows[0].status, DealStatus.PUBLISHED)
  })

  test('should update deal with complete data', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ brandId: brand.id, categoryId: category.id })
    
    const deal = await dealService.create({ user_id: user.id })

    const updateData = {
      title: 'Updated Deal Title',
      description: 'Updated deal description',
      location: 'Paris, France',
      currency: 'EUR',
      price: 500,
      invoiceAvailable: true,
      sellingReason: 'Upgrading to newer model',
      canBeDelivered: true,
      features: [
        { label: 'Condition', value: 'NEW' },
        { label: 'Warranty', value: '2 years' }
      ],
      condition: 'NEW',
      products: [{ productId: product.id, quantity: 1 }]
    }

    const updatedDeal = await dealService.update(deal.id, updateData)

    assert.equal(updatedDeal.id, deal.id)
    assert.equal(updatedDeal.title, updateData.title)
    assert.equal(updatedDeal.description, updateData.description)
    assert.equal(updatedDeal.location, updateData.location)
    assert.equal(updatedDeal.currency, updateData.currency)
    assert.equal(updatedDeal.price, updateData.price)
    assert.equal(updatedDeal.invoiceAvailable, updateData.invoiceAvailable)
    assert.equal(updatedDeal.sellingReason, updateData.sellingReason)
    assert.equal(updatedDeal.canBeDelivered, updateData.canBeDelivered)
    assert.deepEqual(updatedDeal.features, updateData.features)
    assert.equal(updatedDeal.condition, updateData.condition)
  })

  test('should throw error when updating non-existent deal', async ({ assert }) => {
    const nonExistentId = 99999
    const updateData = {
      title: 'Test Title',
      description: 'Test description',
      location: 'Test location',
      currency: 'EUR',
      price: 100,
      products: []
    }

    await assert.rejects(
      () => dealService.update(nonExistentId, updateData),
      'Row not found'
    )
  })

  test('should add product to deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    const product = await TestUtils.createProduct({ brandId: brand.id, categoryId: category.id })
    const deal = await dealService.create({ user_id: user.id })

    await dealService.addProduct({
      product_id: product.id,
      deal_id: deal.id
    })

    const dealProduct = await DealProduct.query()
      .where('deal_id', deal.id)
      .where('product_id', product.id)
      .first()

    assert.isNotNull(dealProduct)
    assert.equal(dealProduct.deal_id, deal.id)
    assert.equal(dealProduct.product_id, product.id)
  })

  test('should add image to deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })
    const imageUrl = 'https://example.com/image1.jpg'

    await dealService.addImage(deal.id, imageUrl)

    const updatedDeal = await Deal.find(deal.id)
    assert.isArray(updatedDeal?.images)
    assert.include(updatedDeal?.images, imageUrl)
  })

  test('should add multiple images to deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })
    const imageUrl1 = 'https://example.com/image1.jpg'
    const imageUrl2 = 'https://example.com/image2.jpg'

    await dealService.addImage(deal.id, imageUrl1)
    await dealService.addImage(deal.id, imageUrl2)

    const updatedDeal = await Deal.find(deal.id)
    assert.isArray(updatedDeal?.images)
    assert.lengthOf(updatedDeal?.images, 2)
    assert.include(updatedDeal?.images, imageUrl1)
    assert.include(updatedDeal?.images, imageUrl2)
  })

  test('should delete image from deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })
    const imageUrl1 = 'https://example.com/image1.jpg'
    const imageUrl2 = 'https://example.com/image2.jpg'

    await dealService.addImage(deal.id, imageUrl1)
    await dealService.addImage(deal.id, imageUrl2)
    await dealService.deleteImage(deal.id, imageUrl1)

    const updatedDeal = await Deal.find(deal.id)
    assert.isArray(updatedDeal?.images)
    assert.lengthOf(updatedDeal?.images, 1)
    assert.include(updatedDeal?.images, imageUrl2)
    assert.notInclude(updatedDeal?.images, imageUrl1)
  })

  test('should throw error when adding image to non-existent deal', async ({ assert }) => {
    const nonExistentId = 99999
    const imageUrl = 'https://example.com/image.jpg'

    await assert.rejects(
      () => dealService.addImage(nonExistentId, imageUrl),
      'Row not found'
    )
  })

  test('should throw error when deleting image from non-existent deal', async ({ assert }) => {
    const nonExistentId = 99999
    const imageUrl = 'https://example.com/image.jpg'

    await assert.rejects(
      () => dealService.deleteImage(nonExistentId, imageUrl),
      'Row not found'
    )
  })

  test('should create product with deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()

    const productData = {
      name: 'Test Product',
      categoryId: category.id,
      brandId: brand.id,
      user_id: user.id
    }

    const deal = await dealService.createProduct(productData)

    assert.equal(deal.user_id, user.id)
    assert.equal(deal.status, DealStatus.DRAFT)
    assert.isTrue(deal.id > 0)

    // Verify product was created
    const products = await deal.related('products').query()
    assert.lengthOf(products, 1)
    assert.equal(products[0].name, productData.name)
  })

  test('should search deals by category', async ({ assert }) => {
    const user = await TestUtils.createUser()
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

    const deal1 = await dealService.create({ user_id: user.id })
    const deal2 = await dealService.create({ user_id: user.id })

    await dealService.addProduct({ product_id: product1.id, deal_id: deal1.id })
    await dealService.addProduct({ product_id: product2.id, deal_id: deal2.id })

    const results = await dealService.search({ category: category1.id })

    assert.isArray(results.rows)
    assert.isTrue(results.rows.length >= 1)
  })

  test('should search deals by specs', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const product = await TestUtils.createProduct({ 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const deal = await dealService.create({ user_id: user.id })
    await dealService.addProduct({ product_id: product.id, deal_id: deal.id })

    // Note: This test assumes specs are properly set up
    // In a real scenario, you'd need to create specs and link them to products
    const results = await dealService.search({ specs: [] })

    assert.isArray(results.rows)
  })

  test('should handle empty search results', async ({ assert }) => {
    const results = await dealService.search({ category: 99999 })
    assert.isArray(results.rows)
    assert.lengthOf(results.rows, 0)
  })

  test('should handle deal with no products', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })

    const retrievedDeal = await dealService.one(deal.id)

    assert.equal(retrievedDeal.id, deal.id)
    assert.isArray(retrievedDeal.products)
    assert.lengthOf(retrievedDeal.products, 0)
  })

  test('should handle deal with multiple products', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const brand = await TestUtils.createBrand()
    const category = await TestUtils.createCategory()
    
    const product1 = await TestUtils.createProduct({ 
      name: 'Product 1', 
      brandId: brand.id, 
      categoryId: category.id 
    })
    const product2 = await TestUtils.createProduct({ 
      name: 'Product 2', 
      brandId: brand.id, 
      categoryId: category.id 
    })

    const deal = await dealService.create({ user_id: user.id })
    await dealService.addProduct({ product_id: product1.id, deal_id: deal.id })
    await dealService.addProduct({ product_id: product2.id, deal_id: deal.id })

    const retrievedDeal = await dealService.one(deal.id)

    assert.equal(retrievedDeal.id, deal.id)
    assert.isArray(retrievedDeal.products)
    assert.lengthOf(retrievedDeal.products, 2)
  })

  test('should maintain data integrity when updating deal', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })
    const originalId = deal.id

    const updateData = {
      title: 'Updated Title',
      description: 'Updated description',
      location: 'Updated location',
      currency: 'USD',
      price: 200,
      products: []
    }

    const updatedDeal = await dealService.update(deal.id, updateData)

    assert.equal(updatedDeal.id, originalId)
    assert.equal(updatedDeal.title, updateData.title)
    assert.equal(updatedDeal.description, updateData.description)
    assert.equal(updatedDeal.location, updateData.location)
    assert.equal(updatedDeal.currency, updateData.currency)
    assert.equal(updatedDeal.price, updateData.price)
  })

  test('should handle deal with special characters in title and description', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })

    const specialTitle = 'Deal & Co. (Ltd.) - "Premium" €500'
    const specialDescription = 'Description with émojis 🚀 and symbols & < > " \''

    const updateData = {
      title: specialTitle,
      description: specialDescription,
      location: 'Paris, France',
      currency: 'EUR',
      price: 500,
      products: []
    }

    const updatedDeal = await dealService.update(deal.id, updateData)

    assert.equal(updatedDeal.title, specialTitle)
    assert.equal(updatedDeal.description, specialDescription)
  })

  test('should handle very long deal title and description', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const deal = await dealService.create({ user_id: user.id })

    const longTitle = 'A'.repeat(255)
    const longDescription = 'B'.repeat(1000)

    const updateData = {
      title: longTitle,
      description: longDescription,
      location: 'Test location',
      currency: 'EUR',
      price: 100,
      products: []
    }

    const updatedDeal = await dealService.update(deal.id, updateData)

    assert.equal(updatedDeal.title, longTitle)
    assert.equal(updatedDeal.description, longDescription)
  })
})

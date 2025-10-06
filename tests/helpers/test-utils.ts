import Brand from '#models/brand'
import Category from '#models/category'
import Product from '#models/product'
import User from '#models/user'
import Deal from '#models/deal'
import Shop from '#models/shop'
import Spec from '#models/spec'
import SpecType from '#models/spec_type'
import Account from '#models/account'
import db from '@adonisjs/lucid/services/db'

/**
 * Test utilities for creating test data
 */
export class TestUtils {
  /**
   * Create a test brand
   */
  static async createBrand(data: Partial<{ name: string }> = {}) {
    return Brand.create({
      name: data.name || `Test Brand ${Date.now()}`
    })
  }

  /**
   * Create a test category
   */
  static async createCategory(data: Partial<{ name: string; description?: string }> = {}) {
    return Category.create({
      name: data.name || `Test Category ${Date.now()}`,
      key: data.name?.toUpperCase() || `test-category-${Date.now()}`,
      description: data.description || 'Test category description'
    })
  }

  /**
   * Create a test user
   */
  static async createUser(data: Partial<{ 
    name: string; 
    email: string; 
    password?: string;
    role?: string;
    matrixLogin?: string;
    matrixPassword?: string;
  }> = {}) {
    return User.create({
      name: data.name || `Test User ${Date.now()}`,
      email: data.email || `test${Date.now()}@example.com`,
      password: data.password || 'password123',
      role: data.role || 'USER',
      matrixLogin: data.matrixLogin || `test-user-${Date.now()}`,
      matrixPassword: data.matrixPassword || 'password123'
    })
  }

  /**
   * Create a test product
   */
  static async createProduct(data: Partial<{
    name: string;
    description?: string;
    brandId?: number;
    categoryId?: number;
  }> = {}) {
    const brand = data.brandId ? await Brand.find(data.brandId) : await this.createBrand()
    const category = data.categoryId ? await Category.find(data.categoryId) : await this.createCategory()

    return Product.create({
      name: data.name || `Test Product ${Date.now()}`,
      description: data.description || 'Test product description',
      brand_id: brand.id,
      category_id: category.id,
      status: 'DRAFT'
    })
  }

  /**
   * Create a test deal
   */
  static async createDeal(data: Partial<{
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    userId?: string;
    status?: string;
  }> = {}) {
    const user = data.userId ? await User.find(data.userId) : await this.createUser()

    return Deal.create({
      title: data.title || `Test Deal ${Date.now()}`,
      description: data.description || 'Test deal description',
      price: data.price || 100,
      currency: data.currency || 'EUR',
      user_id: user.id,
      status: data.status || 'DRAFT'
    })
  }

  /**
   * Clean up all test data
   */
  static async cleanup() {
    // Delete in order to respect foreign key constraints
    await Deal.query().delete()
    await Shop.query().delete()
    // Delete pivot table entries first
    await db.raw('DELETE FROM product_specs')
    await db.raw('DELETE FROM product_components')
    await Spec.query().delete()
    await SpecType.query().delete()
    await Product.query().delete()
    await Category.query().delete()
    await Brand.query().delete()
    // Delete accounts before users
    await Account.query().delete()
    await User.query().delete()
  }

  /**
   * Create multiple brands for testing
   */
  static async createMultipleBrands(count: number = 3) {
    const brands = []
    for (let i = 0; i < count; i++) {
      brands.push(await this.createBrand({ name: `Brand ${i + 1}` }))
    }
    return brands
  }
}

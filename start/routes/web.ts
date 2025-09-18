const HomeController = () => import('#controllers/home_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const ImportController = () => import('#controllers/import_controller')
const AdminController = () => import('#controllers/admin_controller')
const DealsController = () => import('#controllers/deals_controller')
const ChatController = () => import('#controllers/chat_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

/* ignore formatting, I find it easier to scan single-line route definitions */
/* prettier-ignore-start */
/* eslint-disable */
router
  .group(() => {
    router.get('/', [HomeController, 'home']).as('home')
    router.get('/products/search/:name', [ProductsController, 'search']).as('products.search')
    router.get('/products/:category', [ProductsController, 'plp']).as('products.plp')
    router.get('/products/:category/deal', [DealsController, 'plp']).as('products.plp.deal')
    router.get('/product/:id', [ProductsController, 'pdp']).as('product.pdp')
  })
  .use(middleware.guest())

// API

router
  .group(() => {
    // DEAL
    router.get('/deals/create', [DealsController, 'create']).as('deals.create')
    router.get('/deals/my', [DealsController, 'my']).as('deals.my')
    router.get('/deals/:id', [DealsController, 'view']).as('deals.view')
    router.get('/deals/:id/edit', [DealsController, 'edit']).as('deals.edit')
    router
      .get('/deals/:id/search-product', [DealsController, 'searchProduct'])
      .as('deals.search-product')
    router.post('/deals/:id/add-product', [DealsController, 'addProduct']).as('deals.add-product')
    router.post('/deals/:id', [DealsController, 'update']).as('deals.update')
    router.post('/deals/:id/images', [DealsController, 'addImages']).as('deals.add-images')
    router.delete('/deals/:id/images', [DealsController, 'deleteImages']).as('deals.delete-images')
    router.post('deals/:id/contact', [DealsController, 'contact']).as('deals.contact')

    // CHAT
    router.get('/chat', [ChatController, 'list']).as('chat.list')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/admin', [AdminController, 'home']).as('admin.home')
    router.get('/admin/import', [ImportController, 'form']).as('admin.import.form')
    router.post('/admin/import', [ImportController, 'import']).as('admin.import.import')
    router.get('/admin/products', [AdminController, 'products']).as('admin.products')
    router.post('/admin/product', [AdminController, 'createProduct']).as('admin.products.create')
    router.get('/admin/product/:id', [AdminController, 'product']).as('admin.product')
    router.put('/admin/product/:id', [AdminController, 'updateProduct']).as('admin.product.update')
    router
      .get('/admin/product/create', [AdminController, 'createProductPage'])
      .as('admin.product.create')
    // CATEGORY
    router.get('/admin/categories', [AdminController, 'categories']).as('admin.categories')
    router
      .post('/admin/categories', [AdminController, 'createCategory'])
      .as('admin.categories.create')
    router
      .put('/admin/categories/:id', [AdminController, 'updateCategory'])
      .as('admin.categories.update')
    router
      .delete('/admin/categories/:id', [AdminController, 'deleteCategory'])
      .as('admin.categories.delete')
    // BRAND
    router.get('/admin/brands', [AdminController, 'brands']).as('admin.brands')
    router.post('/admin/brands', [AdminController, 'createBrand']).as('admin.brands.create')
    router.put('/admin/brands/:id', [AdminController, 'updateBrand']).as('admin.brands.update')
    router.delete('/admin/brands/:id', [AdminController, 'deleteBrand']).as('admin.brands.delete')
    // SPEC
    router.get('/admin/specs', [AdminController, 'specs']).as('admin.specs')
    router.post('/admin/specs', [AdminController, 'createSpec']).as('admin.specs.create')
    router.put('/admin/specs/:id', [AdminController, 'updateSpec']).as('admin.specs.update')
    router.delete('/admin/specs/:id', [AdminController, 'deleteSpec']).as('admin.specs.delete')
    // SPEC TYPE
    router.get('/admin/spec-types', [AdminController, 'specTypes']).as('admin.spec-types')
    router
      .post('/admin/spec-types', [AdminController, 'createSpecType'])
      .as('admin.spec-types.create')
    router
      .put('/admin/spec-types/:id', [AdminController, 'updateSpecType'])
      .as('admin.spec-types.update')
    router
      .delete('/admin/spec-types/:id', [AdminController, 'deleteSpecType'])
      .as('admin.spec-types.delete')
    // USER
    router.get('/admin/users', [AdminController, 'users']).as('admin.users')
  })
  .use(middleware.auth())

router.get('/auth/login', [AuthController, 'login']).as('auth.login')
router.post('/auth/login', [AuthController, 'loginPost']).as('auth.login.post')
router.get('/auth/register', [AuthController, 'register']).as('auth.register')
router.post('/auth/register', [AuthController, 'registerPost']).as('auth.register.post')
router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout')
router.get('/auth/verify', [AuthController, 'verify']).as('auth.verify').use(middleware.auth())
router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})
router.get('/google/callback', [AuthController, 'googleCallback'])

router.where('id', router.matchers.number())

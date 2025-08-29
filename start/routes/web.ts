const HomeController = () => import('#controllers/home_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const ImportController = () => import('#controllers/import_controller')
const AdminController = () => import('#controllers/admin_controller')
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
    router.get('/product/:id', [ProductsController, 'pdp']).as('product.pdp')

  })
  .use(middleware.guest())

router.group(() => {
  router.get('/import', [ImportController, 'form']).as('import.form')
  router.post('/import', [ImportController, 'import']).as('import.import')
  router.get('/admin', [AdminController, 'home']).as('admin.home')
  router.get('/admin/products', [AdminController, 'products']).as('admin.products')
  router.get('/admin/product/:id', [AdminController, 'product']).as('admin.product')
  router.put('/admin/product/:id', [AdminController, 'updateProduct']).as('admin.product.update')
  // CATEGORY
  router.get('/admin/categories', [AdminController, 'categories']).as('admin.categories')
  router.post('/admin/categories', [AdminController, 'createCategory']).as('admin.categories.create')
  router.put('/admin/categories/:id', [AdminController, 'updateCategory']).as('admin.categories.update')
  router.delete('/admin/categories/:id', [AdminController, 'deleteCategory']).as('admin.categories.delete')
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
  router.get('/admin/users', [AdminController, 'users']).as('admin.users')

})
.use(middleware.auth())

router.get('/auth/login', [AuthController, 'login']).as('auth.login')
router.post('/auth/login', [AuthController, 'loginPost']).as('auth.login.post')
router.get('/auth/register', [AuthController, 'register']).as('auth.register')
router.post('/auth/register', [AuthController, 'registerPost']).as('auth.register.post')
router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout')
router.get('/auth/verify', [AuthController, 'verify']).as('auth.verify').use(middleware.auth())

router.where('id', router.matchers.number())

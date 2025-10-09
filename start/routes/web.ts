const HomeCtrl = () => import('#controllers/home_controller')
const ProductsCtrl = () => import('#controllers/products_controller')
const AuthCtrl = () => import('#controllers/auth_controller')
const ImportCtrl = () => import('#controllers/import_controller')
const AdminCtrl = () => import('#controllers/admin_controller')
const DealsCtrl = () => import('#controllers/deals_controller')
const ChatCtrl = () => import('#controllers/chat_controller')
const ProfileCtrl = () => import('#controllers/profile_controller')
const UserCtrl = () => import('#controllers/user_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// public routes
router
  .group(() => {
    router.get('/', [HomeCtrl, 'home']).as('home')
    router.get('/products/search/:name', [ProductsCtrl, 'search']).as('products.search')
    router.get('/products/:category', [ProductsCtrl, 'plp']).as('products.plp')
    router.get('/products/:category/deal', [DealsCtrl, 'plp']).as('products.plp.deal')
    router.get('/product/:id', [ProductsCtrl, 'pdp']).as('product.pdp')
    router.get('/user/:user-id', [UserCtrl, 'show']).as('user.show')
    // AUTH
    router.get('/auth/login', [AuthCtrl, 'login']).as('auth.login')
    router.post('/auth/login', [AuthCtrl, 'loginPost']).as('auth.login.post')
    router.get('/auth/register', [AuthCtrl, 'register']).as('auth.register')
    router.post('/auth/register', [AuthCtrl, 'registerPost']).as('auth.register.post')
    router.post('/auth/logout', [AuthCtrl, 'logout']).as('auth.logout')
    router.get('/auth/verify', [AuthCtrl, 'verify']).as('auth.verify').use(middleware.auth())
    router.get('/auth/forgot-password', [AuthCtrl, 'forgotPassword']).as('auth.forgot-password')
    router
      .post('/auth/forgot-password', [AuthCtrl, 'sendResetEmail'])
      .as('auth.forgot-password.post')
    router.get('/auth/reset-password/:token', [AuthCtrl, 'resetPassword']).as('auth.reset-password')
    router.post('/auth/reset-password', [AuthCtrl, 'updatePassword']).as('auth.reset-password.post')

    router.get('/google/redirect', ({ ally }) => {
      return ally.use('google').redirect()
    })
    router.get('/google/callback', [AuthCtrl, 'googleCallback'])
  })
  .use(middleware.guest())

// auth routes
router
  .group(() => {
    // DEAL
    router.get('/deals/create', [DealsCtrl, 'create']).as('deals.create')
    router.get('/deals/my', [DealsCtrl, 'my']).as('deals.my')
    router.get('/deals/:id', [DealsCtrl, 'view']).as('deals.view')
    router
      .group(() => {
        router.get('/deals/:id/edit', [DealsCtrl, 'edit']).as('deals.edit')
        router
          .get('/deals/:id/search-product', [DealsCtrl, 'searchProduct'])
          .as('deals.search-product')
        router.post('/deals/:id/add-product', [DealsCtrl, 'addProduct']).as('deals.add-product')
        router.post('/deals/:id', [DealsCtrl, 'update']).as('deals.update')
        router.post('/deals/:id/images', [DealsCtrl, 'addImages']).as('deals.add-images')
        router.delete('/deals/:id/images', [DealsCtrl, 'deleteImages']).as('deals.delete-images')
      })
      .use(middleware.dealOwner())
    router.post('deals/:id/contact', [DealsCtrl, 'contact']).as('deals.contact')
    // CHAT
    router.get('/chat', [ChatCtrl, 'list']).as('chat.list')
    router.post('/chat/:id/read', [ChatCtrl, 'read']).as('chat.read')
    // PROFILE
    router.get('/profile', [ProfileCtrl, 'show']).as('profile.show')
    router.put('/profile', [ProfileCtrl, 'update']).as('profile.update')
    router.post('/profile/image', [ProfileCtrl, 'uploadImage']).as('profile.upload-image')
    router.delete('/profile/image', [ProfileCtrl, 'removeImage']).as('profile.remove-image')
  })
  .use(middleware.auth())

// admin routes
router
  .group(() => {
    router.get('/admin', [AdminCtrl, 'home']).as('admin.home')
    router.get('/admin/import', [ImportCtrl, 'form']).as('admin.import.form')
    router.post('/admin/import', [ImportCtrl, 'import']).as('admin.import.import')
    router.get('/admin/products', [AdminCtrl, 'products']).as('admin.products')
    router.post('/admin/product', [AdminCtrl, 'createProduct']).as('admin.products.create')
    router.get('/admin/product/:id', [AdminCtrl, 'product']).as('admin.product')
    router.put('/admin/product/:id', [AdminCtrl, 'updateProduct']).as('admin.product.update')
    router
      .post('/admin/product/:id/images', [AdminCtrl, 'uploadProductImage'])
      .as('admin.product.upload-image')
    router.get('/admin/product/create', [AdminCtrl, 'createProductPage']).as('admin.product.create')
    // CATEGORY
    router.get('/admin/categories', [AdminCtrl, 'categories']).as('admin.categories')
    router.post('/admin/categories', [AdminCtrl, 'createCategory']).as('admin.categories.create')
    router.put('/admin/categories/:id', [AdminCtrl, 'updateCategory']).as('admin.categories.update')
    router
      .delete('/admin/categories/:id', [AdminCtrl, 'deleteCategory'])
      .as('admin.categories.delete')
    // BRAND
    router.get('/admin/brands', [AdminCtrl, 'brands']).as('admin.brands')
    router.post('/admin/brands', [AdminCtrl, 'createBrand']).as('admin.brands.create')
    router.put('/admin/brands/:id', [AdminCtrl, 'updateBrand']).as('admin.brands.update')
    router.delete('/admin/brands/:id', [AdminCtrl, 'deleteBrand']).as('admin.brands.delete')
    // SPEC
    router.get('/admin/specs', [AdminCtrl, 'specs']).as('admin.specs')
    router.post('/admin/specs', [AdminCtrl, 'createSpec']).as('admin.specs.create')
    router.put('/admin/specs/:id', [AdminCtrl, 'updateSpec']).as('admin.specs.update')
    router.delete('/admin/specs/:id', [AdminCtrl, 'deleteSpec']).as('admin.specs.delete')
    // SPEC TYPE
    router.get('/admin/spec-types', [AdminCtrl, 'specTypes']).as('admin.spec-types')
    router.post('/admin/spec-types', [AdminCtrl, 'createSpecType']).as('admin.spec-types.create')
    router.put('/admin/spec-types/:id', [AdminCtrl, 'updateSpecType']).as('admin.spec-types.update')
    router
      .delete('/admin/spec-types/:id', [AdminCtrl, 'deleteSpecType'])
      .as('admin.spec-types.delete')
    // USER
    router.get('/admin/users', [AdminCtrl, 'users']).as('admin.users')
    router.get('/admin/deals', [AdminCtrl, 'deals']).as('admin.deals')
    router
      .post('/admin/deals/:id/status', [AdminCtrl, 'updateDealStatus'])
      .as('admin.deals.update-status')
  })
  .use(middleware.auth())
  .use(middleware.admin())

router.where('id', router.matchers.number())

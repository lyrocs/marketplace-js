const HomeController = () => import('#controllers/home_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const ImportController = () => import('#controllers/import_controller')
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
    router.get('/import', [ImportController, 'form']).as('import.form')
    router.post('/import', [ImportController, 'import']).as('import.import')
  })
  .use(middleware.guest())

router.get('/auth/login', [AuthController, 'login']).as('auth.login')
router.post('/auth/login', [AuthController, 'loginPost']).as('auth.login.post')
router.get('/auth/register', [AuthController, 'register']).as('auth.register')
router.post('/auth/register', [AuthController, 'registerPost']).as('auth.register.post')
router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout')
router.get('/auth/verify', [AuthController, 'verify']).as('auth.verify').use(middleware.auth())

router.where('id', router.matchers.number())

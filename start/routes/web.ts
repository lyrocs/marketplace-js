const HomeController = () => import('#controllers/home_controller')
const ProductsController = () => import('#controllers/products_controller')

import router from '@adonisjs/core/services/router'

/* ignore formatting, I find it easier to scan single-line route definitions */
/* prettier-ignore-start */
/* eslint-disable */

router.get('/', [HomeController, 'home']).as('home')
router.get('/products/search/:name', [ProductsController, 'search']).as('products.search')
router.get('/products/:category', [ProductsController, 'plp']).as('products.plp')
router.get('/product/:id', [ProductsController, 'pdp']).as('product.pdp')

router.where('id', router.matchers.number())
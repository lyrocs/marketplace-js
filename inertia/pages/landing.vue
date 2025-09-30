<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import {
  IconSupervisedUserCircle,
  IconStoreOutline,
  IconShieldPerson,
  IconBook,
  IconChat,
  IconSearch,
} from '@iconify-prerendered/vue-material-symbols'
import ProductDto from '#dtos/product'

const searchInput = ref('')

const props = defineProps<{
  products: ProductDto[]
}>()

const search = () => {
  router.get(`/products/search/${searchInput.value}`)
}

</script>

<template>
  <div>
    <section class="relative flex h-[60vh] min-h-[400px] items-center">
      <div class="absolute inset-0 size-full bg-cover bg-center" style="
          background-image: url('https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/home-banner.jpeg');
        "></div>
      <div class="absolute inset-0 size-full bg-slate-900/60"></div>
      <div class="container relative mx-auto px-4 text-center text-white">
        <h1 class="text-4xl font-extrabold tracking-tight md:text-6xl">
          La marketplace des passionnés de drones FPV
        </h1>
        <p class="mx-auto mt-4 max-w-3xl text-lg text-slate-200 md:text-xl">
          Découvrez les meilleurs produits des boutiques françaises et trouvez des offres exclusives entre particuliers pour vos drones et pièces détachées FPV
        </p>
        <div class="mx-auto mt-8 max-w-xl flex items-center justify-center">
          <div class="relative w-full max-w-sm">
            <Input v-model="searchInput" @keyup.enter="search" id="search" type="text"
              placeholder="Que recherchez-vous ?" class="pl-10 text-black" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <IconSearch class="size-6 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12 md:py-20">
      <section class="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:gap-8">
        <a href="#"
          class="block rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <IconSupervisedUserCircle class="ri-group-2-fill mx-auto text-5xl text-slate-500" />
          <h2 class="mt-4 text-2xl font-bold text-gray-800">Explorer les Annonces</h2>
          <p class="mt-1 text-gray-600">
            Trouvez la perle rare auprès de vendeurs passionnés et vérifiés.
          </p>
          <span class="group mt-4 inline-block font-semibold text-slate-600">Voir les annonces &rarr;</span>
        </a>
        <a href="#"
          class="block rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <IconStoreOutline class="ri-store-2-line mx-auto text-5xl text-slate-500" />
          <h2 class="mt-4 text-2xl font-bold text-gray-800">Consulter le Catalogue</h2>
          <p class="mt-1 text-gray-600">
            Comparez les produits neufs et les fiches techniques officielles.
          </p>
          <span class="group mt-4 inline-block font-semibold text-slate-600">Accéder au catalogue &rarr;</span>
        </a>
      </section>

      <!-- <section class="mt-20">
        <h2 class="text-center text-3xl font-bold text-gray-200">Les dernières annonces</h2>
        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
            <a href="#" class="block"><img
                src="https://www.drone-fpv-racer.com/79466-large_default/bando-killer-v25-6s-o4-pro-elrs-gps-bnf-by-dfr.jpg"
                class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt="Drone" /></a>
            <div class="flex grow flex-col p-4">
              <span
                class="inline-block w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800">Très
                bon état</span>
              <h3 class="mt-2 text-lg font-bold text-gray-800 hover:text-slate-600">
                <a href="#">DJI Mavic Air 2 - Fly More</a>
              </h3>
              <p class="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <i class="ri-map-pin-line"></i>
                Lyon, France
              </p>
              <p class="mt-4 text-2xl font-bold text-gray-900">650 €</p>
              <div class="mt-auto flex items-center gap-3 border-t pt-4">
                <img src="https://i.pravatar.cc/32?u=julien" class="size-8 rounded-full" alt="avatar" />
                <div>
                  <p class="text-sm font-semibold text-gray-700">Julien78</p>
                  <div class="flex text-xs text-yellow-400">
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
            <a href="#" class="block"><img
                src="https://www.drone-fpv-racer.com/79234-large_default/mario-5-xh-6s-o4-pro-elrs-bnf-by-dfr.jpg"
                class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt="Drone" /></a>
            <div class="flex grow flex-col p-4">
              <span
                class="inline-block w-fit rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Comme
                neuf</span>
              <h3 class="mt-2 text-lg font-bold text-gray-800 hover:text-slate-600">
                <a href="#">iFlight Nazgul Evoque F5</a>
              </h3>
              <p class="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <i class="ri-map-pin-line"></i>
                Nantes, France
              </p>
              <p class="mt-4 text-2xl font-bold text-gray-900">420 €</p>
              <div class="mt-auto flex items-center gap-3 border-t pt-4">
                <img src="https://i.pravatar.cc/32?u=fpv-marc" class="size-8 rounded-full" alt="avatar" />
                <div>
                  <p class="text-sm font-semibold text-gray-700">FPV_Marc</p>
                  <div class="flex text-xs text-yellow-400">
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                    <i class="ri-star-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> -->

      <section class="mt-20 rounded-xl bg-white p-8 shadow-lg md:p-12">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-3xl font-bold text-gray-800">Achetez et vendez en toute confiance</h2>
          <p class="mt-2 text-gray-600">
            Notre plateforme est conçue pour les passionnés, par des passionnés. Nous mettons tout
            en oeuvre pour sécuriser vos échanges.
          </p>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div>
            <IconShieldPerson class="ri-shield-check-line mx-auto text-5xl text-slate-500" />
            <h3 class="mt-4 text-xl font-bold text-gray-800">Vendeurs Vérifiés</h3>
            <p class="mt-1 text-gray-600">
              Un système de notation et d'avis transparent pour chaque vendeur.
            </p>
          </div>
          <div>
            <IconBook class="ri-book-open-line mx-auto text-5xl text-slate-500" />
            <h3 class="mt-4 text-xl font-bold text-gray-800">Catalogue de Référence</h3>
            <p class="mt-1 text-gray-600">
              Chaque annonce est liée à une fiche produit officielle pour plus de clarté.
            </p>
          </div>
          <div>
            <IconChat class="ri-wechat-line mx-auto text-5xl text-slate-500" />
            <h3 class="mt-4 text-xl font-bold text-gray-800">Contact Direct</h3>
            <p class="mt-1 text-gray-600">
              Échangez facilement avec les vendeurs pour poser vos questions.
            </p>
          </div>
        </div>
      </section>

      <section class="mt-20">
        <div class="rounded-xl bg-slate-700 p-12 text-center">
          <h2 class="text-3xl font-bold text-white">Vous avez du matériel à vendre ?</h2>
          <p class="mx-auto mt-2 max-w-xl text-slate-200">
            Rejoignez notre communauté de passionnés et donnez une seconde vie à votre équipement.
            La création d'annonce est simple et rapide.
          </p>
          <a href="#"
            class="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-lg font-bold text-slate-800 transition-colors hover:bg-slate-200">
            Créer une annonce gratuitement
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

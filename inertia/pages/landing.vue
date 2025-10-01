<script setup lang="ts">
import {
  IconSupervisedUserCircle,
  IconStoreOutline,
  IconShieldPerson,
  IconBook,
  IconChat,
} from '@iconify-prerendered/vue-material-symbols'
import ProductDto from '#dtos/product'

const props = defineProps<{
  products: ProductDto[]
}>()
</script>

<template>
  <div>
    <HeroSection
      title="La marketplace des passionnés de drones FPV"
      description="Découvrez les meilleurs produits des boutiques françaises et trouvez des offres exclusives entre particuliers pour vos drones et pièces détachées FPV"
      background-image="https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/home-banner.jpeg"
      search-placeholder="Que recherchez-vous ?"
    />

    <div class="container mx-auto px-4 py-12 md:py-20">
      <section class="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:gap-8">
        <FeatureCard href="#">
          <template #icon>
            <IconSupervisedUserCircle />
          </template>
          <template #title>Explorer les Annonces</template>
          <template #description>
            Trouvez la perle rare auprès de vendeurs passionnés et vérifiés.
          </template>
          <template #link>Voir les annonces &rarr;</template>
        </FeatureCard>

        <FeatureCard href="#">
          <template #icon>
            <IconStoreOutline />
          </template>
          <template #title>Consulter le Catalogue</template>
          <template #description>
            Comparez les produits neufs et les fiches techniques officielles.
          </template>
          <template #link>Accéder au catalogue &rarr;</template>
        </FeatureCard>
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
          <FeatureIcon>
            <IconShieldPerson />
            <template #title>Vendeurs Vérifiés</template>
            <template #description>
              Un système de notation et d'avis transparent pour chaque vendeur.
            </template>
          </FeatureIcon>

          <FeatureIcon>
            <IconBook />
            <template #title>Catalogue de Référence</template>
            <template #description>
              Chaque annonce est liée à une fiche produit officielle pour plus de clarté.
            </template>
          </FeatureIcon>

          <FeatureIcon>
            <IconChat />
            <template #title>Contact Direct</template>
            <template #description>
              Échangez facilement avec les vendeurs pour poser vos questions.
            </template>
          </FeatureIcon>
        </div>
      </section>

      <CTASection
        title="Vous avez du matériel à vendre ?"
        description="Rejoignez notre communauté de passionnés et donnez une seconde vie à votre équipement. La création d'annonce est simple et rapide."
        button-text="Créer une annonce gratuitement"
        button-href="#"
      />
    </div>
  </div>
</template>

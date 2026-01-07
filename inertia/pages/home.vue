<script setup lang="ts">
import {
  IconSupervisedUserCircle,
  IconStoreOutline,
  IconShieldPerson,
  IconBook,
  IconChat,
} from '@iconify-prerendered/vue-material-symbols'
import ProductDto from '#dtos/product'
import DealDto from '#dtos/deal'
import DealCard from '~/components/cards/DealCard/DealCard.vue';

const props = defineProps<{
  products: ProductDto[]
  deals: DealDto[]
}>()

</script>

<template>
  <div>
    <HeroSection
      :title="$t('home.title')"
      :description="$t('home.description')"
      background-image="/images/home-banner.jpg"
      :search-placeholder="$t('home.searchPlaceholder')"
    />

    <div class="container mx-auto px-4 py-12 md:py-20">
      <section class="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:gap-8">
        <FeatureCard href="/products/all/deal">
          <template #icon>
            <IconSupervisedUserCircle />
          </template>
          <template #title>{{ $t('home.exploreDeals') }}</template>
          <template #description>
            {{ $t('home.exploreDealsDescription') }}
          </template>
          <template #link>{{ $t('home.exploreDealsLink') }} &rarr;</template>
        </FeatureCard>

        <FeatureCard href="/products/all">
          <template #icon>
            <IconStoreOutline />
          </template>
          <template #title>{{ $t('home.exploreProducts') }}</template>
          <template #description>
            {{ $t('home.exploreProductsDescription') }}
          </template>
          <template #link>{{ $t('home.exploreProductsLink') }} &rarr;</template>
        </FeatureCard>
      </section>

      <section class="mt-20">
        <h2 class="text-center text-3xl font-bold">{{ $t('home.recentDeals') }}</h2>
        <div class="mt-8 flex flex-wrap">
          <div v-for="deal in deals" :key="deal.id" class="basis-1/4 p-3">
            <DealCard :deal="deal" />
          </div>
        </div>
      </section>

      <section class="mt-20 rounded-xl bg-white p-8 shadow-lg md:p-12">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-3xl font-bold text-gray-800">{{ $t('home.trustTitle') }}</h2>
          <p class="mt-2 text-gray-600">
            {{ $t('home.trustSubtitle') }}
          </p>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <FeatureIcon>
            <IconShieldPerson />
            <template #title>{{ $t('home.trustVerifiedUser') }}</template>
            <template #description>
              {{ $t('home.trustVerifiedUserDescription') }}
            </template>
          </FeatureIcon>

          <FeatureIcon>
            <IconBook />
            <template #title>{{ $t('home.trustCatalog') }}</template>
            <template #description>
              {{ $t('home.trustCatalogDescription') }}
            </template>
          </FeatureIcon>

          <FeatureIcon>
            <IconChat />
            <template #title>{{ $t('home.trustContact') }}</template>
            <template #description>
              {{ $t('home.trustContactDescription') }}
            </template>
          </FeatureIcon>
        </div>
      </section>

      <CTASection
        :title="$t('home.startSelling')"
        :description="$t('home.startSellingDescription')"
        :button-text="$t('home.startSellingLink')"
        button-href="/deals/create"
      />
    </div>
  </div>
</template>

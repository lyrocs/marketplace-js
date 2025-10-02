<script setup lang="ts">
import DealDto from '#dtos/deal'
import { router } from '@inertiajs/vue3'
import { computed } from 'vue'
import { IconHelpOutline, IconAddPhotoAlternateOutline, IconVerifiedUserOutline, IconStar, IconStarHalf, IconStarOutline } from '@iconify-prerendered/vue-material-symbols'

const props = defineProps<{ deal: DealDto }>()

// mock to be replace later
const dealState = 'Très bon état'
const category = { name: 'DRONE CINÉMATIQUE' }
const seller = {
    name: 'Julien78',
    avatar: 'https://i.pravatar.cc/64',
    rating: 4.5,
    reviews: 28,
    location: 'Lyon, France',
    shippingMethods: ['Remise en main propre acceptée', 'Livraison possible (Colissimo)'],
}

const details = {
    saleReason: 'Passage au modèle supérieur (DJI Mavic 3).',
    extraPhotos: 'Disponibles sur simple demande.',
    attributes: ['Drone jamais crashé', "Facture d'achat fournie"],
}

const specsData = computed(() => [
    { label: 'Temps de vol', value: '34 min' },
    { label: 'Portée', value: '10 km' },
    { label: 'Capteur', value: '48MP' },
    { label: 'Poids', value: '570 g' },
])

const similarDeals = [
    {
        id: 1,
        title: 'Combo Drone DJI FPV',
        price: 850,
        currency: '€',
        images: ['https://placehold.co/300x300/64748b/white?text=DJI+FPV'],
        location: 'Bordeaux, France',
    },
]

const makeOffer = () => {
    router.post(`/deals/${props.deal.id}/contact`)
}
</script>

<template>
    <main class="container mx-auto px-4 py-8 md:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
            <div class="lg:col-span-2 space-y-8">
                <div>
                    <span class="text-sm font-medium text-slate-600">{{ category.name }}</span>
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mt-1">{{ deal.title }}</h1>
                </div>

                <div class="bg-white p-4 rounded-xl shadow-lg">
                    <img src="https://placehold.co/1200x700/475569/white?text=Vue+principale"
                        alt="Image principale du drone" class="rounded-lg w-full h-full object-cover" />
                </div>

                <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-800">Description par le vendeur</h2>
                    <p class="mt-4 text-gray-700 leading-relaxed">
                        {{ deal.description }}
                    </p>
                </div>

                <ProductReferenceList :products="deal.products" />

                <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-800">Détails de l'annonce</h2>
                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                <IconHelpOutline class="text-slate-500"></IconHelpOutline>Raison de la vente
                            </h4>
                            <p class="text-sm text-gray-600 mt-1 pl-6">{{ details.saleReason }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                <IconAddPhotoAlternateOutline class="text-slate-500"></IconAddPhotoAlternateOutline>
                                Photos
                                supplémentaires
                            </h4>
                            <p class="text-sm text-gray-600 mt-1 pl-6">{{ details.extraPhotos }}</p>
                        </div>
                    </div>
                    <ul class="mt-6 pt-6 border-t space-y-4">
                        <li v-for="(attr, i) in details.attributes" :key="i" class="flex items-start gap-3">
                            <IconVerifiedUserOutline class="text-green-500 text-2xl flex-shrink-0 mt-0.5">
                            </IconVerifiedUserOutline>
                            <div>
                                <h4 class="font-semibold text-gray-800">{{ attr }}</h4>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="lg:col-span-1 mt-8 lg:mt-0">
                <div class="lg:sticky lg:top-28 space-y-6">
                    <SellerCard :seller="seller">
                        <template #rating>
                            <div class="flex items-center gap-2">
                                <div class="flex text-yellow-400 text-sm">
                                    <IconStar class="text-yellow-400" />
                                    <IconStar class="text-yellow-400" />
                                    <IconStar class="text-yellow-400" />
                                    <IconStarHalf class="text-yellow-400" />
                                    <IconStarOutline class="text-yellow-400" />
                                </div>
                                <span class="text-xs text-gray-500">({{ seller.reviews }} avis)</span>
                            </div>
                        </template>
                    </SellerCard>

                    <PriceCard
                        :price="deal.price"
                        :state="dealState"
                        @contact="makeOffer"
                        @make-offer="makeOffer"
                    />

                    <SpecsList :specs="specsData" />
                </div>
            </div>
        </div>
        <div class="mt-16 pt-8 border-t">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                Autres annonces qui pourraient vous intéresser
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SimilarDealCard v-for="sdeal in similarDeals" :key="sdeal.id" :deal="sdeal" />
            </div>
        </div>
    </main>
</template>
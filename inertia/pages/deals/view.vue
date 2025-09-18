<script setup lang="ts">
import DealDto from '#dtos/deal'
import { router } from '@inertiajs/vue3';

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
const specs = {
    flightTime: '34 min',
    range: '10 km',
    sensor: '48MP',
    weight: '570 g',
}
const similarDeals = [
    {
        id: 1,
        title: 'Combo Drone DJI FPV',
        state: 'Bon état',
        description:
            'Pack complet DJI FPV, idéal pour débuter en immersion. Quelques rayures d\'usage sur la coque mais n\'affecte en rien le vol. Vendu avec le casque V2.',
        sellerName: 'Marc_FPV',
        location: 'Bordeaux, France',
        price: 850,
        image: 'https://placehold.co/300x300/64748b/white?text=DJI+FPV',
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

                <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-800">Produit(s) de référence du catalogue</h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Cette annonce est composée des produits officiels suivants.
                    </p>
                    <div class="mt-6 space-y-4">
                        <div v-for="(product, index) in deal.products" :key="index"
                            class="flex items-center gap-4 border border-slate-200 rounded-lg p-3 hover:bg-slate-50 hover:shadow-sm transition-all">
                            <div class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                                <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-grow">
                                <span class="text-xs font-semibold text-gray-500">{{ product.brand }}</span>
                                <h4 class="font-bold text-gray-800 leading-tight">{{ product.name }}</h4>
                                <p class="text-sm text-gray-600 mt-1 hidden sm:block">{{ product.description }}</p>
                            </div>
                            <a href="#" class="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-700"
                                title="Voir la fiche officielle">
                                <ion-icon name="arrow-forward-circle-outline" class="text-3xl"></ion-icon>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-800">Détails de l'annonce</h2>
                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                <ion-icon name="help-circle-outline" class="text-slate-500"></ion-icon>Raison de la
                                vente
                            </h4>
                            <p class="text-sm text-gray-600 mt-1 pl-6">{{ details.saleReason }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                <ion-icon name="images-outline" class="text-slate-500"></ion-icon>Photos
                                supplémentaires
                            </h4>
                            <p class="text-sm text-gray-600 mt-1 pl-6">{{ details.extraPhotos }}</p>
                        </div>
                    </div>
                    <ul class="mt-6 pt-6 border-t space-y-4">
                        <li v-for="(attr, i) in details.attributes" :key="i" class="flex items-start gap-3">
                            <ion-icon name="shield-checkmark-outline"
                                class="text-green-500 text-2xl flex-shrink-0 mt-0.5"></ion-icon>
                            <div>
                                <h4 class="font-semibold text-gray-800">{{ attr }}</h4>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="lg:col-span-1 mt-8 lg:mt-0">
                <div class="lg:sticky lg:top-28 space-y-6">
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="font-bold text-lg text-gray-800 mb-3">Vendeur et modalités</h3>
                        <div class="flex items-center gap-4">
                            <img :src="seller.avatar" alt="avatar" class="w-16 h-16 rounded-full" />
                            <div>
                                <a href="#" class="font-semibold text-gray-800 hover:text-slate-600">{{ seller.name
                                    }}</a>
                                <div class="flex items-center gap-2 mt-1">
                                    <div class="flex text-yellow-400 text-sm">
                                        <ion-icon name="star"></ion-icon><ion-icon name="star"></ion-icon><ion-icon
                                            name="star"></ion-icon><ion-icon name="star"></ion-icon><ion-icon
                                            name="star-half-outline"></ion-icon>
                                    </div>
                                    <span class="text-xs text-gray-500">({{ seller.reviews }} avis)</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm text-gray-600 space-y-3 mt-4 pt-4 border-t">
                            <div class="flex items-center gap-2">
                                <ion-icon name="location-outline" class="text-lg"></ion-icon><span>Situé à {{
                                    seller.location }}</span>
                            </div>
                            <div v-for="(method, i) in seller.shippingMethods" :key="i" class="flex items-center gap-2">
                                <ion-icon name="people-outline" class="text-lg"></ion-icon><span>{{ method }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="text-center">
                            <p class="text-4xl font-bold text-gray-900">{{ deal.price }} €</p>
                            <span class="text-sm text-gray-500 mt-1">(Prix négociable)</span>
                        </div>
                        <span
                            class="mt-3 block text-center bg-slate-100 text-slate-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mx-auto">État
                            : {{ dealState }}</span>
                        <div class="mt-6 flex flex-col gap-3">
                            <button @click="makeOffer"
                                class="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-800 transition-colors duration-300 flex items-center justify-center gap-2">
                                <ion-icon name="chatbubble-ellipses-outline" class="text-xl"></ion-icon> Contacter
                            </button>
                            <button @click="makeOffer"
                                class="w-full bg-white border-2 border-slate-700 text-slate-700 font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-100 transition-colors duration-300">
                                Faire une offre
                            </button>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="font-bold text-lg text-gray-800 mb-4">Spécifications clés</h3>
                        <ul class="text-sm text-gray-700 space-y-4">
                            <li class="flex justify-between items-center">
                                <span class="flex items-center gap-2 text-gray-600"><ion-icon name="hourglass-outline"
                                        class="text-slate-500"></ion-icon> Temps de vol</span><span
                                    class="font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{{ specs.flightTime
                                    }}</span>
                            </li>
                            <li class="flex justify-between items-center">
                                <span class="flex items-center gap-2 text-gray-600"><ion-icon name="wifi-outline"
                                        class="text-slate-500"></ion-icon> Portée</span><span
                                    class="font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{{ specs.range }}</span>
                            </li>
                            <li class="flex justify-between items-center">
                                <span class="flex items-center gap-2 text-gray-600"><ion-icon name="camera-outline"
                                        class="text-slate-500"></ion-icon> Capteur</span><span
                                    class="font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{{ specs.sensor }}</span>
                            </li>
                            <li class="flex justify-between items-center">
                                <span class="flex items-center gap-2 text-gray-600"><ion-icon name="scale-outline"
                                        class="text-slate-500"></ion-icon> Poids</span><span
                                    class="font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{{ specs.weight }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-16 pt-8 border-t">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                Autres annonces qui pourraient vous intéresser
            </h2>
            <div class="space-y-6">
                <div v-for="sdeal in similarDeals" :key="sdeal.id"
                    class="bg-white rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center transition-shadow hover:shadow-lg">
                    <a href="#"
                        class="sm:col-span-2 aspect-square sm:aspect-auto h-full block bg-gray-200 rounded-md overflow-hidden">
                        <img :src="sdeal.image" alt="Produit" class="w-full h-full object-cover" />
                    </a>
                    <div class="sm:col-span-7">
                        <span
                            class="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">État
                            : {{ sdeal.state }}</span>
                        <h3 class="font-bold text-lg text-gray-800 mt-1 hover:text-slate-600">
                            <a href="#">{{ sdeal.title }}</a>
                        </h3>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                            {{ sdeal.description }}
                        </p>
                        <div class="text-xs text-gray-500 mt-2 flex items-center gap-4">
                            <div class="flex items-center gap-1">
                                <ion-icon name="person-circle-outline"></ion-icon><span>{{ sdeal.sellerName }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <ion-icon name="location-outline"></ion-icon><span>{{ sdeal.location }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="sm:col-span-3 text-center sm:text-right">
                        <p class="text-2xl font-bold text-gray-900">{{ sdeal.price }} €</p>
                        <a href="#" class="text-sm font-semibold text-slate-600 hover:underline">Voir l'annonce</a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
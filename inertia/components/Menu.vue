<script setup lang="ts">
import CategoryDto from "#dtos/category";
import { cva } from "class-variance-authority"

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
)

const props = defineProps<{
  categories: CategoryDto[]
}>()

const categoriesImage = {
  motor: 'https://kwadmarket-images.s3.amazonaws.com/public/motor.jpg',
  fc: 'https://kwadmarket-images.s3.amazonaws.com/public/fc.jpg',
  esc: 'https://kwadmarket-images.s3.amazonaws.com/public/esc.jpg',
  stack: 'https://kwadmarket-images.s3.amazonaws.com/public/stack.jpg',
  camera: 'https://kwadmarket-images.s3.amazonaws.com/public/camera.jpg',
  vtx: 'https://kwadmarket-images.s3.amazonaws.com/public/vtx.jpg',
  vrx: 'https://kwadmarket-images.s3.amazonaws.com/public/vrx.jpg',
  goggles: 'https://kwadmarket-images.s3.amazonaws.com/public/goggles.jpg',
  rx: 'https://kwadmarket-images.s3.amazonaws.com/public/rx.jpg',
  tx: 'https://kwadmarket-images.s3.amazonaws.com/public/tx.jpg',
  radio: 'https://kwadmarket-images.s3.amazonaws.com/public/radio.jpg',
  frame_kit: 'https://kwadmarket-images.s3.amazonaws.com/public/frame_kit.jpg',
  frame_part: 'https://kwadmarket-images.s3.amazonaws.com/public/frame_part.jpg',
  chargeur: 'https://kwadmarket-images.s3.amazonaws.com/public/chargeur.jpg',
  battery: 'https://kwadmarket-images.s3.amazonaws.com/public/battery.jpg',
};

const categoriesDescription = {
  motor: 'Puissance et réactivité : trouvez les bons KV pour votre style.',
  fc: 'Le cerveau du drone : choisissez la bonne taille de montage.',
  esc: 'Contrôle moteur précis : sélectionnez puissance (A) et format.',
  stack: 'Solution intégrée FC+ESC : choisissez taille et puissance pour simplifier.',
  camera: 'Votre vue FPV : sélectionnez format (Nano, Micro...) et système vidéo.',
  vtx: 'Transmission vidéo : choisissez puissance, taille et système (Analogique/HD).',
  vrx: 'Réception vidéo : trouvez le module adapté à votre système (Analogique/HD).',
  goggles: 'Immersion FPV totale : choisissez vos lunettes (Analogique/HD).',
  rx: 'Récepteur radio (RX) : assurez la compatibilité protocolaire (ELRS, Crossfire...).',
  tx: 'Module d\'émission (TX) : pilotez avec votre protocole préféré.',
  radio: 'Radiocommandes : prenez le contrôle, vérifiez le protocole supporté.',
  frame_kit: 'Le squelette de votre drone : choisissez la taille idéale (5", 3"...).',
  frame_part: 'Pièces détachées (bras, platines...) : réparez ou personnalisez votre châssis.',
  chargeur: 'Chargeurs : pour vos batteries LiPo/Li-Ion (Cellules, Type, Connecteur).',
  battery: 'L\'énergie pour voler : sélectionnez capacité (mAh), cellules (S) et connecteur.',
};

const parentCategories = props.categories.filter((category) => category.parentId === null)
const menuParentCategories = parentCategories.map((category) => ({
  title: category.name,
  children: props.categories.filter((childCategory) => childCategory.parentId === category.id).map((childCategory) => ({
    title: childCategory.name,
    href: `/products/${childCategory.name.toLowerCase()}`,
    image: categoriesImage[childCategory.name.toLowerCase() as keyof typeof categoriesImage],
    description: categoriesDescription[childCategory.name.toLowerCase() as keyof typeof categoriesDescription],
  }))
}))

</script>

<template>
  <div class="flex gap-4 items-center">
    <a href="/" class="text-2xl font-semibold">
      Marketplace.js
    </a>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem v-for="parentCategory in menuParentCategories" :key="parentCategory.title">
          <NavigationMenuTrigger>{{ parentCategory.title }}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <li v-for="childCategory in parentCategory.children" :key="childCategory.title">
                <NavigationMenuLink as-child>
                  <a :href="childCategory.href">
                    <div class="flex items-center gap-2">
                      <img :src="childCategory.image" class="h-6 w-6">
                      <span>{{ childCategory.title }}</span>
                    </div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ childCategory.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>
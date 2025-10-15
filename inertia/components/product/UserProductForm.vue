<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
import { IconCloudDoneOutline } from '@iconify-prerendered/vue-material-symbols'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useTranslation } from 'i18next-vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
    required: true,
  },
  specs: {
    type: Array as PropType<SpecDto[]>,
    required: true,
  },
  categories: {
    type: Array as PropType<CategoryDto[]>,
    required: true,
  },
  brands: {
    type: Array as PropType<BrandDto[]>,
    required: true,
  },
  messages: {
    type: Object as PropType<any>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  s3BaseUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const { t } = useTranslation()

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ message: t('product.validation.nameRequired') })
      .min(2, { message: t('product.validation.nameMinLength') })
      .max(250, { message: t('product.validation.nameMaxLength') }),
    categoryId: z
      .string({ message: t('product.validation.categoryRequired') })
      .min(1, { message: t('product.validation.categoryRequired') }),
    brandId: z
      .string({ message: t('product.validation.brandRequired') })
      .min(1, { message: t('product.validation.brandRequired') }),
    description: z
      .string({ message: t('product.validation.descriptionRequired') })
      .min(10, { message: t('product.validation.descriptionMinLength') }),
    images: z.array(z.string()).optional(),
    specs: z.array(z.number()).optional(),
    features: z.array(z.any()).optional(),
  })
)

const { isFieldDirty, handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.modelValue.name || '',
    categoryId: props.modelValue.category_id || '',
    brandId: props.modelValue.brand_id || '',
    description: props.modelValue.description || '',
    images: props.modelValue.images || [],
    specs: props.modelValue.specs || [],
    features: props.modelValue.features || [],
  },
})

const showImagePopin = ref(false)
const selectedImageUrl = ref('')

function openImagePopin(imageUrl: string) {
  selectedImageUrl.value = imageUrl
  showImagePopin.value = true
}

function closeImagePopin() {
  showImagePopin.value = false
  selectedImageUrl.value = ''
}

function updateField(field: string, value: any) {
  setFieldValue(field as any, value)
  emit('update:modelValue', {
    ...values,
    category_id: values.categoryId,
    brand_id: values.brandId,
  })
}

const onSubmit = handleSubmit((formValues) => {
  emit('submit', formValues)
})

const selectedSpecType = ref('')
const selectedSpecValue = ref('')

const specsByType = computed(() => {
  const grouped: Record<string, SpecDto[]> = {}
  props.specs.forEach((spec) => {
    const typeLabel = spec.type.label
    if (!grouped[typeLabel]) {
      grouped[typeLabel] = []
    }
    grouped[typeLabel].push(spec)
  })
  return grouped
})

const availableSpecValues = computed(() => {
  if (!selectedSpecType.value) return []
  return specsByType.value[selectedSpecType.value] || []
})

function addSpec() {
  const specId = Number(selectedSpecValue.value)
  if (specId && values.specs && !values.specs.includes(specId)) {
    const newSpecs = [...values.specs, specId]
    setFieldValue('specs', newSpecs)
    updateField('specs', newSpecs)
    selectedSpecType.value = ''
    selectedSpecValue.value = ''
  }
}

function removeSpec(id: number) {
  if (values.specs) {
    const newSpecs = values.specs.filter((sid: number) => sid !== id)
    setFieldValue('specs', newSpecs)
    updateField('specs', newSpecs)
  }
}

function onSpecTypeChange() {
  selectedSpecValue.value = ''
}
const newImage = ref('')
function addImage() {
  if (newImage.value && values.images && !values.images.includes(newImage.value)) {
    const newImages = [...values.images, newImage.value]
    setFieldValue('images', newImages)
    updateField('images', newImages)
    newImage.value = ''
  }
}
function removeImage(idx: number) {
  if (values.images) {
    const newImages = values.images.filter((_, index) => index !== idx)
    setFieldValue('images', newImages)
    updateField('images', newImages)
  }
}
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>{{ $t('product.form.name') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">{{ $t('product.form.images') }}</label>
      <div class="flex flex-wrap gap-2 mb-2">
        <div
          v-for="(img, idx) in values.images || []"
          :key="idx"
          class="relative group cursor-pointer"
          @click="openImagePopin(img)"
        >
          <img :src="img" class="w-20 h-20 object-cover rounded border" />
          <IconCloudDoneOutline
            v-if="img.includes(s3BaseUrl)"
            class="absolute -top-1 -left-1 text-green-600 p-1 text-3xl"
          />
          <button
            type="button"
            @click.stop="removeImage(idx)"
            class="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:opacity-100"
          >
            &times;
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <Input
          v-model="newImage"
          @blur="() => addImage()"
          :placeholder="$t('product.form.addImageUrl')"
          class="flex-1"
        />
        <Button type="button" @click="addImage" variant="outline">
          {{ $t('product.form.addImage') }}
        </Button>
      </div>

      <div
        v-if="showImagePopin"
        @click="closeImagePopin"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="relative max-w-4xl max-h-full p-4">
          <img :src="selectedImageUrl" class="max-w-full max-h-full object-contain" @click.stop />
          <button
            @click="closeImagePopin"
            class="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
    <FormField v-slot="{ componentField }" name="categoryId" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>{{ $t('product.form.category') }}</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger>
              <SelectValue :placeholder="$t('product.form.selectCategory')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cat in props.categories" :key="cat.id" :value="cat.id.toString()">
                {{ cat.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="brandId" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>{{ $t('product.form.brand') }}</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger>
              <SelectValue :placeholder="$t('product.form.selectBrand')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="brand in props.brands.sort((a, b) => a.name.localeCompare(b.name))"
                :key="brand.id"
                :value="brand.id.toString()"
              >
                {{ brand.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="mb-4">
      <label class="block font-semibold mb-1">{{ $t('product.form.specs') }}</label>

      <ul class="flex flex-wrap gap-2 mb-4">
        <li v-for="id in values.specs || []" :key="id" class="flex items-center gap-2">
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ props.specs.find((s) => s.id === id)?.type.label }}:
            {{ props.specs.find((s) => s.id === id)?.value }}
          </span>
          <button
            type="button"
            @click="removeSpec(id)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </li>
      </ul>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            $t('product.form.specStep1')
          }}</label>
          <select
            v-model="selectedSpecType"
            @change="onSpecTypeChange"
            class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{{ $t('product.form.selectSpecType') }}</option>
            <option v-for="(_, typeLabel) in specsByType" :key="typeLabel" :value="typeLabel">
              {{ typeLabel }}
            </option>
          </select>
        </div>

        <div v-if="selectedSpecType">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            $t('product.form.specStep2')
          }}</label>
          <div class="flex gap-2">
            <select
              v-model="selectedSpecValue"
              class="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ $t('product.form.selectSpecValue') }}</option>
              <option
                v-for="spec in availableSpecValues"
                :key="spec.id"
                :value="spec.id"
                :disabled="values.specs?.includes(spec.id)"
              >
                {{ spec.value }}
              </option>
            </select>
            <button
              type="button"
              @click="addSpec"
              :disabled="!selectedSpecValue"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              {{ $t('common.add') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <FormField v-slot="{ componentField }" name="description" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>
          {{ $t('product.form.description') }}
          <InfoCard :title="$t('product.form.descriptionTips')" />
        </FormLabel>
        <FormControl>
          <Textarea
            v-bind="componentField"
            rows="8"
            :placeholder="$t('product.form.descriptionPlaceholder')"
          />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex gap-2 mt-2">
      <Button type="submit" size="lg" class="w-full">
        {{ $t('product.form.createProduct') }}
      </Button>
    </div>
  </form>
</template>

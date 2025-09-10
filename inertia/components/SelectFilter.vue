<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '~/lib/utils'
import SpecDto from '#dtos/spec'
import {
  IconCheckBox,
  IconCheckBoxOutlineBlank,
  IconSearchRounded,
  IconKeyboardArrowUp,
  IconDeleteForeverOutline
} from '@iconify-prerendered/vue-material-symbols'


const emit = defineEmits(['add', 'remove'])

const props = defineProps<{ specs: SpecDto[], selectedIds: number[], type: string, inline?: boolean }>()

const selectedSpecs = computed(() => {
  return props.specs?.filter((spec) => props.selectedIds.includes(spec.id))
})


const value = ref()

function handleClick(id: number) {
  if (props.selectedIds.includes(id)) {
    emit('remove', id)
    return
  }
  emit('add', id)
}
</script>


<template>
  <div :class="inline ? 'flex gap-2' : 'flex flex-col'">
    <Combobox v-model="value" by="label">
      <ComboboxAnchor class="w-full" as-child>
        <ComboboxTrigger as-child>
          <Button variant="outline" class="justify-between">
            {{ value?.label ?? `Select ${props.type}` }}

            <IconKeyboardArrowUp class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </ComboboxTrigger>
      </ComboboxAnchor>

      <ComboboxList>
        <div class="relative w-full max-w-sm items-center">
          <ComboboxInput class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10" placeholder="Search" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
            <IconSearchRounded class="size-4 text-muted-foreground" />
          </span>
        </div>

        <ComboboxEmpty>
          No {{ props.type }} found.
        </ComboboxEmpty>

        <ComboboxGroup>
          <ComboboxItem @click="handleClick(spec.id)" v-for="spec in specs" :key="spec.value" :value="spec">
            {{ spec.value }}
            <ComboboxItem>
              <IconCheckBox v-if="selectedIds.includes(spec.id)" :class="cn('ml-auto h-4 w-4')" />
              <IconCheckBoxOutlineBlank v-else :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItem>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </Combobox>
    <ul class="my-2 flex flex-wrap">
      <li v-for="spec in selectedSpecs" :key="spec">
        <button @click="handleClick(spec.id)" class="flex items-center">
          <p class="text-sm">{{ spec.value }}</p>
          <IconDeleteForeverOutline class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </li>
    </ul>
  </div>
</template>

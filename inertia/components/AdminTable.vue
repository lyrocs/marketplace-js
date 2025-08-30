<template>
    <div>
        <Form v-if="canCreate" @submit.prevent="createCategory"
            class="flex gap-2 mb-6 items-center bg-white rounded-lg p-2">
            <div v-for="col in columns" :key="col.key">
                <template v-if="col.editable === false">
                </template>
                <template v-else>
                    <div v-if="col.type === 'select'" class="flex flex-col">
                        <label :for="col.key" class="font-semibold">{{ col.label }}</label>
                        <Select v-model="createBuffer[col.key]">
                            <SelectTrigger>
                                <SelectValue :placeholder="`Select ${col.label}`" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="option in col.options" :key="option.id" :value="option.id">
                                        {{ option.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div v-else-if="col.type === 'array'">
                        <label :for="col.key" class="font-semibold">{{ col.label }}</label>
                        <TagsInput v-model="createBuffer[col.key]">
                            <TagsInputItem v-for="item in createBuffer[col.key]" :key="item" :value="item">
                                <TagsInputItemText />
                                <TagsInputItemDelete />
                            </TagsInputItem>

                            <TagsInputInput :placeholder="`${col.label}...`" />
                        </TagsInput>
                    </div>
                    <div v-else>
                        <label :for="col.key" class="font-semibold">{{ col.label }}</label>
                        <input v-model="createBuffer[col.key]" class="border px-2 py-1 rounded w-full" />
                    </div>
                </template>
            </div>
            <div class="flex flex-col self-end mb-1">
                <Button type="submit" class="bg-green-500 hover:bg-green-600">
                    <IconAdd class="h-6 w-6" /> Add
                </Button>
            </div>
        </Form>
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th v-for="col in columns" :key="col.key"
                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {{ col.label }}
                    </th>
                    <th class="px-6 py-3 bg-gray-50"></th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, rowIndex) in items" :key="rowIndex">
                    <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap">
                        <span v-if="!isEditing(rowIndex) || col.editable === false">
                            <template v-if="col.type === 'select'">
                                {{col.options.find(option => option.id === item[col.key])?.name}}
                            </template>
                            <template v-else-if="col.type === 'array'">
                                <Badge v-for="item in item[col.key]" :key="item" class="mr-2">{{ item }}</Badge>
                            </template>
                            <template v-else>
                                {{ item[col.key] }}
                            </template>
                        </span>
                        <Select v-else-if="col.type === 'select'" v-model="editBuffer[col.key]">
                            <SelectTrigger>
                                <SelectValue :placeholder="`Select ${col.label}`" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="option in col.options" :key="option.id" :value="option.id">
                                        {{ option.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <template v-else-if="col.type === 'array'">
                            <TagsInput v-model="editBuffer[col.key]">
                                <TagsInputItem v-for="item in editBuffer[col.key]" :key="item" :value="item">
                                    <TagsInputItemText />
                                    <TagsInputItemDelete />
                                </TagsInputItem>

                                <TagsInputInput :placeholder="`${col.label}...`" />
                            </TagsInput>
                        </template>
                        <input v-else v-model="editBuffer[col.key]" class="border px-2 py-1 rounded w-full" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu v-if="!isEditing(rowIndex)">
                            <DropdownMenuTrigger>
                                <IconMoreHoriz class="h-6 w-6" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem @click="startEdit(rowIndex, item)">Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="deleteItem(item)">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span v-else>
                            <Button @click="saveEdit(rowIndex)"
                                class="bg-green-500 hover:bg-green-600 mr-2">Save</Button>
                            <Button @click="cancelEdit" class="bg-gray-500 hover:bg-gray-600">Cancel</Button>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconAdd, IconMoreHoriz } from '@iconify-prerendered/vue-material-symbols'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
        // [{ key: 'name', label: 'Name', type: 'text', editable: true }, ...]
    },
    canCreate: {
        type: Boolean,
        required: false,
        default: true
    },
})
const emit = defineEmits(['update:item', 'create:item', 'delete:item'])
const editingRow = ref<number | null>(null)
const editBuffer = ref<any>({})
const createBuffer = ref<any>({})

function isEditing(rowIndex: number) {
    return editingRow.value === rowIndex;
}
function startEdit(rowIndex: number, item: any) {
    editingRow.value = rowIndex;
    editBuffer.value = { ...item };
}
function cancelEdit() {
    editingRow.value = null;
    editBuffer.value = {};
}
function saveEdit(rowIndex: number) {
    emit('update:item', { rowIndex, item: { ...editBuffer.value } });
    cancelEdit();
}
function createCategory() {
    emit('create:item', createBuffer.value)
    createBuffer.value = {}
}
function deleteItem(item: any) {
    emit('delete:item', item)
}

</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid #e5e7eb;
    padding: 8px;
}

th {
    background: #f9fafb;
}
</style>

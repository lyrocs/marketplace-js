<template>
    <div>
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
                        <select v-else-if="col.type === 'select'" v-model="editBuffer[col.key]"
                            class="select select-bordered">
                            <option v-for="option in col.options" :key="option.id" :value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
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
                        <Button v-if="!isEditing(rowIndex)" @click="startEdit(rowIndex, item)"
                            class="bg-blue-500 hover:bg-blue-600">Edit</Button>
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

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
        // [{ key: 'name', label: 'Name' }, ...]
    },
})
const emit = defineEmits(['update:item'])
const editingRow = ref<number | null>(null)
const editBuffer = ref<any>({})

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

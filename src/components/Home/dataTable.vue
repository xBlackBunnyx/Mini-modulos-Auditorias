<template>
    <v-row>
        <v-col md="10" sm="12">
            <!-- Data Table Header -->
            <v-card title="Auditorías" flat>
                <template v-slot:text>
                    <v-text-field
                        v-model="search"
                        label="Search"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        hide-details
                        single-line
                    ></v-text-field>
                </template>
                <!-- Refresh Button -->
                <div class="text-center mt-2 mb-4">
                    <v-btn
                        :disabled="loading"
                        prepend-icon="mdi-refresh"
                        rounded="lg"
                        text="Refrescar"
                        variant="text"
                        border
                        @click="onClick"
                    ></v-btn>
                </div>
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="serverItems"
                :items-length="totalItems"
                :loading="loading"
                item-value="name"
                :search="search"
                @update:options="loadItems"
            >
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            </v-data-table-server>
            </v-card>
        </v-col>
    </v-row>

</template>

<script setup>
import { ref, toRaw, computed, onMounted, shallowRef} from 'vue';
import getAudits from '@/services/getAudits.js';

const search = ref('');

const {audits, error, load} = getAudits();
const dataLoaded = ref(false);

const rawAuditData = computed(()=> {
        return audits.value ? toRaw(audits.value) : [];
    });

const headers =  ref (
                [
                    {title: "Nombre", align:"center", key:"name"},
                    {title: "Proceso", align:"center", key:"process"},
                    {title: "Estado", align:"center", key:"status"},
                    {title: "Progreso", align: "center", key:"progress"},
                    {title: "Responsable", align:"center", key:"owner.name"},
                    {title: "Deadline", key:"targetDate"},
                    {title: "Fecha creación",  key:"createdAt"}
                ]
            );

const FakeAPI = {
    async fetch ({page, itemsPerPage, sortBy}) {
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page -1) * itemsPerPage;
                const end = start + itemsPerPage;
                const items = [...rawAuditData.value];
                if (sortBy.length) {
                    const sortKey = sortBy[0].key;
                    const sortOrder = sortBy[0].order;
                    items.sort((a,b) => {
                        const aValue = a[sortKey];
                        const bValue = b[sortKey];
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
                    })
                }
                const paginated = items.slice(start, end)
                resolve({items: paginated, total: items.length})
            }, 500)
        })
    },
}

const itemsPerPage = ref (10);


const serverItems = ref([]);
const loading = shallowRef(false);
const totalItems = ref(0);

function loadItems ({page, itemsPerPage, sortBy}) {
    loading.value = true;
    FakeAPI.fetch({page, itemsPerPage, sortBy}).then(({items, total}) => {
        serverItems.value = items;
        totalItems.value = total;
        loading.value = false;
    }).catch(err => {
        console.error('Error in FakeAPI.fetch:', err);
        loading.value = false;
    });
}

function onClick() {
    loading.value = true;
    setTimeout(() => {
        loading.value = false
    }, 2000)
}

onMounted(async () => {
    await load();
    dataLoaded.value = true;
    loadItems({
        page:1,
        itemsPerPage: itemsPerPage.value,
        sortBy: []
    });
});

</script>
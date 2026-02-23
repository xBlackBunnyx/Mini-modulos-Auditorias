<template>
    <v-card flat>
        <!-- Data Table Header -->
        <v-card-title class="d-flex align-center pe-2" md="10" sm="12">
             Auditorías

             <!-- Filters -->
              <v-row class="ml-5" dense>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            v-model="filters.name"
                            label="Filtrar auditoría"
                            density="compact"
                            hide-details
                            clearable
                            @update:model-value="applyFilters"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            v-model="filters.owner"
                            label="Filtrar responsable"
                            density="compact"
                            hide-details
                            clearable
                            @update:model-value="applyFilters"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            v-model="filters.process"
                            :items="processOptions"
                            label="Filtrar proceso"
                            density="compact"
                            hide-details
                            clearable
                            @update:model-value="applyFilters"
                        ></v-text-field>
                    </v-col>
              </v-row>

                <!-- Refresh Button -->
                <div class="text-center pl-15">
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
            </v-card-title>

                <v-divider></v-divider>

            <!-- Data Table Content-->
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="serverItems"
                :items-length="filteredTotalItems"
                :loading="loading"
                loading-text="Cargando, por favor espere"
                :search="searchTrigger"
                item-value="name"
                @update:options="loadItems"
            >
                <!-- CRUD Actions -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <v-icon 
                            color="medium-emphasis" 
                            icon="mdi-pencil"
                            size="small"
                            @click="auditDetailPage(item.id)"
                        ></v-icon>
                        <v-icon
                            color="medium-emphasis"
                            icon="mdi-delete"
                            size="small"
                            @click="confirmDelete(item)"
                        ></v-icon>
                    </div>
                </template>
                <!-- Loading -->
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
            </v-data-table-server>
            <!-- Delete Confirmation -->
             <v-dialog v-model="deleteEntry" max-width="400px">
                <v-card>
                    <v-card-title class="text-h5"> Eliminar Auditoría</v-card-title>
                    <v-card-text>
                        ¿Estás seguro que deseas eliminar la auditoría "{{ itemToDelete?.name }}"?
                        Esta acción no se puede deshacer.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- Cancel -->
                        <v-btn
                            color="#26c9c9"
                            variant="text"
                            @click="deleteEntry = false"
                        > Cancelar</v-btn>
                        <!-- Delete -->
                        <v-btn
                            color="red-darken-1" 
                            variant="text"
                            @click="deleteItem"
                        > Eliminar</v-btn>
                    </v-card-actions>
                </v-card>
             </v-dialog>
            </v-card>
</template>

<script setup>
import { ref, toRaw, computed, onMounted, shallowRef, reactive, watch} from 'vue';
import getAudits from '@/services/getAudits.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const {audits, error, load} = getAudits();
const dataLoaded = ref(false);

const rawAuditData = computed(()=> {
        return audits.value ? toRaw(audits.value) : [];
    });


//Filtering
const filters = reactive({
    name:'',
    owner:'',
    process:'',
});

const searchTrigger = ref('');

const processOptions = ['Operaciones', 'Privacidad', 'RRHH', 'Seguridad', 'Ventas'];

const headers =  ref (
                [
                    {title: "Nombre", align:"center", key:"name"},
                    {title: "Proceso", align:"center", key:"process"},
                    {title: "Estado", align:"center", key:"status"},
                    {title: "Progreso", align: "center", key:"progress"},
                    {title: "Responsable", align:"center", key:"owner.name"},
                    {title: "Deadline", key:"targetDate"},
                    {title: "Fecha creación",  key:"createdAt"},
                    {title:'Acciones', key: 'actions', align:'end'}
                ]
            );

//Filter function
function filterData(items) {
    return items.filter(item => {
        if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        if (filters.owner && !item.owner?.name?.toLowerCase().includes(filters.owner.toLowerCase())) {
            return false;
        }
        if (filters.process && item.process !== filters.process) {
            return false;
        }
        return true;
    });
};

//Delete state
const deleteEntry = ref(false);
const itemToDelete = ref(null);


//Navigate to audit detail
function auditDetailPage(id) {
    router.push({
        name:'audit-detail',
        params: {id: id}
    });
}

//Confirm delete
function confirmDelete(item) {
    itemToDelete.value = item;
    deleteEntry.value = true;
}

//Delete item from database
async function deleteItem() {
    if (!itemToDelete.value) {
        return;
    }
    try {
        //Remove from JSON
        const response = await fetch(`http://localhost:3000/audits/${itemToDelete.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete audir');
        }
        //Remove from local array
        const index = audits.value.findIndex(audit => audit.id === itemToDelete.value.id);
        if (index !== -1) {
            audits.value.splice(index, 1);
        }
        //Close dialog
        deleteEntry.value = false;
        itemToDelete.value = null;

        //Refresh the current page
        loadItems({
            page:1,
            itemsPerPage: itemsPerPage.value,
            sortBy: []
        });
        
        alert('Auditoría eliminada exitosamente');

    } catch (error) {
        console.error('Failing deleting audir: ', error);
        alert('No se ha podido eliminar la auditoría');
    }
}

//getting the data from the "backend"
const FakeAPI = {
    async fetch ({page, itemsPerPage, sortBy, filters}) {
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page -1) * itemsPerPage;
                const end = start + itemsPerPage;
                let items = [...rawAuditData.value];

                //Apply filters
                items = filterData(items);

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
                resolve({items: paginated, total: items.length, filteredTotal: items.length})
            }, 500)
        })
    },
}

const itemsPerPage = ref (10);
const serverItems = ref([]);
const loading = shallowRef(false);
const totalItems = ref(0);
const filteredTotalItems = ref(0);

//function to load the items into the data table (with filters too)
function loadItems ({page, itemsPerPage, sortBy}) {
    loading.value = true;
    FakeAPI.fetch({page, itemsPerPage, sortBy, filters:{...filters}}).then(({items, total}) => {
        serverItems.value = items;
        totalItems.value = total;
        filteredTotalItems.value = total;
        loading.value = false;
    }).catch(err => {
        console.error('Error in FakeAPI.fetch:', err);
        loading.value = false;
    });
}

//Apply filters and reload data
function applyFilters() {
    searchTrigger.value = Date.now().toString();
    //reload with new filters
    loadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: []
    });
}

//watch for filter changes
watch(filters, () => {
    applyFilters();
}, {deep:true});

//Refresh general data
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
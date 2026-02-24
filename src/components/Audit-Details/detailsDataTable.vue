<template>
    <v-card flat class="pt-15">
        <!-- Header -->
        <v-card-title class="d-flex align-center justify-space-between" >
            <!-- Audit name -->
            <div class="text-h5">{{ audit?.name }}</div>
             <!-- Refresh Button -->
            <v-btn
                :disabled="loading"
                prepend-icon="mdi-refresh"
                rounded="lg"
                text="Refrescar"
                variant="text"
                border
                @click="onClick"
            ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Audit Data -->
            <v-card-text>
                <!-- Status -->
                <v-row>
                    <v-col cols="12" sm="4" md="3">
                        <div>Estado</div>
                        <v-chip
                            :color="getStatusColor(audit?.status)"
                            size="small"
                            class="mt-1"
                        >{{ audit?.status }}</v-chip>
                    </v-col>
                    <!-- Progress -->
                    <v-col cols="12" sm="4" md="3">
                        <div>Progreso</div>
                        <div class="d-flex align-center mt-1">
                            <v-progress-linear
                                v-model="auditProgress"
                                color="#26c9c9"
                                height="25"
                                rounded
                                class="mr-2"
                            >
                            <template v-slot:default="{value}">
                                <strong>{{ audit?.progress }}%</strong>
                            </template>
                        </v-progress-linear>
                        </div>
                    </v-col>
                        <!-- Owner-->
                            <v-col cols="12" sm="4" md="3">
                            <div>Responsable</div>
                            <div>{{ audit?.owner?.name }}</div>
                            </v-col>
                            <!-- Creation date -->
                            <v-col cols="12" sm="4" md="3">
                            <div>Fecha de creación</div>
                            <div>{{ formatingDate(audit?.createdAt) }}</div>
                            </v-col>
                            <!-- Deadline -->
                            <v-col cols="12" sm="4" md="3">
                            <div>Fecha límite</div>
                            <div>{{ formatingDate(audit?.targetDate) }}</div>
                            </v-col>
                            <!-- Last Update -->
                        <v-col cols="12" sm="4" md="3">
                            <div>Última actualización</div>
                            <div>{{ formatingDate(audit?.updatedAt) }}</div>
                        </v-col>
                </v-row>

            <v-divider></v-divider>

        <!-- Data Table Content-->
        <div>
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="checkHeaders"
                :items="checkItems"
                :items-length="totalCheckItems"
                :loading="checkLoading"
                loading-text="Cargando, por favor espere"
                @update:options="loadCheckItems"
            >

                <!-- Loading -->
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
            </v-data-table-server>
        </div>
            <v-card-actions>
                <!-- Execute Audit -->
                 <div>
                    <v-btn base-color="#26c9c9" @click="auditExecution">Ejecutar Auditoria</v-btn>
                 </div>
            </v-card-actions>
        </v-card-text>
    </v-card>   
</template>

<script setup>
import { ref,  computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';

const route = useRoute();

const audit = ref(null);
const rawChecksData = ref([]);
const loading = ref(false);
const checkLoading = ref(false);
const error = ref(null);
const execution = ref(null);

const itemsPerPage = ref (10);
const checkItems = ref([]);
const totalCheckItems = ref(0);

//Getting info from the selected audit
const auditID = computed(() => {
    const id = route.params.id;
    return id;
});
const auditProgress = computed(() => audit.value?.progress || 0);

const checkHeaders =  ref (
                [
                    {title: "Nombre", align:"center", key:"title"},
                    {title: "Prioridad", align:"center", key:"priority"},
                    {title: "Estado", align:"center", key:"status"},
                    {title: "Evidencias", align:"center", key:"evidence"},
                    {title: "Revisado", align:"center", key:"reviewed"},
                ]
            );

//Getting the status
function getStatusColor (status) {
    const colors = {
        'DRAFT': '#26c9c9',
        'IN_PROGRESS': 'info',
        'DONE': 'success',
        'BLOCKED': 'error'
    };
    return colors[status] || '#26c9c9';
}

//Formating the date
function formatingDate(dateString) { 
    if(!dateString) return '-';
    return format(new Date(dateString), 'yyyy/MM/dd HH:mm');
}

//Function that executes the auditory (WIP)
function auditExecution(){
    execution.value = true;
    setTimeout(() => {
        execution.value = false;
    }, 2000);
}

//getting the data from the "backend"
const checksFakeAPI = {
    async fetch ({page, itemsPerPage, sortBy}) {

        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page -1) * itemsPerPage;
                const end = start + itemsPerPage;
                let cItems = [...rawChecksData.value];

                if (sortBy.length) {
                    const sortKey = sortBy[0].key;
                    const sortOrder = sortBy[0].order;
                    cItems.sort((a,b) => {
                        const aValue = a[sortKey];
                        const bValue = b[sortKey];
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
                    })
                }
                const paginated = cItems.slice(start, end);

                resolve({items: paginated, total: cItems.length});
            }, 500)
        })
    },
}

//function to load the items into the data table
function loadCheckItems ({page, itemsPerPage, sortBy}) {

    checkLoading.value = true;
    checksFakeAPI.fetch({page, itemsPerPage, sortBy}).then(({items, total}) => {
        checkItems.value = items;
        totalCheckItems.value = total;
        checkLoading.value = false;

    }) .catch (err => {
        console.error('Error in FakeAPI.fetch:', err);
        checkLoading.value = false;
    });
}


// Audit info
async function loadAuditDetails() {
    try {
        const response = await fetch(`http://localhost:3000/audits/${auditID.value}`);
        if (!response.ok) throw new Error('Failed to load audit details');
        audit.value = await response.json();
    } catch (err) {
        error.value = 'Error al cargar los detalles de la auditoría';
        console.error(err);
    }
}

//Check info
async function loadChecksForAudit() {
    try {
        const response = await fetch('http://localhost:3000/checks');
        const allChecks = await response.json();

        if (Array.isArray(allChecks) && allChecks.length > 0){
            const checksData = allChecks[0]
           rawChecksData.value = checksData[auditID.value] || [];

        } else {
            rawChecksData.value = allChecks[auditID.value] || [];
        }
       
    } catch (err) {
        console.error('Error loading checks: ', err);
        rawChecksData.value = [];
    }
}


//Refresh general data
async function onClick() {
    loading.value = true;
    await loadAuditDetails();
    await loadChecksForAudit();
    await loadCheckItems({
        page:1,
        itemsPerPage: itemsPerPage.value,
        sortBy:[]
    });
    setTimeout(() => {
        loading.value = false
    }, 2000)
}

onMounted(async () => {
    loading.value = true;
    await loadAuditDetails();
    await loadChecksForAudit();
    await loadCheckItems({
        page:1,
        itemsPerPage: itemsPerPage.value,
        sortBy: []
    });
    loading.value = false;
});

</script>

<style scoped>
.v-data-table-server{
    width: 100%;
}
.v-card {
    width: 100%;
}

.v-card-text {
    width: 100%;
}
</style>
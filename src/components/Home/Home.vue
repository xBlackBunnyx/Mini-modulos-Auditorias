<template>
    <v-app>
        <v-main>
            <!-- Header -->
             <v-app-bar>
                <!-- Nav Button -->
                <template v-slot:prepend>
                    <v-app-bar-nav-icon
                        @click.stop="drawer = !drawer"
                    ></v-app-bar-nav-icon>
                </template>
                <!-- Header Title -->
                <v-app-bar-title>Listado de Auditorias</v-app-bar-title>
                <!-- Dark Mode Switch -->
                <template v-slot:append>
                    <v-switch 
                        v-model="darkMode"
                        :label="`Modo ${darkMode ? 'Oscuro' : 'Claro'}`" 
                        color="#26c9c9"
                        @change="toggleDarkMode()"
                        inset>
                    </v-switch>
                </template>
             </v-app-bar>

             <!-- Lateral Drawer w filters -->
              <v-navigation-drawer
                v-model="drawer"
                :location="$vuetify.display.mobile ? 'bottom' : undefined"
                temporary
              >

              <!-- Forms -->
                <v-row pa-3>
                    <v-col cols="auto" class="pa-3">
                        <forms
                            :existing-audits="audits"
                            :existing-owners="owners"
                            @audit-added="handleNewAudit"
                            @owner-created="handleNewOwner"
                        ></forms>
                    </v-col>
                </v-row>

              </v-navigation-drawer>

        </v-main>

            <!-- Data Table -->
                <v-row>
                    <v-col  class="pa-5">
                        <data-table></data-table>
                    </v-col>
                </v-row>
 
        
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { ref } from 'vue';
import DataTable from './dataTable.vue';
import Forms from '../Forms/Forms.vue';

const drawer = ref(false);

//Form Data
const audits = ref([]);
const owners = ref([]);

const loadData = async () => {
    const auditsResponse = await fetch('http://localhost:3000/audits');
    audits.value = await auditsResponse.json();

    const uniqueOwners = audits.value.map(
        audit => audit.owner
    ). filter((owner, index, self) => index === self.findIndex(o => o.id === owner.id));
    owners.value = uniqueOwners;
};

loadData();

const handleNewAudit = (newAudit) => {
    audits.value.push(newAudit);
};

const handleNewOwner = (newOwner) => {
    owners.value.push(newOwner);
};

//Dark Mode Option
const darkMode = ref(false);
const theme = useTheme();

const toggleDarkMode = () => {
    theme.global.name.value = darkMode.value ? "dark" : "light";
}

</script>
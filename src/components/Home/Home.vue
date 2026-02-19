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
                <!-- Filters -->

              </v-navigation-drawer>

        </v-main>

        <!-- Data Table -->
         <v-layout row wrap>
            <v-flex md8>
                <data-table></data-table>
            </v-flex>
         </v-layout>
        
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { ref } from 'vue';
import DataTable from './dataTable.vue';

const darkMode = ref(false);
const theme = useTheme();
const drawer = ref(false);



const toggleDarkMode = () => {
    theme.global.name.value = darkMode.value ? "dark" : "light";
}

</script>
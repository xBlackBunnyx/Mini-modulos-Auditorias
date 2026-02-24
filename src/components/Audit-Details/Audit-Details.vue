<template>
    <v-container>
            <v-app-bar>
                <!-- Header Title -->
                <v-app-bar-title>Detalles de la Auditoría</v-app-bar-title>
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
    <!-- Audits Details Data Table -->
        <v-row style="height: 400px;">
            <v-col cols="auto" class="ma-3 pa-5">
                <DetailsDataTable></DetailsDataTable>
            </v-col>
                    <!-- Return Button -->
         <v-row class="ma-5 pa-5">
            <v-col cols="auto">
                <v-btn color="#E23E54" @click="$router.go(-1)">Menú principal</v-btn>
            </v-col>
         </v-row>
         </v-row>
    </v-container>
</template>

<script setup>
import DetailsDataTable from './detailsDataTable.vue';
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';

const router = useRouter();

//Dark Mode Option
const darkMode = ref(false);
const theme = useTheme();

const toggleDarkMode = () => {
    theme.global.name.value = darkMode.value ? "dark" : "light";
}
</script>
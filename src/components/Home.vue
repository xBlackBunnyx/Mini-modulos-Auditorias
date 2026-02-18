<template>
    <v-app>
        <v-main class="theme">
            <h1>Listado de Auditorias</h1>
            <!-- <v-container>
                <v-btn 
                    @click="theme.toggle()"
                    text="Modo Claro/Oscuro"
                ></v-btn>
            </v-container> -->
        </v-main>
        
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
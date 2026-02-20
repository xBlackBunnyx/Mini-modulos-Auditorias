<template>
    <!-- Button -->
    <v-dialog max-width="600px">
        <template v-slot:activator="{props:activatorProps}">
            <v-btn flat v-bind="activatorProps" color="#26c9c9">
            Nueva Auditoria
        </v-btn>
        </template>
       
        <v-card>
            <!-- Header -->
            <v-card-title>
                <h2>Añada una Nueva Auditoria</h2>
            </v-card-title>
                    <!-- Body -->
        <v-card-text>
            <v-form class="px-3" ref="form">
                <!-- Form Data -->
                <v-text-field label="Nombre de la Auditoría" v-model="name"  :rules="inputRules"></v-text-field>

                <!-- Date Picker -->
                <v-menu v-model="menu" :close-on-content-click="false">
                    <template v-slot:activator="{props}">
                        <v-text-field 
                            v-model="formattedDate" 
                            v-bind="props" 
                            label="Deadline" 
                            readonly
                            :rules="inputRules"
                            ></v-text-field>
                    </template>
                    <v-date-picker v-model="targetDate" @update:model-value="menu = false"></v-date-picker>
                </v-menu>

                <!-- Adding button -->
                 <v-btn flat class="mt-3" color="#26c9c9" @click="submit">Añadir Auditoria</v-btn>
            </v-form>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { format} from 'date-fns';

export default {
    name:'Forms',
    data () {
        return {
            name:'',
            targetDate: null,
            menu: false,
            inputRules:[
                v => v.length >= 3 || 'El valor mínimo son 3 caracteres'
            ]
        }
    },
    methods: {
        submit() {
            if (this.$refs.form.validate()){
                console.log(this.name, this.targetDate)
            }
            
        }
    },
    computed: {
        formattedDate() {
            return this.targetDate ? format(new Date(this.targetDate), 'yyyy-MM-dd') : ''
        }
    }
}
</script>
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
                 <!-- Text fields -->
                <v-text-field 
                    label="Nombre de la Auditoría" 
                    v-model="state.name"  
                    :error-messages="v$.name.$errors.map(e => e.$message)"
                    required
                    @blur="v$.name.$touch"
                    @input="v$.name.$touch"
                    ></v-text-field>

                <v-text-field 
                    label="Responsable" 
                    v-model="state.owner" 
                    :error-messages="v$.owner.$errors.map(e => e.$message)"
                    required
                    @blur="v$.owner.$touch"
                    @input="v$.owner.$touch"
                    ></v-text-field>

                <!-- Process Selection -->
                <v-container>
                    <v-select 
                        v-model="state.select" 
                        :items="items" 
                        :error-messages="v$.select.$errors.map(e => e.$message)"
                        label="Proceso"
                        required
                        @blur="v$.select.$touch"
                        @input="v$.select.$touch"
                        >
                        <template v-slot:item="{props, item}">
                            <v-list-item v-bind="props" :title="null">
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-container>
                <!-- Date Picker -->
                <v-menu v-model="menu" :close-on-content-click="false">
                    <template v-slot:activator="{props}">
                        <v-text-field 
                            v-model="formattedDate" 
                            v-bind="props" 
                            label="Deadline" 
                            required
                            readonly
                            :error-messages="v$.targetDate.$errors.map(e => e.$message)"
                            @blur="v$.targetDate.$touch"
                            ></v-text-field>
                    </template>
                    <v-date-picker v-model="state.targetDate" @update:model-value="menu = false"></v-date-picker>
                </v-menu>

                <!-- Adding button -->
                 <v-btn 
                    flat 
                    class="mt-3" 
                    color="#26c9c9" 
                    @click="v$.$validate">Añadir Auditoria</v-btn>
            </v-form>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { format} from 'date-fns';
import { computed, ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators';

const items = [
            {title: 'Operaciones'},
            {title: 'Privacidad'},
            {title: 'RRHH'},
            {title: 'Seguridad'},
            {title: 'Ventas'},
        ];

    const initialState = {
        name:'',
        owner: '',
        select: null,
        targetDate: null,
    };

    const state = reactive({
        ...initialState,
    });

   const formattedDate = computed( {
        get: () => {
            return state.targetDate ? format(new Date(state.targetDate), 'yyyy-MM-dd') : '';
        },
        set: (value) => {}
            
        });


    const rules = {
        name: {required},
        owner: {required},
        select: {required},
        targetDate: {required},
    };

    const v$ = useVuelidate(rules,state);

        // const targetDate = ref(null);
        const menu = ref(false);
    
    
        const inputRulesText =[
                v => v.length >= 3 || 'El valor mínimo son 3 caracteres'
            ];


        
    // function submit() {
    //         if (this.$refs.form.validate()){
    //             console.log(this.name, this.targetDate)
    //         }
    //     }

 
</script>
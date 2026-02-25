<template>
    <!-- Button -->
    <v-dialog max-width="600px" v-model="dialogForm">
        <template v-slot:activator="{props:activatorProps}">
            <v-btn flat v-bind="activatorProps" color="#26c9c9">
            Ejecutar Auditoría
        </v-btn>
        </template>
       
        <v-card>
            <!-- Header -->
            <v-card-title>
                <h2>Nuevo check</h2>
            </v-card-title>
            <!-- Body -->
        <v-card-text>
            <!-- Form Data -->
            <v-form class="px-3" ref="form" v-model="isFormValid" @submit.prevent="submit">
                
                 <!-- Title -->
                <v-text-field 
                    label="Título" 
                    v-model="name"  
                    :error-messages="v$.name.$errors.map(e => e.$message)"
                    required
                    @blur="v$.name.$touch"
                    @input="v$.name.$touch"
                    ></v-text-field>
                <!-- Priority -->
                <v-container>
                    <v-select
                        label="Prioridad" 
                        v-model="priority" 
                        :items="priorities"
                        :error-messages="v$.priority.$errors.map(e => e.$message)"
                        required
                        @blur="v$.priority.$touch"
                        @input="v$.priority.$touch"
                    >
                    </v-select>
                </v-container>
                <!-- Status -->
                <v-container>
                    <v-select 
                        v-model="status" 
                        :items="statusList" 
                        :error-messages="v$.status.$errors.map(e => e.$message)"
                        label="Estado"
                        required
                        @blur="v$.status.$touch"
                        @input="v$.status.$touch"
                        >
                    </v-select>
                </v-container>

            <!-- Evidences -->
                <v-file-input label="Evidencias" v-model="evidence">
                </v-file-input>

                <!-- Reviewed -->
                <v-checkbox label="Revisado" v-model="checkbox"></v-checkbox>

                <v-card-actions class="px-0">
                    <v-spacer></v-spacer>
                     <!-- Adding button -->
                 <v-btn 
                    flat 
                    class="mt-3" 
                    color="#26c9c9" 
                    @click="submit">Añadir Auditoría</v-btn>

                    <!-- Cancel Button -->
                     <v-btn
                            color="red-darken-1" 
                            variant="text"
                            @click="cancelForm"
                        > Cancelar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref} from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators';

//Cancel the form
const dialogForm = ref(false);

function cancelForm(){
    resetForm();
    dialogForm.value = false;
};

function resetForm (){
   name.value = '';
    priority.value = null;
    status.value = null;
    evidence.value = null;
    checkbox.value = false;
    v$.value.$reset();
    console.log('Form reset complete');
}

const priorities = [ 'LOW',  'MEDIUM', 'HIGH'];

const statusList = [ 'PENDING', 'QUEUED', 'RUNNING','OK', 'KO'];

    //Original State of the Form values
    const name = ref('');
    const priority = ref(null);
    const status = ref(null);
    const evidence = ref(null);
    const checkbox = ref(false);

    const formState = computed(() => ({
        name: name.value,
        priority: priority.value,
        status: status.value,
        evidence:evidence.value,
        checkbox: checkbox.value,
    }));

    //Validation checks
    const isFormValid = ref(false);

    const rules = {
        name: {required},
        priority: {required},
        status: {required},
    };

    const v$ = useVuelidate(rules,formState);

       //Setting the IDs
    const IDs = defineProps({
        auditID: {
            type: String,
            required: true
        }
    });

    const emit = defineEmits(['check-added']);


    async function submit() {
          await  v$.value.$validate();

            if (isFormValid.value) {
                try {

                    if (!IDs.auditID) {
                        throw new Error('auditID is undefined');
                    }

                    const response = await fetch('http://localhost:3000/checks');
                    const allChecks = await response.json();
                    const checkObjects = allChecks[0];

                if (!checkObjects[IDs.auditID]){
                    console.log(`Audit ${IDs.auditID} doesn't exist in checks, creating it...`);
                    checkObjects[IDs.auditID] = [];
                }
                
                let maxNumber = 0;
                Object.keys(checkObjects).forEach(key => {
                        const checks = checkObjects[key] || [];
                        checks.forEach(check => {
                            const match = check.id?.match(/chk_(\d+)$/);
                            if (match){
                                maxNumber = Math.max(maxNumber, parseInt(match[1]));
                            }
                        });
                });

                    const newID = maxNumber === 0 ? `chk_1` : `chk_${maxNumber + 1}`;

                const newCheck = {
                    id: newID,
                    title: name.value,
                    priority: priority.value,
                    status: status.value,
                    evidence: evidence.value ? evidence.value.name : '',
                    reviewed: checkbox.value,
                    updatedAt: new Date().toISOString(),
                };

                    const currentChecks = checkObjects[IDs.auditID] || [];
                    const updateObject = {
                        [IDs.auditID] : [...currentChecks, newCheck]
                    };


                    const setResponse = await fetch('http://localhost:3000/checks', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updateObject)
                        });

                            if (!setResponse.ok) {
                                const errorText = await setResponse.text();
                                throw new Error(`Failed to save: ${setResponse.status} : ${errorText}`);
                            }


                    emit('check-added', {
                        auditID: IDs.auditID,
                        check: newCheck
                    });

                    //Reset form
                    resetForm();
                    dialogForm.value = false;

                    alert('Se ha guardado la auditoria');

                } catch (error) {
                    console.log('Error saving the check: ', error);
                    alert('No se ha podido guardar la auditoría');
                }
            }
    }

</script>
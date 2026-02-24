<template>
    <!-- Button -->
    <v-dialog max-width="600px" v-model="dialogForm">
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
            <!-- Form Data -->
            <v-form class="px-3" ref="form" v-model="isFormValid" @submit.prevent="submit">
                
                 <!-- Text fields -->
                <v-text-field 
                    label="Nombre de la Auditoría" 
                    v-model="name"  
                    :error-messages="v$.name.$errors.map(e => e.$message)"
                    required
                    @blur="v$.name.$touch"
                    @input="v$.name.$touch"
                    ></v-text-field>

                <v-text-field 
                    label="Responsable" 
                    v-model="owner" 
                    :error-messages="v$.owner.$errors.map(e => e.$message)"
                    required
                    @blur="v$.owner.$touch"
                    @input="v$.owner.$touch"
                    ></v-text-field>

                <!-- Process Selection -->
                <v-container>
                    <v-select 
                        v-model="select" 
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

            <!-- Template Selection -->
                <v-container>
                    <v-select 
                        v-model="template" 
                        :items="templates" 
                        :error-messages="v$.template.$errors.map(e => e.$message)"
                        label="Modelo"
                        required
                        @blur="v$.template.$touch"
                        @input="v$.template.$touch"
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
                    <v-date-picker v-model="targetDate" @update:model-value="menu = false"></v-date-picker>
                </v-menu>

                <v-card-actions class="px-0">
                    <v-spacer></v-spacer>
                     <!-- Adding button -->
                 <v-btn 
                    flat 
                    class="mt-3" 
                    color="#26c9c9" 
                    @click="submit">Añadir Auditoria</v-btn>

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
import { format} from 'date-fns';
import { computed, ref} from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

//Cancel the form
const dialogForm = ref(false);

function cancelForm(){
    resetForm();
    dialogForm.value = false;
};

function resetForm (){
   name.value = '';
    owner.value = '';
    targetDate.value = null;
    select.value = null;
    template.value = null;
    if (v$.value){
        v$.value.$reset();
    };
    console.log('Form reset complete');
}

const items = [
            {title: 'Operaciones'},
            {title: 'Privacidad'},
            {title: 'RRHH'},
            {title: 'Seguridad'},
            {title: 'Ventas'},
        ];

const templates = [
    {title: 'mdl_1'},
    {title: 'mdl_2'},
    {title:'mdl_3'},
    {title:'mdl_4'},
    {title:'mdl_5'},
    {title:'mdl_6'},
    {title:'mdl_7'},
];

    //Original State of the Form values
    const name = ref('');
    const owner = ref('');
    const select = ref(null);
    const template =ref(null);
    const targetDate = ref(null);
    const menu = ref(false);

    const formState = computed(() => ({
        name: name.value,
        owner: owner.value,
        select: select.value,
        template:template.value,
        targetDate: targetDate.value,
    }));

    //change the date format for display
   const formattedDate = computed( {
        get: () => {
            return targetDate.value ? format(new Date(targetDate.value), 'yyyy-MM-dd') : '';
        },
        set: (value => {})
        });

    //Validation checks
    const isFormValid = ref(false);

    const rules = {
        name: {required},
        owner: {required},
        select: {required},
        template: {required},
        targetDate: {required},
    };

    const v$ = useVuelidate(rules,formState);

       //Setting the IDs
    const IDs = defineProps({
        existingAudits: {
            type: Array,
            default: () => []
        },
        existingOwners: {
            type: Array,
            default: () => []
        }
    });

    const emit = defineEmits(['audit-added', 'owner-created']);

    const router = useRouter();

    //Create the Audit ID
    function generateAuditID() {
        if (!IDs.existingAudits || IDs.existingAudits.length === 0){
            return 'aud_1';
        }
        //Getting the ID of the last audit
        const auditNumbers = IDs.existingAudits.map(
            audit => {
                const match = audit.id?.match(/^aud_(\d+)$/);
                return match ? parseInt(match[1]) : 0;
            }
        ).filter(num => !isNaN(num));

        const maxNumber = Math.max(...auditNumbers, 0);
        return`aud_${maxNumber + 1}`;
    }

    //Create a new owner ID 
    function generateOwnerID() {
        if (!IDs.existingOwners || IDs.existingOwners.length === 0) {
            return 'u_1';
        }
        const ownerNumbers = IDs.existingOwners.map(
            owner => {
                const match = owner.id?.match(/^u_(\d+)$/);
                return match ? parseInt(match[1]) : 0;
            }
        ).filter(num => !isNaN(num));
        
        const maxNumber = Math.max(...ownerNumbers, 0);
        return `u_${maxNumber + 1}`;
    }

    //Checking that the owner exists and if it doesn't add the new ID
    function getOwner() {
        console.log('getOwnerObject called with owner.value:', owner.value);
         console.log('existingOwners:', IDs.existingOwners);
        if (!owner.value) {
            return null};

        const alreadyOwner = IDs.existingOwners?.find(
            o => o.name.toLowerCase() === owner.value.toLowerCase()
        );
        if (alreadyOwner) {
            return {
                id:alreadyOwner.id,
                name: alreadyOwner.name
            };
        }
        // Add the new id to the new Owner
        const newOwner = {
            id: generateOwnerID(),
            name: owner.value
        };
        
        emit('owner-created', newOwner);

        return newOwner;
    }
        
    async function submit() {
          await  v$.value.$validate();

          const ownerIDName = getOwner();

            const newAudit = {
                id: generateAuditID(),
                name: name.value,
                process: select.value?.title || select.value,
                status: "DRAFT",
                progress: 0,
                owner: ownerIDName,
                targetDate: formattedDate.value,
                createdAt: new Date().toISOString(),
                templateId: template.value?.title || template.value
            };

            console.log('New audit to save: ', newAudit);

            if (isFormValid.value) {
                try {
                    const response = await fetch('http://localhost:3000/audits', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newAudit)
                    });
                    if (!response.ok) {
                        throw new Error('Failed to save');
                    }
                    const savedAudit = await response.json();
                    console.log('Audit saved successfully: ', savedAudit);

                    emit('audit-added', savedAudit);

                    //Reset form
                    name.value = '';
                    owner.value = '';
                    targetDate.value = null;
                    select.value = null;
                    template.value = null;

                    v$.value.$reset();

                    alert('Se ha guardado la auditoria');

                    router.push({name: 'audit-detail', params: {id: savedAudit.id}});
                } catch (error) {
                    console.log('Error saving the audit: ', error);
                    alert('No se ha podido guardar la auditoría');
                }
            }
        }

 
</script>
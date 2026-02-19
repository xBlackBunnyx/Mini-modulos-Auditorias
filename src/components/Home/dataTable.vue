<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="audits"
        >
            <!-- <template slot="items" slot-scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.process }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>{{ props.item.progress }}</td>
                    <td>{{ props.item.owner.name }}</td>
                    <td>{{ props.item.targetDate }}</td>
                    <td>{{ props.item.createdAt }}</td>
            </template> -->
        </v-data-table>

    </div>
</template>

<script>
    import * as audits from '../../data/Audits.json';
    export  default {
        data() {
            return{
                audits:Object.create(null),
                audits: {...audits}
            }
        },
        computed: {
            headers(){
                return [
                    {text: "Nombre", align:"center", value:"name"},
                    {text: "Proceso", align:"center", value:"process"},
                    {text: "Estado", align:"center", value:"status"},
                    {text: "Progreso", value:"progress"},
                    {text: "Responsable", align:"center", value:"owner.name"},
                    {text: "Deadline", value:"targetDate"},
                    {text: "Fecha creación",  value:"createdAt"}
                ]
            }
        }
    }
</script>
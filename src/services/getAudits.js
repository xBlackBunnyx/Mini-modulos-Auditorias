import { ref } from "vue";

function getAudits() {
    const audits = ref(null);
    const error = ref(null);
    const load = async () => {
        try {
            let data = await fetch ('http://localhost:3000/audits')
            if (!data.ok) {
                throw Error('Failed to get the data')
            }
            audits.value = await data.json()
        } catch (err) {
            error.value = err.message
            console.log(error.value)
        }
    }
    return {audits, error, load}
}

export default getAudits
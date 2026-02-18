import { createApp } from 'vue'

//Vuetify libraries
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//Components
import App from './App.vue'
import router from './routes.js'

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.mount('#app')

import { createApp } from 'vue'
import DatTable from './components/DataTable.vue'
import './index.css'
import PrimeVue from 'primevue/config';

const app = createApp(DatTable)

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

app.use(PrimeVue).mount('#app')


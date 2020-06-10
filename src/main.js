import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import isValidNumber from './plugins/isValidNumber.js'

Vue.prototype.$isValidNumber = isValidNumber
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  methods: {
    numberRule(str) {
      if (
        str &&
        !!("" + str).trim() &&
        !isNaN(parseFloat(str)) &&
        Number(str) >= 0
      )
        return true;
      return "Veuillez entrer un nombre positif";
    }
  },
}).$mount('#app')
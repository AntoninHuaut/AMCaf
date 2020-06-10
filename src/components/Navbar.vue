<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="AMCaf Logo"
        class="shrink mr-2"
        contain
        src="/favicon.ico"
        transition="scale-transition"
        width="40"
      />

      <router-link class="ml-5 mr-3" to="/" tag="button">
        <span class="white--text title font-weight-regular">Configuration</span>
      </router-link>

      <router-link class="ml-5 mr-3" to="/calculTaux" tag="button">
        <span class="white--text title font-weight-regular">Calcul de taux</span>
      </router-link>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    routeName: undefined
  }),
  mounted() {
    this.setRouteName();
  },
  watch: {
    $route: function() {
      this.setRouteName();
    }
  },
  methods: {
    setRouteName() {
      this.routeName = this.$router.history.current.name;
    }
  }
};
</script>
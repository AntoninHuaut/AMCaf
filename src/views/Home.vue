<template>
  <v-container fluid class="text-center">
    <v-snackbar color="error" v-model="snackbarError">
      Une erreur est survenue pendant la récupération des données
      <v-btn text @click="snackbarError = false;">Fermer</v-btn>
    </v-snackbar>

    <v-snackbar
      color="success"
      top
      :timeout="750"
      v-model="snackbarParamSave"
    >Paramètres sauvegardées</v-snackbar>

    <v-col class="mx-auto mb-5" :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '': '6'">
      <div class="mb-5">
        <div class="display-1">Configuration :</div>
        <div
          class="font-italic font-weight-light"
        >Assurez-vous que les paramètres indiquées sont encore valides à chaque utilisation de l'application</div>
      </div>

      <v-form>
        <v-text-field
          :rules="[ruleNumber]"
          v-model="config.netToBrut"
          label="Taux conversion net » brut"
          required
        ></v-text-field>
        <v-text-field
          :rules="[ruleNumber]"
          v-model="config.tauxNetCaf"
          label="Taux net CAF journalier"
          required
        ></v-text-field>

        <v-btn color="warning" @click="resetVars">Réinitialiser</v-btn>
      </v-form>
    </v-col>

    <v-col align="center">
      <v-alert
        outlined
        type="error"
        elevation="2"
        max-width="500"
        v-if="invalidParam"
      >Des paramètres sont incorrectes</v-alert>

      <v-alert
        outlined
        type="warning"
        elevation="2"
        max-width="500"
        v-if="!useDefaultConfig()"
      >Vous n'utilisez pas la configuration par défaut</v-alert>

      <v-alert outlined type="info" elevation="2" max-width="500">
        <div v-if="useDefaultConfig()">Vous utilisez la configuration par défaut</div>
        <div class="mt-1">Dernière MAJ des données par défaut : {{defaultConfig.lastUpdate}}</div>
      </v-alert>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: "Home",
      loading: true,
      snackbarError: false,
      snackbarParamSave: false,
      invalidParam: false,
      defaultConfig: {},
      config: {}
    };
  },
  methods: {
    resetVars() {
      this.config = JSON.parse(JSON.stringify(this.defaultConfig)); // Clone
    },
    initVars() {
      try {
        this.config = JSON.parse(localStorage.amcafConfig);
      } catch {
        this.resetVars();
      }
    },
    setLocalStorage() {
      if (!this.loading) this.snackbarParamSave = true;
      localStorage.amcafConfig = JSON.stringify(this.config);
    },
    useDefaultConfig() {
      const configProps = Object.keys(this.config);
      const defaultConfigProps = Object.keys(this.defaultConfig);

      if (configProps.length != defaultConfigProps.length) return false;

      for (let i = 0; i < configProps.length; i++) {
        const propName = configProps[i];
        if (this.config[propName] != this.defaultConfig[propName]) return false;
      }

      return true;
    },
    ruleNumber(str) {
      return this.$isValidNumber(str) ? true : "Veuillez entrer un nombre >= 0";
    }
  },
  mounted() {
    fetch(`/defaultConfig.json`)
      .then(res => res.json())
      .then(defaultConfig => {
        this.defaultConfig = defaultConfig;

        this.initVars();
      })
      .catch(err => {
        console.log(err);
        this.snackbarError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  watch: {
    config: {
      handler: function(newValue) {
        const res = [
          this.$isValidNumber(newValue.netToBrut),
          this.$isValidNumber(newValue.tauxNetCaf)
        ].filter(key => key !== true).length;

        if (res == 0) this.setLocalStorage();
      },
      deep: true
    }
  }
};
</script>

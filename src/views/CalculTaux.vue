<template>
  <v-container fluid class="text-center">
    <v-col
      class="mx-auto pb-0 mb-0"
      :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '': '6'"
    >
      <div class="display-1">Paramètres du calcul :</div>
      <v-row justify="space-between">
        <v-col class="mb-0 pb-0" cols="12" md="4">
          <v-text-field
            v-model="config.netToBrut"
            label="Taux conversion net » brut"
            readonly
            filled
          ></v-text-field>
        </v-col>

        <v-col class="mb-0 pb-0" cols="12" md="4">
          <v-text-field v-model="config.tauxNetCaf" label="Taux net CAF journalier" readonly filled></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <router-link to="/" tag="button">
            <v-btn color="info" dark>Modifier</v-btn>
          </router-link>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-col>

    <v-col
      class="mx-auto mt-1 mb-5"
      :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm  ? '': '6'"
    >
      <div class="mb-5">
        <div class="headline">Calcul de taux :</div>
      </div>

      <v-form>
        <v-row>
          <v-col class="pl-2 pr-2 mb-0 pb-0" :cols="$vuetify.breakpoint.xs ? '12': '4'">
            <v-text-field
              :rules="[ruleNumber]"
              v-model="calcul.nbDayWeek"
              label="Nombre de jour/semaine"
              required
            ></v-text-field>
          </v-col>

          <v-col class="pl-2 pr-2 mb-0 pb-0" :cols="$vuetify.breakpoint.xs ? '12': '4'">
            <v-text-field
              :rules="[ruleNumber]"
              v-model="calcul.nbHourWeek"
              label="Nombre d'heure/semaine"
              class="formLabel"
              required
            ></v-text-field>
          </v-col>

          <v-col class="pl-2 pr-2 mb-0 pb-0" :cols="$vuetify.breakpoint.xs ? '12': '4'">
            <v-text-field
              :rules="[ruleNumber]"
              v-model="calcul.nbWeekYear"
              label="Nombre de semaine/an"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col
      class="mx-auto pb-0 mb-0"
      :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '': '6'"
    >
      <v-card class="mx-auto text-left mb-3" elevation="6" shaped>
        <v-card-title class="headline">Résultat :</v-card-title>
        <v-card-subtitle class="result pt-0 pb-1">
          Nombre de jour à déclarer à la CAF tous les mois :
          <span
            class="title green--text"
          >{{ nbDayWeekReportCAF }}</span>
        </v-card-subtitle>

        <v-card-subtitle class="result pt-0 pb-1">
          Taux/h net de la CAF à ne pas dépasser :
          <span
            class="title green--text"
          >{{ maxTauxNetCAF }}</span>
        </v-card-subtitle>

        <v-card-subtitle class="result pt-0 pb-3">
          Taux/h brut de la CAF à ne pas dépasser :
          <span
            class="title green--text"
          >{{ maxTauxBrutCAF }}</span>
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      config: {},
      calcul: {
        nbDayWeek: undefined,
        nbHourWeek: undefined,
        nbWeekYear: undefined
      },
      nbDayWeekReportCAF: "En attente",
      maxTauxNetCAF: "En attente",
      maxTauxBrutCAF: "En attente"
    };
  },
  methods: {
    async updateCalcul() {
      if (!this.isFormValid()) {
        this.nbDayWeekReportCAF = "En attente";
        this.maxTauxNetCAF = "En attente";
        this.maxTauxBrutCAF = "En attente";
        return;
      }

      localStorage.amcafnbDayWeek = this.calcul.nbDayWeek;
      localStorage.amcafnbHourWeek = this.calcul.nbHourWeek;
      localStorage.amcafnbWeekYear = this.calcul.nbWeekYear;

      const nbHAn = this.calcul.nbWeekYear * this.calcul.nbHourWeek;
      const nbHMois = nbHAn / 12;

      const nbDayWeekReportCAF = Math.ceil(
        (this.calcul.nbDayWeek * this.calcul.nbWeekYear) / 12
      );

      const maxTauxNetCAF = (
        (nbDayWeekReportCAF * this.config.tauxNetCaf) /
        nbHMois
      ).toFixed(2);

      const maxTauxBrutCAF = (maxTauxNetCAF / this.config.netToBrut).toFixed(2);

      this.nbDayWeekReportCAF = nbDayWeekReportCAF + " jour(s)";
      this.maxTauxNetCAF = maxTauxNetCAF + " €/h";
      this.maxTauxBrutCAF = maxTauxBrutCAF + " €/h";
    },
    initVars() {
      try {
        this.config = JSON.parse(localStorage.amcafConfig);
      } catch {
        this.$router.push({ path: "/" });
      }
    },
    isFormValid() {
      return (
        this.$isValidNumber(this.calcul.nbDayWeek) &&
        this.$isValidNumber(this.calcul.nbHourWeek) &&
        this.$isValidNumber(this.calcul.nbWeekYear)
      );
    },
    ruleNumber(str) {
      return this.$isValidNumber(str) ? true : "Veuillez entrer un nombre >= 0";
    }
  },
  mounted() {
    this.initVars();
    this.calcul.nbDayWeek = localStorage.amcafnbDayWeek || 0;
    this.calcul.nbHourWeek = localStorage.amcafnbHourWeek || 0;
    this.calcul.nbWeekYear = localStorage.amcafnbWeekYear || 0;
  },
  watch: {
    calcul: {
      handler: function() {
        this.updateCalcul();
      },
      deep: true
    }
  }
};
</script>

<style>
label,
.result {
  font-size: 18px !important;
}
</style>
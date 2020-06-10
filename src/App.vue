<template>
  <v-app>
    <Navbar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",
  components: { Footer, Navbar }
};
</script>
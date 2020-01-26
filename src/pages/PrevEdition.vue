<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="editions" :search="search"></v-data-table>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mode_exact} from '@/fonctions'
export default {
  props: {
    header: {
      type: String,
      default: require("../assets/img/can_login_background.jpeg")
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  created() {
    this.getEdition();
  },
  bodyClass: "login-page",
  data() {
    return {
      search: "",
      editions: [],
      headers: [
        {
          text: "Nom de l'edition",
          align: "left",
          filterable: true,
          value: "name"
        },
        { text: "Nombre d'equipe", value: "nombre_participant" },
        { text: "Slogan", value: "slogan" },
        { text: "Date de debut", value: "date_debut" },
        { text: "Date de fin", value: "date_fin" },
        { text: "Encour", value: "is_end" }
      ]
    };
  },
  methods: {
    getEdition() {
      this.$axios.get("/api/edition").then(({ data }) => {
        if (data.length) {
          for (let e of data) {
            e.is_end = e.is_end ? "Fini" : "Encour";
            e.date_debut = mode_exact(e.date_debut);
            e.date_fin = mode_exact(e.date_fin);
            this.editions.push(e);
          }
        }
      });
    }
  }
};
</script>

<style>
</style>
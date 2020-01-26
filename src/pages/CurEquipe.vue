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
import { mode_exact } from "@/fonctions";
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
          text: "Equipes",
          align: "left",
          filterable: true,
          value: "name"
        },
        {
          text: "Pays",
          align: "left",
          filterable: true,
          value: "pays"
        },
        {
          text: "Ville",
          align: "left",
          filterable: true,
          value: "ville"
        },
        {
          text: "Coach",
          align: "left",
          filterable: true,
          value: "coach"
        }
      ]
    };
  },
  methods: {
    getEdition() {
      this.$axios.get("/api/equipe").then(({ data }) => {
        if (data.length) {
          for (let e of data) {
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
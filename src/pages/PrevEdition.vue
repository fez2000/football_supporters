<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle"></div>
    <div class="main main-raised">
      <div class="container">
        <v-row>
          <v-col class="mb-2" cols="12">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="editions" :search="search"></v-data-table>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mode_exact } from "@/fonctions";
export default {
  head: {
    title: {
      inner: "Toutes les editions",
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      { name: "description", content: "liste Equipe" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: process.env.twitter_name },
      {
        name: "twitter:title",
        content: `Liste equipes | ${process.env.APP_NAME}`
      },
      { name: "twitter:description", content: "pages des Equipes" },
      { name: "twitter:image", content: "/assets/img/apple-icon.png" },
      { property: "fb:app_id", content: "123456789" },
      {
        property: "og:title",
        content: `Liste equipes | ${process.env.APP_NAME}`
      },
      { property: "og:site_name", content: `${process.env.APP_NAME}` },
      {
        property: "og:url",
        content: `${process.env.BASE_URL || ""}/dashboard/contribute`
      },
      { property: "og:description", content: "description" },
      { property: "og:image", content: "/assets/img/apple-icon.png" },
      { property: "og:image:type", content: "image/png" },
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ]
  },
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
  bodyClass: "landing-page",
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

<style scoped>
.page-header {
  height: 9vh !important;
}
.container {
  margin-top: 92px;
}
</style>
<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle"></div>
    <div class="main main-raised">
      <div class="container">
        

      
        <v-data-table
          :headers="headers"
          :search="search"
          :items="equipes"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Equipes</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:item.image="{ item }">
            <v-avatar @click="previewImage(item)" size="30">
              <v-img :src="item.image.src" :alt="item.image.name"></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.name="{ item }">
            <router-link :to="'/profil/equipe/'+item._id+'/'+item.name" size="30">
             {{item.name}}
            </router-link>
          </template>
          <template v-slot:item.joueurs="{ item }">{{item.joueurs.length}}</template>

          <template v-if="false" v-slot:no-data>
            <v-btn color="primary" @click="initialize" text>Reset</v-btn>
          </template>
        </v-data-table>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mode_exact } from "@/fonctions";
export default {
  head: {
    title: {
      inner: "Equipes",
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
    this.getCurrent();
  },
  bodyClass: "landing-page",
  data() {
    return {
      search: "",
      equipes: [],
      edition: {},
      headers: [
        {
          text: "",
          align: "left",
          filterable: false,
          sortable: false,
          value: "image"
        },
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
          text: "Nombre de joueurs",
          align: "left",
          filterable: true,
          value: "joueurs"
        }
      ]
    };
  },
  methods: {
    previewImage(e) {
      let image = {
        imgs: this.equipes.map(v => v.image),
        index: this.equipes.indexOf(e)
      };
      this.$root.$emit("previewImage", image);
    },
    getEquipe() {
      this.$axios
        .get("/api/equipe/edition/" + this.edition._id)
        .then(({ data }) => {
          for (let e of data) {
            e.image.src = "/api/img/" + e.image.src;
            e.joueurs.map(v => {
              v.image.src = "/api/img/" + v.image.src;
              return v;
            });
            this.equipes.push(e);
          }
          this.equipes1 = this.equipes;
          this.donthaveequipe = data.length >= 0;
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", { err: err, callback: this.getEquipe });
        });
    },
    getCurrent() {
      this.$axios
        .get("/api/edition/current")
        .then(({ data }) => {
          this.$root.$emit("loadStatus", { status: false });
          if (data.status) {
            this.edition = data.edition;
            this.getEquipe();
          } else {
            this.donthaveedition = true;
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", { err: err, callback: this.getCurrent });
        });
    }
  }
};
</script>

<style scoped>
  .page-header {
    height: 9vh!important;
    }
    .container{
      margin-top: 92px;
    }
</style>

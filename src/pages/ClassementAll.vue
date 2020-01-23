<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100">
            <h1 class="title">
               Qu'elle est la meilleurs equipe ? Qui est le meilleurs joueurs ?
            </h1>
            <h4>Soyer fixer des a presents</h4>
            <br />
            <md-button @click="donate" class="md-success md-lg" target="_blank">
              <i
                style="font-size: 2.1rem!important;right: 10px;position: relative;"
                class="mdi v-icon notranslate mdi-charity"
              ></i>
              {{$t('donate.title')}}
            </md-button>
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
              <h2 class="title text-center">Suivez l'actu des equipes</h2>
              <!--<h5 class="text-center">{{$t('donate.why')}}</h5>
              <p class="description" style="text-align:justify">{{$t('donate.description0')}}</p>
              <p class="description" style="text-align:justify">
                {{$t('donate.description1')}}
                <strong>{{$t('donate.slogan')}}</strong>
              </p>-->
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <div class="container">
          <h2 class="title">Equipes</h2>
          <div class="team">
            <div class="md-layout">
            </div>
          </div>
          <h2 class="title">Joueurs</h2>
          <div class="team">
            <div class="md-layout">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("../assets/img/can_background_1.jpeg")
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  head: {
    title: {
      inner: "All project",
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      { name: "description", content: "pages des projects" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: process.env.twitter_name },
      { name: "twitter:title", content: `members | ${process.env.APP_NAME}` },
      { name: "twitter:description", content: "pages des projects" },
      { name: "twitter:image", content: "/assets/img/apple-icon.png" },
      { property: "fb:app_id", content: "123456789" },
      { property: "og:title", content: `Members | ${process.env.APP_NAME}` },
      { property: "og:site_name", content: `${process.env.APP_NAME}` },
      { property: "og:url", content: `${process.env.BASE_URL || ""}projects` },
      { property: "og:description", content: "description" },
      { property: "og:image", content: "/assets/img/apple-icon.png" },
      { property: "og:image:type", content: "image/png" },
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}projects`,
        id: "canonical"
      },
      {
        rel: "author",
        href: `${process.env.AUTORREF},${process.env.AUTORREF2}`
      }
    ]
  },
  data() {
    return {
      nb: 0,
      projects: [],
      continuer: false
    };
  },
  created() {
    this.fetchNb();
    this.getvoterstart();
  },
  methods: {
    donate2(p) {
      this.$root.$emit("startPaiement", p);
    },
    donate() {
      this.$root.$emit("startPaiement");
    },
    fetchNb() {
      this.$axios
        .get("/api/project/nb")
        .then(rep => {
          if (rep.data.status) {
            this.nb = rep.data.nb;
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", { err: err, callback: this.fetchNb });
        });
    },
    
    
  }
};
</script>

<style>
</style>

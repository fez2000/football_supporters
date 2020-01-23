<template>
  <div>
    <article>
      <h1>{{$t("termscommunity.title")}}</h1>
      <!--<div class="last-revised">Août 30, 2019</div>-->
      <section class="UH-card UH-layout-main">
        <froalaView v-model="userules"></froalaView>
      </section>
    </article>
  </div>
</template>

<script>
export default {
  head: {
    title: {
      inner: `Terms and Conditions`
    },

    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}terms/comunity/`,
        id: "canonical"
      },
      { rel: "author", href: "https://fezeueugene.web.app" },
      { rel: "stylesheet", href: "/assets/css/terms.css" }
    ]
  },
  data() {
    return {
      userules: "",
      id: "",
      appName: process.env.APP_NAME
    };
  },
  created() {
    this.getCompetiton();
  },
  methods: {
    getCompetiton() {
      this.$axios
        .get("/api/competition")
        .then(({ data }) => {
          if (data.status) {
            this.id = data.competition._id;
            this.userules = data.competition.userules;
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.getCompetiton
          });
        });
    }
  }
};
</script>

<style>
</style>

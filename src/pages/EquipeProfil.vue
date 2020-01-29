<template>
  <div class="wrapper">
    <parallax
      class="section page-header header-filter"
      :style="headerStyle"
    ></parallax>
    <div class="main main-raised">
      <div  class="section profile-content">
        <div v-if="equipe" class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img
                   style="min-height: 150px; min-width: 150px"
                    :src="'/api/img/'+equipe.image.src"
                    :alt="equipe.name"

                    class="img-raised rounded-circle img-fluid"
                  />
                </div>
                <div class="name">
                  <h3 class="title">{{equipe.name}}</h3>
                  <h6>{{equipe.short_description}}</h6>
                  
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            
            <froalaView v-model="equipe.description"></froalaView>
          </div>
          <preview-joueurs v-model="equipe.joueurs"></preview-joueurs>
        </div>
        <div v-else class="container">
          <div class="md-layout" v-if="errors == 'NotFound'">
            <md-empty-state
            md-icon="find_replace"
            md-label="Profil Not Found"
            :md-description="`this url(${page}) didn't match any profil.`">
              <md-button href='/' class="md-primary md-raised">Home</md-button>
            </md-empty-state>
          </div>
          <div class="md-layout" v-if="errors == 'PrivateProfil'">
            <md-empty-state
            md-icon="lock"
            md-label="PrivateProfil"
            :md-description="`You may connected to see this profil.`">
              <router-link to="/login">
                <md-button  class="md-primary md-raised">login</md-button>
              </router-link>
            </md-empty-state>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabs } from "../components";
import axios from 'axios';
export default {
    head: {
    title: function(){
      return {
        inner: this.title ,
        separator: ' | ',
        complement: this.APP_NAME
      }
    },
    meta: function(){
      return [
        { name: "description", content: this.description },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:creator", content: "@JK" },
        { name: "twitter:title",  content: `${this.title} | ${this.APP_NAME}`  },
        { name: "twitter:description",  content: this.description },
        { name: "twitter:image", content: "/assets/img/apple-icon.png" },
        { property: 'og:title', content: `${this.title} | ${this.APP_NAME}` },
        { property: "og:site_name", content: `${this.APP_NAME}` },
        { property: "og:url", content: location.pathname },
        { property: "og:description", content: this.description },
        { property: "og:image", content: "/assets/img/apple-icon.png" },
        { property: "og:image:type", content: "image/png" },

      ]
    },
    link: function(){
      return [
            { rel: 'canonical', href: `${location.host+location.pathname}`, id: 'canonical' },
            { rel: 'author', href: `${this.AUTORREF},${this.AUTORREF2}` },
        ];
    },
    script: function(){
      return [
        { t: 'application/ld+json', i: JSON.stringify(this.shema) }
      ]
    }
  },
  components: {
    Tabs
  },
  bodyClass: "profile-page",
    beforeRouteEnter (to, from, next) {
      axios.get('/api/equipe/only/'+to.params.url)
      .then(({data})=>{
          if(data.status){
              next(vm => vm.setData(data.equipe));
          }else{
              next(vm => vm.setError(data.errors))
          }
      })
      .catch(()=>next(to))


    }
  ,
    beforeRouteUpdate (to, from, next) {
    this.equipe = null;
    this.errors = null;
        this.$axios.then(({data})=>{
          if(data.status){
              this.setData(data.equipe);
          }else{
              this.setError(data.errors);
          }
          next();
      })
      .catch(()=>next(to))
    },
    data(){
        return {
            equipe: null,
            errors: null,
            APP_NAME: process.env.APP_NAME,
            BASE_URL: process.env.BASE_URL,
            AUTORREF2: process.env.AUTORREF2,
            AUTORREF: process.env.AUTORREF,
        }
    },
    methods: {
        setData(data){
            this.equipe = data;

        },
        setError(errors){
            this.errors = errors;
        }
    },
    props: {
    header: {
      type: String,
      default: ""
    },

  },
  computed: {
    headerStyle() {
      if(this.equipe){
        if(this.equipe.image){
          if(this.equipe.image.src){
            return {
                backgroundImage: `url(/api/img/${this.equipe.image.src})`
              };
          }
        }
      }
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    page(){
        return location.pathname
    },
    title(){

      return (this.equipe)?this.equipe.name:(this.errors == 'NotFound')?'Profil Not found':'you may be connected to see this profil';
    },
    description(){
      return (this.equipe)?'join ' + this.equipe.name + ' on ' + this.APP_NAME + ' more we are may we...':(this.errors == 'NotFound')?'Profil Not found, join another user of ' + this.APP_NAME+' to make better wolrd':'you may be connected to see this profil, let join us'
    },
    shema(){
      if(!this.equipe)return {};
      return {
        "@context": "http://schema.org",
        "@type": "Person",
        /*"address": {
          "@type": "PostalAddress",
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98052",
          "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
        },*/
        //"colleague": [
          //"http://www.xyz.edu/students/alicejones.html",
          //"http://www.xyz.edu/students/bobsmith.html"
        //],
        //"email": "mailto:jane-doe@xyz.edu",
        "image": this.BASE_URL+'api/img/'+ this.equipe.image.src,
        //"jobTitle": "Professor",
        "name": this.equipe.name,
        "url": location.href
      }
    }
  },
  watch: {
    equipe(){

      this.$emit('updateHead')
    }
  }
}
</script>
<style lang="scss" scoped>
.section {
  padding: 0;
}

.profile-tabs /deep/ {
  .md-card-tabs .md-list {
    justify-content: center;
  }

  [class*="tab-pane-"] {
    margin-top: 3.213rem;
    padding-bottom: 50px;

    img {
      margin-bottom: 2.142rem;
    }
  }
}
</style>

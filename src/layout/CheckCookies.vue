<template>
    <div class="text-center">
      <md-dialog :md-active.sync="dialog" :md-click-outside-to-close="false" :md-close-on-esc="false">
        
      <v-card>
        <v-card-title class="headline">Use of Cookies permission</v-card-title>
        <v-card-text>This site uses cookies please accept before proceeding, for more detail check our  <a href="/terms/cookies" target="_blank">cookie policy</a>.</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="agree">Agree</v-btn>
          
        </v-card-actions>
      </v-card>
      
    </md-dialog>
  </div>
</template>

<script>
export default {
    created(){
        this.checkCookiesAgree();
    },
    data: () => ({
      dialog: false,
      invalidRoute: ['Terms privacy policy', 'Terms comunity', 'Terms cookies']
    }),
    methods: {
        checkCookiesAgree(){
         
            if( !this.$Cookies.get('login')  &&!this.$Cookies.get('cookiesEnable') ){
              if(!this.checkRoute())
                this.dialog = true;
                
            }
        },
        agree() {
            this.$Cookies.set('cookiesEnable',true);
            this.dialog = false;
        },
        checkRoute(){
          for(let i of this.invalidRoute){
            if(i ===this.$route.name){
              return true;
            }
           
          }
           return false;
        }
    }
}
</script>

<style>

</style>
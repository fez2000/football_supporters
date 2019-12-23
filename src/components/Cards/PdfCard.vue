<template>
<v-card :elevation="0" fullscreen  :loading=" !loadedRatio || loadedRatio <= 0 || loadedRatio > 1">
          <v-toolbar dark  v-if="custum" :elevation="0" >
            <v-btn @close="close" icon dark >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title ><input v-model.number="page" type="number" style="width: auto"> /{{numPages}}</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-toolbar-items>
              <v-btn
        
                @click="prev()"
                
                
                dark
                small
              >
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
      <v-btn
        
        @click="next()"
        
        dark
        small
        
      >
        <v-icon>
          mdi-chevron-down
        </v-icon>
      </v-btn>  
      
      <v-btn
        
        dark
        small
        @click="zoum_plus()"
        
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        
        dark
        small
        @click="zoum_moin()"
      >
        <v-icon>mdi-moin</v-icon>
      </v-btn>
                <v-btn dark @click="rotate += 90" icon><v-icon>mdi-rotate-right</v-icon></v-btn>
                <v-btn dark @click="rotate -= 90" icon><v-icon>mdi-rotate-left</v-icon></v-btn>      
         
              <v-btn small dark icon > <v-icon>mdi-share</v-icon> <md-tooltip md-direction="bottom"
                  >Share</md-tooltip
                ></v-btn>
              <v-btn small dark icon > <v-icon>mdi-download</v-icon> <md-tooltip md-direction="bottom"
                  >Download this image</md-tooltip
                ></v-btn>
                <v-btn small @click="$refs.pdf.print()" dark icon><v-icon>mdi-printer</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          

        
        <div >
            <div v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center; margin: auto; padding-top: 15px" :style="{ width:  100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%</div>
            <pdf-preview ref="pdf" v-show="!custum" style="display: inline-flex; width: 25%;margin: auto"  :style="{ width:  zoume + '%', margin: 'auto' }" :src="src" :page="page" :rotate="rotate" @password="password" @progress="loadedRatio = $event" @error="error" @num-pages="numPages = $event" @link-clicked="page = $event"></pdf-preview>
            <pdf-preview
            v-show="custum"
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            @link-clicked="page = $event"
            style="display: inline-flex; width: 25%;margin: auto"
            :style="{ width:  zoume + '%', margin: 'auto' }"    
            
        ></pdf-preview>
      
        <v-btn v-if="!custum" fab dark icon :top="false"
        :bottom="true"
        :right="true"
        :left="false"
        @click="fullPdf"
        absolute ><v-icon>mdi-more</v-icon></v-btn>
    
        </div>
        </v-card>
 
</template>

<script>
export default {
    props: {
      src: {
          default: '',
          type: String
      },
      custum: {
        defaut: false,
        type: Boolean
      }  
    },
    watch: {
      fab(){
        if(!this.fab){
          this.fab = true;
        }
      }
    },
    data(){
        return{
                    
            loadedRatio: 0,
            page: 1,
            numPages: 1,
            rotate: 0,
          zoume: 50,
          fab: true
        }
    },
    computed: {
        zoumeStyle(){
            return {
                width: this.zoume + "%"
            }
        }
    },
    methods: {
      close(){
        this.$emit(close, true)
      },
      fullPdf(){
        this.$root.$emit('pdf',{
          src: this.src
        })
      },
        password: function(updatePassword, reason) {

            updatePassword(prompt('password is "test"'));
        },
        error: function(err) {

            console.log(err);
        },
        prev(){
          
          (this.page<this.numPages)?this.page++:''
        },
        next(){
          (this.page<this.numPages)?this.page--:''
        },
        zoum_plus(){
            if(this.zoume < 150){
                this.zoume += 15;
            }
             
        },
        zoum_moin(){
            if(this.zoume > 15){
                this.zoume -= 15;
            }
             
        }
    }
}
</script>

<style>

</style>
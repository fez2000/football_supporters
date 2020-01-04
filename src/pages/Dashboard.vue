<template>
  <v-row >
    <v-form hidden class="mt-8">
      <input hidden name="photo"   id="photo"  type="file" @input="checkPhoto"  accept="image/*;capture=camera" />
      <input hidden name="video"  id="video" type="file" @input="checkVideo"  accept="video/*|audio/*;capture=camcorder" />
      <input hidden  name="doc"  id="doc" type="file" @input="checkDoc" accept="application/*|text/*" />
    </v-form>
    <v-dialog v-show="dialogue" v-model="dialogue" scrollable :max-width="'400px'" :fullscreen="$vuetify.breakpoint.xs" :persistent="!$vuetify.breakpoint.xs">
      <v-card>
        <v-system-bar :color="(this.darkTheme)?'primary':'green darken-2'"><v-spacer></v-spacer><v-icon @click="clear" color="white">mdi-close</v-icon></v-system-bar>
        <v-img @drop.prevent="addFile" @dragleave.prevent="gradient=''" @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
          v-if="mode == 'image'"
        :src="previewSrc"
        
        max-height="300"
        :gradient="gradient"
        @click="getName('photo')"
        
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>

      </v-img>
      <vue-plyr v-if="mode == 'video'&&type == mode">
          <video>
              <source :src="video" :type="doc.type" />
          </video>
      </vue-plyr>
      
      <pdf-card v-if="mode == 'application'&&type == 'pdf'" :src="application"></pdf-card>
      
      <vue-plyr v-if="mode == 'video'&&type != mode">
          <audio>
            <source :src="video" :type="doc.type" />
              
          </audio>
      </vue-plyr>
        <v-card-text v-show="mode == 'post'" style="height: 300px">
          <v-form class="mt-8">
            

              <l-input label="Title: " labelClass="title"  placeholder="Entrez le titre de votre post" @value="getTitle"></l-input>
              <l-input label="Description: " labelClass="title"  placeholder="Entrez la description de votre post" @value="getDescription"></l-input>
              
          </v-form>
  
            
            
        </v-card-text>
        <v-card-actions v-show="mode != 'post'">
          <input type="text" placeholder="text alternatif"/> <v-spacer></v-spacer><v-btn dark :color="(this.darkTheme)?'primary':'green darken-2'" @click="mode = 'post'" text > Suivant</v-btn>
        </v-card-actions>
      
        <v-card-actions v-if="mode == 'post'">
          <v-btn :disabled="doc&&!fichier" @click="getName('photo')" dark :color="(doc&&fichier)?'primary':'grey'"  icon><v-icon>mdi-camera-outline</v-icon></v-btn>
          <v-divider vertical></v-divider>
          <v-btn :disabled="doc&&!video" @click="getName('video')" :color="(doc&&video)?'primary':'grey'"  icon><v-icon>mdi-camcorder</v-icon></v-btn>
          <v-divider  vertical></v-divider>
          <v-btn :disabled="doc&&!application" @click="getName('doc')"  :color="(doc&&application)?'primary':'grey'"  icon><v-icon>mdi-file-outline</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-btn dark :color="(this.darkTheme)?'primary':'green darken-2'" @click="post" :load="submitting" :disabled="submitting|| !message || !title" text> Post</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
        <v-col class="col-xs-12 col-sm-12 col-md-4 col-lg-3" order="first" order-md="last" order-lg="last" order-sm="first" offset-xl="first" >
      <v-card>
        
          <v-toolbar elevation="0"><v-toolbar-title>falsh news</v-toolbar-title></v-toolbar>
            <v-card-text>Listen to your favorite artists and albums whenever and wherever, online and offline.</v-card-text>

            <v-card-actions>
              <v-btn x-small color="primary" text>Lire</v-btn>
            </v-card-actions>
            
      </v-card>
      <v-card v-if="voter&&voter.roleLevel < 3" class="mt-2">
        <v-toolbar>
          <v-btn color="primary" @click="open" small text><v-icon> mdi-pencil-box-outline</v-icon>{{(wZ > 350)?'Ecrivez un post':''}}</v-btn>
          <v-spacer></v-spacer> 
          <v-divider vertical></v-divider>
          <v-btn @click="getName('photo')" icon><v-icon>mdi-camera-outline</v-icon>
          <md-tooltip md-direction="bottom"
                  >Poster une image</md-tooltip
                ></v-btn>
          <v-divider vertical></v-divider>
          <v-btn @click="getName('video')" icon><v-icon>mdi-camcorder</v-icon>
          <md-tooltip md-direction="bottom">Poster une video ou un audio</md-tooltip
                ></v-btn>
          <v-divider vertical></v-divider>
          <v-btn @click="getName('doc')" icon><v-icon>mdi-file-outline</v-icon>
          <md-tooltip md-direction="bottom"
                  >Poster un dcoument</md-tooltip
                ></v-btn></v-toolbar>
      </v-card>
    </v-col>
    <v-col    class=" col-xs-12 col-sm-12 col-md-8 col-lg-9 align-center">
      <transition-group name="fade" mode="out-in">
        <div :key="event._id" v-for="event in events">
            <v-card
              :loading="event.isLoading"
              class="auto"
              :max-width="($vuetify.breakpoint.xs)?300:500"
              :dark="darkTheme"
            >
              <v-list-item dense>
                <v-list-item-avatar v-if="event.document && event.document.cathegorie == 'image' ">
                  <template >
                      
                      <v-img v-if="event.document && event.document.cathegorie == 'image'" :src="'/api/img/'+event.document.src" :alt="event.document.name">
                    </v-img>

                  </template>
                </v-list-item-avatar>
                <v-list-item-icon v-if="event.document && event.document.cathegorie != 'image'">
                  <v-icon v-if="event.document && event.document.cathegorie == 'pdf'">mdi-file-pdf</v-icon>
                  <v-icon v-if="event.document && event.document.cathegorie == 'zip'">mdi-folder-zip</v-icon>
                  <v-icon v-if="event.document && event.document.cathegorie == 'video'">mdi-camcorder</v-icon>
                  <v-icon v-if="event.document && event.document.cathegorie == 'audio'">mdi-microphone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="tit" v-html="_traitement_text(event.title)"></v-list-item-title>
                  <v-list-item-subtitle>{{mode_exact2(event.time_create||new Date())}}</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <template v-for="tag in tags(event.tags)">
                      <router-link  :key="`${event._id}${tag}`" :to="`/dashboard?search=${tag}`"></router-link>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu :close-on-content-click="false" bottom right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        
                        icon
                        v-on="on"
                        
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-menu :offset-x="true" right>
                        <template v-slot:activator="{ on }">
                          <v-list-item
                            v-on="on"
                          >
                          <v-list-item-content>share</v-list-item-content>  <v-list-item-action><v-icon>mdi-share-variant</v-icon></v-list-item-action>
                          </v-list-item>
                        </template>
                        <socials-links :url="BASE_URL+'dashboard/?startAt='+event._is"
                          :title="event.title"
                          :description="event.description"
                          :quote="''"
                          :hashtags="event.tags"
                          :twitter-user="twitter_name"
                          >
                    
                        </socials-links>
                      </v-menu>
                      
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <vue-plyr     v-if="event.document&& event.document.cathegorie == 'video'">
                  <video preload="none" v-intersect.once="play" v-intersect.quit="stop">
                      <source :src="'api/doc/'+event.document.src" :type="'video/'+event.document.type" />
                      
                      <p>Votre navigateur ne prend pas en charge les vidéos HTML5.
     Voici <a :href="'api/doc/'+event.document.src" download>un lien pour télécharger la vidéo</a>.</p>
                  </video>
              </vue-plyr>
              <v-img
                v-if="event.document&& event.document.cathegorie == 'audio'"
                :src="'/assets/img/audio.png'"
                :alt="'audio png'"
                height="194"
              ></v-img>
              <vue-plyr     v-if="event.document&& event.document.cathegorie == 'audio'">
                  <audio preload="none" v-intersect.once="play" v-intersect.quit="stop">
                    <source :src="'api/doc/'+event.document.src"  :type="'audio/'+event.document.type" />
                      
                  </audio>
              </vue-plyr>
              <v-img
                v-if="event.document&& event.document.cathegorie == 'image'"
                :src="'/api/img/'+event.document.src"
                :alt="event.document.name"
                height="194"
              ></v-img>

              <v-card-text v-html="_traitement_text(event.description)">
               
              </v-card-text>
              
             
              <v-card-actions>
              <v-spacer></v-spacer><span v-if="event.likeNb>0 && !event.love">{{event.likeNb}} {{(event.likeNb>1)?'likes':'like'}}</span>
              <span v-if="event.likeNb>0 && event.love"> {{(event.likeNb==1)?'you like this':`you and ${event.likeNb} like this`}}</span>   
              </v-card-actions>
               <v-divider></v-divider>
              <v-card-actions>

                <v-btn
                  v-if="event.type=='voter'"
                  text
                  color="primary"
                  @click="event.isLoading = true;goTo(event.link,event.type)"
                >
                 {{$t("dashboard.profil")}}
                </v-btn>
                <v-btn
                  v-if="event.type=='project'"
                  text
                  color="primary"
                  @click="event.isLoading = true;goTo(event.link,event.type)"
                >
                 see
                </v-btn>
                <div class="flex-grow-1"></div>
                <v-btn :color="(event.love)?'red':''"  :disabled="event.loveSubmit" @click="event.loveToggle()" icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn v-if="event.type == 'post' || event.type == 'doc'" icon>
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
                <feed-back-reaction v-if="false"></feed-back-reaction>
                 
              </v-card-actions>
            </v-card>

        </div>
        <div v-show="isLoading"  :key="'loading'" :style="{ 'max-width': (($vuetify.breakpoint.xs)?300:500)+'px'}" class="auto">
          <skeleton-card v-for="i in [1,2,3,4,5,6,7,8,9]"  :key="'loading'+i" class='mb-7 skeleton-card--opacity' :hasHeader="true" :hasMedia="true" :lines="1" :isHorizontal="false"> </skeleton-card>
        </div>
        <v-layout class="pt-7" v-if="continuer" v-show="!isLoading" :key="'getmore'" column align-center>
            <v-btn primary @click="getMore()"> {{$t("dashboard.getmore")}}</v-btn>
        </v-layout>

    </transition-group>


    </v-col>

    



  </v-row>

</template>

<script>
import SkeletonCard from '@/components/CardSkeleton.vue';
import { getVoterData, mode_exact2,  themeName } from '@/fonctions.js';
import { editImg } from '@/fonctions/project';
import {
    replaceAllBy,
    insertTextAtIndices,
    traitement_text,
    blockHtml
} from "@/fonctions/post";
import { wrapEmoji } from '@/fonctions/emojis' 
import LinkPrevue from 'link-prevue';

function loveToggle(e){
    e.loveSubmit = true;
    if(!e.love){
      return this.$axios.post('/api/like/add',{
          type: 'event',
          target_id: e._id
        },{
        headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
        }
      }).then(({ data })=>{
        e.loveSubmit = false;
        if(data.status){
          e.love = true;
          e.likeNb = data.nb; 
        }
      })
    }
    this.$axios.post('/api/like/remove',{
          type: 'event',
          target_id: e._id
        },{
        headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
        }
    }).then(({ data })=>{
      e.loveSubmit = false;
      if(data.status){
        e.love = false;
        e.likeNb = data.nb; 
      }
    })
  }

function supDoc(doc){

    this.$axios.delete(`/api/doc/${doc._id}`,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
      },

    })
    .then(({data})=>{

      if(data.status){
        let docs = [];
        for(let document of this.docs){
          if(document._id == doc._id){
            continue;
          }
          docs.push(document);
        }
        this.docs = docs;
        
      }else{
        this.$root.$emit('snackbar', {
          display: true,
          text: JSON.stringify(data.errors)
        });
      }
    }).catch(err=>{

      this.$root.$emit('snackbar', {
        display: true,
        text: JSON.stringify(err)
      });

    })
  }
function checkDoc(e){
  const file = e.target.files[0];
  if(!file){
    return;
  }
  if(file.size >  this.fileMaxSize){
    
      this.$root.$emit('snackbar',{display: true, text: 'doc size should be less than 10 MB!.'});
    return;
  }
    this.doc = file;
     
    
    const isApplication = /^application\/*/.test(file.type);
    const isText = /^text\/*/.test(file.type);
    if(!isApplication && !isText){
      return;
    }
    this.doc = file;
    this.application = URL.createObjectURL(file);
    this.mode = 'application';
    if(isApplication){
      this.dialogue = true;
      if(file.type == 'application/pdf'){
        this.type = 'pdf'
        return;
      }
      if(file.type == 'application/zip'){
        this.type = 'zip';
        return;
      }
      this.type = 'application';
      return;
    } 
    this.type = 'text';
    this.dialogue = true;
}

function sendDoc(doc){
    let formData = new FormData();
    
    let type = doc.type.replace(/.*\//,'').replace(/\+.*/,'');
    
    formData.append('document',doc);
    formData.append('cathegorie',this.type);
    formData.append('name',`${this.alt}_post`);
    formData.append('type', type);

    this.$axios.post('/api/doc',
    formData,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
        'enctype': 'multipart/form-data'
      },

    }).then(({ data }) => {
      if(data.status){
        this.doc = data.document;
        this.docSend = true;
        
      }else{
        this.$root.$emit('snackbar',{
          display: true,
          text: JSON.stringify(data.errors),
        });

        
      }
    }).catch(err=>{
      //e.form.submitting = false;
        this.$root.$emit('snackbar', {
        display: true
      });
      this.$root.$emit('neterror', { err: err, callback: this.sendDoc, data: doc });
    });
  }

export default {
  components:{
    SkeletonCard,
    LinkPrevue,
  },
  beforeDestroy(){
    if(secureSocket){
      secureSocket.removeListener('likeStatus', this.likeStatus );
      secureSocket.removeListener('likeOf', this.likeOf );
      secureSocket.removeListener('synlike', this.synlike );
      secureSocket.removeListener('newEvent', this.waitEvent);
    }
    window.removeEventListener('resize', this.waitResize);
  },
  created(){
    window.addEventListener('resize', this.waitResize);
    this.$root.$emit('loadStatus', { status: false });
   
    this.$root.$on('darkTheme',(data) => this.darkTheme = data);
    this.voter = this.$root.voter;
    if(!this.voter){
      this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
      this.$root.voter = this.voter
    }

  },
  mounted(){
    secureSocket.on('newEvent', this.waitEvent);
    secureSocket.on('likeStatus', this.likeStatus);
    secureSocket.on('likeOf',this.likeOf);
    secureSocket.on('synlike', this.synlike);
     this.fetchEvent();
  },
  data() {
    return {
      darkTheme:  (getVoterData(themeName) !== '')? getVoterData(themeName): false,
      isLoading: false,
      continuer: true,
      events: [],
      voter: {},
      message: '',
      maker: false,
      dialogue: false ,
      title: '',
      submitting: false,
      currentE: 0,
      docs: [],
      wZ: window.outerWidth,
      fileMaxSize: process.env.FILE_MAX_SIZE,
      file: false,
      twitter_name: process.env.twitter_name,
     doc: null,
     docSend: false,
     fichier: null,
     mode: 'post',
     gradient: '',
     previewSrc:'',
     video: '',
     
     type: '',
     alt: '',
     BASE_URL: process.env.BASE_URL
    };
  },
  computed: {
     docType(){
       if(this.doc){ 
         
        let type = this.doc.type.replace(/.*\//,'');
        if(this.type == 'text'){
          if(type == 'txt'){
            return 'text';
          }
          if(type == 'md'){
            return 'markdown'
          }
          return 'text'
        }
          if(type == 'docx' || type == 'pptx' || type == 'xlsx'){
            return 'office'
          }
          
          
        };
       return ''
        
    }
  },
  methods: {
    getMedia(){
      var startTime = Date.now();
      var detectPermissionDialog = function(allowed) {
        if (Date.now() - startTime > timeThreshold) {
          // dialog was shown
        }
      };
      var successCallback = function(error) {
        detectPermissionDialog(true);
      };
    var errorCallback = function(error) {
      if ((error.name == 'NotAllowedError') ||
        (error.name == 'PermissionDismissedError')) {
        detectPermissionDialog(false);
      }
    };

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: 'environment' } } // prefer rear-facing camera
  })
  .then(successCallback, errorCallback);
    },
    getName(name){
      
       document.getElementById(name).click();
    },
    videoPreview(file){
      this.doc = file;
      this.video = URL.createObjectURL(file);
      
      const isVideo = /^video\/*/.test(file.type);
      this.type = 'audio'
      if(isVideo){
        this.type = 'video';
      }
    },
    replaceAllBy,
    insertTextAtIndices,
    traitement_text,
    blockHtml,
    tags(text){
      if(!text) return [];
      return text.split(',');
    },
    fileS(file) {
      this.fichier = file;
      this.doc = file;
      this.type = 'image';
        var reader = new FileReader();
        reader.onload = () => {
          
            this.previewSrc = reader.result;
            
       

        }
        reader.readAsDataURL(file);
    },
    editImg,
    checkDoc,
    sendDoc,
    supDoc,
   
    clear(){
      this.dialogue = false;
      this.message = '';
      this.title = '';
      
      this.file = false; 
      this.fichier = '';
      this.doc = '';
      this.video = ''
    },
    sendMessage(){

    },
    save(){
     
      this.$axios.post('/api/event/add',{
            type: 'post',
            text: this.message,
            title: this.title,
            document: this.doc
          },{
          headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
          }
      }).then((ev)=>{
        this.submitting = false;
        
        this.docSend = false;
        
        this.clear()
        if(ev.data.status){
          let item = ev.data.post;
              item.isLoading = false;
              item.love = false;
              item.loveSubmit = false;
              item.loveToggle = loveToggle.bind(this, item)
              
              this.events.unshift(item);
              secureSocket.emit('getLikeOf',{id: item._id});
              secureSocket.emit('checkLikeStatus',{id: item._id, myId: this.voter._id});

          this.$root.$emit('snackbar', { display: true, text: 'Post success' });
        }else{
          this.$root.$emit('snackbar', { display: true, text: 'Post failure' });
        }
        
      }).catch(()=>{
        this.submitting = false;
        this.$root.$emit('snackbar', { display: true });
      })
    },
    open(){
      this.dialogue = true;
      this.mode = 'post';
    },
    addFile(){
      this.dialogue = true;
      this.checkDoc('docs')
    }
    ,
    clearMessage(){
      this.title = '';
    },
    echo(e){
      console.log(e)
    },
    synlike(data){
      if(data.type == 'event'){
        for(let event of this.events){
          if(event._id == data._id){
            event.likeNb = data.nb
          }
        }  
      }
    },
    play(e){
      if(e[0]){
        try{
          if(e[0].paused && e[0].currentTime > 0 && !e[0].ended){
            e[0].target.play();
          }
          
        }catch(e){

        }       
      }
      
    },
    _traitement_text(text){
      if(!text) return '';
      return this.traitement_text(this.$emojione.toImage(text))
    },
    stop(e){
      if(e[0]){
        try{
          if(!(e[0].paused && e[0].currentTime > 0 && !e[0].ended)){
            e[0].target.pause();
          } 
  
          
        }catch(e){

        }
        
        
      }
    },
    waitEvent(data){
        
        for(let event of this.events){
          
          if(event._id == data._id){
            return;
          }
        }
        
        let item = data;
        item.isLoading = false;
        item.love = false;
        item.loveSubmit = false;
        item.loveToggle = loveToggle.bind(this, item)
        
        this.events.unshift(item);
        secureSocket.emit('getLikeOf',{id: item._id});
        secureSocket.emit('checkLikeStatus',{id: item._id, myId: this.voter._id});
      
    },
    likeOf(data){
      
      for(let event of this.events){
        if(event._id == data._id){
          event.likeNb = data.nb
        }
      }
    },
    likeStatus(data){
     
      for(let event of this.events){
        if(event._id == data._id){
          event.love = data.status
        }
      }
    },
    goTo(link,type){
      if(type == 'voter'){
        this.$router.push('/dashboard/in/'+link);
      }else{
        if(type == 'project'){
          this.$router.push('/dashboard/project/'+link);
        }else{
          
        }  
      }
    },
    addFile(e) {
        let droppedFiles = e.dataTransfer.files;
        if(!droppedFiles) return;
        // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        const isImage = /^image\/*/.test(droppedFiles[0].type);

        if(isImage){
          if(droppedFiles[0].size >  this.fileMaxSize){
    
             this.$root.$emit('snackbar',{ display: true, text: 'Project image size should be less than 10 MB!.' });
            return;
          }
          this.file = true;
          this.mode = 'image'
          this.fileS(droppedFiles[0]);
        }else{
          this.$root.$emit('snackbar',{ display: true, text: 'Pleace Enter a valid image.' });
        }

      },
      checkVideo(e){
        if (e.target.files[0]){
          if (e.target.files[0].size > 10000000){
            alert('Project image size should be less than 10 MB!');
            return;
          }
          const isVideo = /^video\/*|audio\/*/.test(e.target.files[0].type);
          if(!isVideo){
          
            this.$root.$emit('snackbar',{
              display: true,
              text: 'please enter a valid video/audio'
            })
            return;
          }
          if (!e.target.files) return;
          
           this.file = true;
         
          this.videoPreview(e.target.files[0]);
          this.dialogue = true;
           this.mode = 'video'
        }
      },
    checkPhoto(e) {
        if (e.target.files[0]){
          if (e.target.files[0].size > 10000000){
            alert('Project image size should be less than 10 MB!');
            return;
          }
          const isImage = /^image\/*/.test(e.target.files[0].type);
          if(!isImage){
          
            this.$root.$emit('snackbar',{
              display: true,
              text: 'please enter a valid image'
            })
            return;
          }
          if (!e.target.files) return;
          
           this.file = true;
         
          this.fileS(e.target.files[0]);
          this.dialogue = true;
           this.mode = 'image'
        }

      },
    mode_exact2,
    getTitle(data){
      this.title = data;
    },
    getDescription(data){
      this.message = data;
    },
    getMore() {
      this.isLoading = true
      setTimeout(()=>{
        this.$axios.post('/api/event/next', { currentE: this.currentE},{
              headers: {
                  'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
              }
          })
        .then(({ data }) => {
          if(data.status){
            for(let item of data.events){
              item.isLoading = false;
              item.love = false;
              item.loveSubmit = false;
              item.loveToggle = loveToggle.bind(this, item);

              this.events.push(item);
              secureSocket.emit('getLikeOf', { id: item._id });
              secureSocket.emit('checkLikeStatus', { id: item._id, myId: this.voter._id });

            }
            this.currentE = data.nb;
            this.isLoading = false;
            this.continuer = data.continue;
          }else{
            if(data.errors === 'AuthErr'){
              this.$Cookies.set('login',false);
              this.$router.push('/login');
            }
          }
            

        })
        .catch(err => {
          this.isLoading = false;
          this.$root.$emit('snackbar',{display: true});
          this.$root.$emit('neterror', { err: err, callback: this.getMore});
        })
      },1000);

    },
    waitResize(){
      this.wZ = window.outerWidth;
    },
    post(){
      this.submitting = true;
      if(this.doc){
        this.sendDoc(this.doc)
      }else{
        this.save()
      }
    },
    fetchEvent(){
      this.isLoading = true;
      setTimeout(()=>{
          this.$axios.get('/api/event/start').then(({data})=>{
             this.isLoading = false;
             this.continuer = data.continue;
          if(data.status == false){
           
            if(data.errors === 'AuthErr'){
              this.$Cookies.set('login',false);
              this.$router.push('/login');
            }
          } else {
            if(data.continue){
              this.currentE = 20;
            }
            for(let item of data.events){
              item.isLoading = false;
              item.love = false;
              item.loveSubmit = false;
              item.loveToggle = loveToggle.bind(this, item)
              secureSocket.emit('getLikeOf',{ id: item._id });
              secureSocket.emit('checkLikeStatus',{ id: item._id, myId: this.voter._id });
              this.events.push(item);
            }


          }
          this.continue = data.continue;
        }).catch((err)=>{
         this.$root.$emit('snackbar',{ display: true });
         this.$root.$emit('neterror', { err: err, callback: this.fetchEvent });
        })
      },1000)

    },
    
  },
  watch: {
    docSend(){
      if(this.docSend){
        this.save()
      }
    }
  }
};
</script>
<style scoped>
  .auto{
    margin: auto;
    margin-bottom: 20px;
  }
</style>

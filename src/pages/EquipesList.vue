<template>
  <v-container>
    <v-row>
      <v-col v-if="donthaveequipe " cols="12">
        <md-empty-state md-icon="group" :md-label="'Creez des equipes!'" :md-description="'Creer'">
          <md-button @click="goToCreateEquipe()" class="md-primary md-raised">Creer une equipe</md-button>
        </md-empty-state>
      </v-col>
      <v-col v-if="donthaveedition " cols="12">
        <md-empty-state
          md-icon="soccer"
          :md-label="'Pas d\'edition'"
          :md-description="'Vous n\'avez pas creer d\'edition!'"
        >
          <md-button @click="goToCreateEdition()" class="md-primary md-raised">Creer une competition</md-button>
        </md-empty-state>
      </v-col>
      <v-col cols="12">
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
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
              <v-dialog v-model="dialog" fullscreen scrollable>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on" text>Ajout minimal</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.name" label="name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.pays" label="Pays"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.vile" label="Ville"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.coach" label="Coach"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" offset-md="3" lg="6" offset-lg="3">
                          <v-img
                            @drop.prevent="addFile"
                            @dragleave.prevent="gradient=''"
                            @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
                            max-height="300px"
                            max-width="400px"
                            :lazy-src="a"
                            :src="a"
                            :alt="editedItem.image.name"
                            :gradient="gradient"
                            @click="getImg"
                          ></v-img>
                          <input
                            hidden
                            name="projectimg"
                            id="projectimg"
                            type="file"
                            @input="checkFile"
                            accept="image/*"
                          />
                        </v-col>
                        <v-col cols="12">
                          <froala
                            :tag="'textarea'"
                            :config="config"
                            v-model="editedItem.description"
                          >Un mot au suject de cette edition</froala>
                        </v-col>
                        <v-col cols="12">
                          <edit-joueurs
                            v-if="mode == 'edit'"
                            :id="editedItem._id"
                            v-model="editedItem.joueurs"
                          ></edit-joueurs>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                    <v-btn color="blue darken-1" text v-if="mode === 'save'" @click="save">Creer</v-btn>
                    <v-btn text v-if="mode === 'edit'" @click="editItemSave">Edit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.image="{ item }">
            <v-avatar @click="previewImage(item)" size="30">
              <v-img :src="item.image.src" :alt="item.image.name"></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.joueurs="{ item }">{{item.joueurs.length}}</template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
          <template v-if="false" v-slot:no-data>
            <v-btn color="primary" @click="initialize" text>Reset</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
  data() {
    return {
      mode: "save",
      loadtrue: true,
      equipes1: [],
      dialog: false,
      donthaveedition: false,
      edition: "",
      equipes: [],
      search: "",
      a: "",
      donthaveequipe: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        pays: "",
        ville: "",
        coach: "",
        description: "",
        image: {
          _id: "",
          src: "",
          name: ""
        },
        imgsrc: ""
      },
      config: {
        placeholderText: "Edit Your Content Here!",
        imageUploadURL: "/api/flroala/upload_image",
        imageUploadParams: {
          id: "my_editor"
        },
        requestHeaders: {
          "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
        },
        fileUploadURL: "/api/flroala/upload_file",
        fileUploadParams: {
          id: "my_editor"
        },
        toolbarInline: false,
        toolbarSticky: true,
        // theme: "dark",
        fullPage: false,
        language: "fr",
        placeholderText: "Placeholder",
        fileMaxSize: 1024 * 1024 * 10,
        imageManagerLoadURL: "/api/flroala/load_images",
        imageManagerDeleteURL: "/api/flroala/delete_image",
        imageManagerDeleteMethod: "POST",
        videoUploadURL: "/api/flroala/upload_video",
        events: {
          "image.removed": (e, editor, $img) => {
            this.$axios
              .post(
                "/api/flroala/delete_image",
                {
                  src: $img.attr("src")
                },
                {
                  headers: {
                    "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                  }
                }
              )
              .then(({ data }) => {})
              .catch(err => {});
          },
          "image.resize": (e, editor, $img) => {
            console.log($img);
          },
          "video.removed": (e, editor, $video) => {
            this.$axios
              .post(
                "/api/flroala/delete_video",
                {
                  src: $video.attr("src")
                },
                {
                  headers: {
                    "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                  }
                }
              )
              .then(({ data }) => {})
              .catch(err => {});
          },
          "file.unlink": function(e, editor, link) {
            this.$axios
              .post(
                "/api/flroala/delete_file",
                {
                  src: link.getAttribute("href")
                },
                {
                  headers: {
                    "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                  }
                }
              )
              .then(({ data }) => {})
              .catch(err => {});
          }
        }
      },
      gradient: "",
      defaultItem: {
        name: "",
        pays: "",
        ville: "",
        coach: "",
        description: "",
        image: {
          _id: "",
          src: require("@/assets/img/defaultPreview.svg"),
          name: ""
        },
        imgsrc: ""
      },
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
        },
        { text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  created() {
    this.getCurrent();
  },
  mounted() {},
  methods: {
    checkFile(e) {
      if (e.target.files[0]) {
        if (e.target.files[0].size > 10000000) {
          alert("Project image size should be less than 10 MB!");
          return;
        }
        if (!e.target.files) return;

        this.file(e.target.files[0]);
      }
    },
    getImg() {
      var e = document.getElementById("projectimg");
      e.click();
    },
    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      const isImage = /^image\/*/.test(droppedFiles[0].type);

      if (isImage) {
        if (droppedFiles[0].size > this.fileMaxSize) {
          this.$root.$emit("snackbar", {
            display: true,
            text: "Project image size should be less than 10 MB!."
          });
          return;
        }

        this.file(droppedFiles[0]);
      } else {
        this.$root.$emit("snackbar", {
          display: true,
          text: "Pleace Enter a valid image."
        });
      }
    },
    file(file) {
      this.editedItem.img = file;

      var reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.editedItem.imgsrc = reader.result;
          this.a = reader.result;
        }, 500);
      };
      reader.readAsDataURL(file);
    },
    previewImage(e) {
      let image = {
        imgs: this.equipes.map(v => v.image),
        index: this.equipes.indexOf(e)
      };
      this.$root.$emit("previewImage", image);
    },
    save() {
      this.$axios
        .post("/api/equipe/", this.editedItem, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            data.equipe.image.src = "/api/img/" + data.equipe.image.src;
            data.equipe.joueurs = [];
            this.equipes.push(data.equipe);
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: JSON.stringify(data.errors)
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$root.$emit("snackbar", { display: true });
        });

      this.close();
    },
    goToCreateEdition() {
      this.$root.$emit("loadStatus", { status: true });
      this.$router.push("/dashboard/editions/create");
    },
    goToCreateEquipe() {
      this.$root.$emit("loadStatus", { status: true });
      this.$router.push("/dashboard/equipes/create");
    },
    initialize() {
      this.equipes = this.equipes1;
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
    deleteItem(item) {
      const index = this.equipes.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.$axios
          .delete("/api/equipe/" + this.equipes1[index]._id)
          .then(({ data }) => {
            if (data.status) {
              this.equipes.splice(index, 1);
            } else {
              this.$root.$emit("snackbar", {
                display: true,
                text: JSON.stringify(data.errors)
              });
            }
          })
          .catch(() => {
            this.$root.$emit("snackbar", { display: true });
          });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.mode = "save";
      }, 300);
    },
    editItemSave(item) {
      let a = Object.create(this.editedItem);

      delete a.image;
      this.$axios
        .put("/api/equipe/" + this.equipes1[this.editedIndex]._id, a, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            Object.assign(this.equipes[this.editedIndex], this.editedItem);
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: JSON.stringify(data.errors)
            });
          }
        })
        .catch(() => {
          this.$root.$emit("snackbar", { display: true });
        });
      this.dialog = false;
    },
    editItem(item) {
      this.mode = "edit";
      this.editedIndex = this.equipes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.a = "" + this.imgc;
      this.dialog = true;
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
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Ajouter une Equipe" : "Editer Equipe";
    },
    imgc() {
      return !this.editedItem.imgsrc
        ? this.editedItem.image.src
        : this.editedItem.imgsrc;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  }
};
</script>

<style>
</style>
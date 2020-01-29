<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="joueurs"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Joueurs</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </template>
    <template v-slot:item.image="{ item }">
      <v-avatar @click="previewImage(item)" size="30">
        <v-img :src="'/api/img/'+item.image.src" :alt="item.image.name"></v-img>
      </v-avatar>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array | [],
      default: () => []
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      mode: "save",
      loadtrue: true,
      joueurs1: [],
      dialog: false,
      edition: "",

      joueurs: [],
      search: "",
      a: "",
      donthaveequipe: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        poste: "",
        age: "",
        description: "",
        pays: "",
        ville: "",
        coach: "",
        image: {
          _id: "",
          src: "",
          name: ""
        },
        imgsrc: ""
      },
      gradient: "",
      defaultItem: {
        name: "",
        poste: "",
        age: "",
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
      headers: [
        {
          text: "",
          align: "left",
          filterable: false,
          value: "image"
        },
        {
          text: "Joueurs",
          align: "left",
          filterable: true,
          value: "name"
        },
        {
          text: "Poste",
          align: "left",
          filterable: true,
          value: "poste"
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
          text: "Age",
          align: "left",
          sortable: true,
          value: "age",
          filterable: true
        },
        { text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  created() {},
  mounted() {
    this.joueurs = this.value;
  },
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
      var e = document.getElementById("projectimg1");
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
        imgs: this.joueurs.map(v => v.image),
        index: this.joueurs.indexOf(e)
      };
      this.$root.$emit("previewImage", image);
    },
    save() {
      this.editedItem.equipe = this.id;
      this.$axios
        .post("/api/joueur/", this.editedItem, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            data.joueur.image.src = "/api/img/" + data.joueur.image.src;
            this.joueurs.push(data.joueur);
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

    initialize() {
      this.joueurs = this.joueurs1;
    },
    deleteItem(item) {
      const index = this.joueurs.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.$axios
          .delete("/api/joueur/" + this.joueurs[index]._id)
          .then(({ data }) => {
            if (data.status) {
              this.joueurs.splice(index, 1);
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
        .put("/api/joueur/" + this.joueurs[this.editedIndex]._id, a, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            Object.assign(this.joueurs[this.editedIndex], this.editedItem);
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
      this.editedIndex = this.joueurs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.a = "" + this.imgc;
      this.dialog = true;
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Ajouter une Joueur" : "Editer Joueur";
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
    },
    joueurs() {
      this.$emit("input", this.joueurs);
    }
  }
};
</script>

<style>
</style>
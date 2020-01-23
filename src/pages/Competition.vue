<template>
  <v-container :fluid="true">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        
        <v-col cols="11" >
          <v-card-text>
            <h2 class="title mt-1 mb-2">{{$t("createproject.f_name")}}:</h2>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :label="$t('createproject.f_name')"
              required
              solo
              max-length="150"
            ></v-text-field>

            <h2 class="title mt-1 mb-2">{{$t("createproject.description")}}:</h2>
            <froala
              :tag="'textarea'"
              :config="config"
              v-model="description"
            >Un mot au suject de la competition</froala>
            <h2 class="title mt-1 mb-2">Regle d'utilisation:</h2>
            <froala
              :tag="'textarea'"
              :config="config"
              v-model="userules"
            >Regle d'utilisation de la communaute</froala>
            <h2 class="title mt-1 mb-2">Philosophie:</h2>
            <froala
              :tag="'textarea'"
              :config="config"
              v-model="philosophie"
            >philosophie de la communaute</froala>
        },
                    
        <v-btn
              :disabled="!valid || submiting || !name   "
              color="blue darken-1"
              text
              @click="save()"
            >{{(submiting)?$t("createproject.f_runbutton"):$t("createproject.f_button")}}</v-btn>
          </v-card-text>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  title: {
    inner: "Creer une competition",
    separator: " | ",
    complement: process.env.APP_NAME
  },
  meta: [
    { name: "description", content: "pages de creation de la competition" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: process.env.twitter_name },
    {
      name: "twitter:title",
      content: `Creer competition | ${process.env.APP_NAME}`
    },
    {
      name: "twitter:description",
      content: "pages de creation de la competition"
    },
    { name: "twitter:image", content: "/assets/img/apple-icon.png" },
    { property: "fb:app_id", content: "123456789" },
    {
      property: "og:title",
      content: `Creer competition | ${process.env.APP_NAME}`
    },
    { property: "og:site_name", content: `${process.env.APP_NAME}` },
    {
      property: "og:url",
      content: `${process.env.BASE_URL || ""}/dashboard/competition/create`
    },
    { property: "og:description", content: "description" },
    { property: "og:image", content: "/assets/img/apple-icon.png" },
    { property: "og:image:type", content: "image/png" },
    { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
  ],
  mounted() {
    this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get("voter")));
    this.previewSrc = this.previewDefaultSrc;
    this.competition();
    this.$root.$emit("loadStatus", { status: false });
  },
  data() {
    return {
      submiting: false,
      voter: {},
      userules: '',
      philosophie: '',
      id: '',
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
      valid: false,
      gradient: "",
      description: null,
      name: "",
      short_description: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 150) || "Name must be less than 150 characters"
      ],
      shortDescriptionRules: [
        v => !!v || "Short Description is required",
        v =>
          (v && v.length <= 150) ||
          "Short Description must be less than 150 characters"
      ],
      descriptionRules: [
        v => !v || true,
        v =>
          !v || v.length <= 2000 || "Descript must be less than 2000 characters"
      ],
      dialog: false,
      cathegoriesList: [],
      projectimg: null,
      previewLoad: false,
      cathegories: [],
      rules: [
        value => {
          if (!value) {
            return "Select an Image";
          }
          if (value.size > 10000000) {
            return "Project image size should be less than 10 MB!";
          }
          return true;
        }
      ],
      loading: false,
      previewDefaultSrc: require("@/assets/img/defaultPreview.svg"),
      previewSrc: ""
    };
  },
  props: {
    openClose: Boolean,
    theme: String,
    desktop: Boolean
  },
  watch: {
    openClose() {
      this.dialog = this.openClose;
    }
  },
  methods: {
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
    getCompetiton() {
      this.$axios
        .get("/api/competition")
        .then(({ data }) => {
          if (data.status) {
            this.id= data.competition._id
            this.description = data.competition.description;
            this.userules = data.competition.userules;
            this.philosophie = data.competition.philosophie;
          } 
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.getCompetiton
          });
        });
    },
    save() {
      this.submiting = true;
      let data = {};
      data.name = this.name;
      data.description = this.description;
      data.philosophie = this.philosophie;
      data.philosophie = this.philosophie;
      this.$axios
        .put("/api/competition/"+this.id, data, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            if (this.projectimg) {
              return this.sendImage(data.project._id);
            }
            this.submiting = false;
            this.$root.$emit("snackbar", {
              display: true,
              text: "competition infos updated white success."
            });
          } else {
            this.submiting = false;
            this.valid = false;
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snackbar", {
            display: true
          });
          this.$root.$emit("neterror", { err: err, callback: this.save });
        });
    },
    close() {
      this.$emit("close");
    },
    sendImage(projectId) {
      let formData = new FormData();
      formData.append("document", this.projectimg);
      formData.append("name", `${this.name}_project_${this.voter.name}`);
      formData.append("type", this.projectimg.type.replace("image/", ""));
      formData.append("cathegorie", "image");

      this.$axios
        .post("/api/doc", formData, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN"),
            enctype: "multipart/form-data"
          }
        })
        .then(({ data }) => {
          if (data.status) {
            this.updateImgRef(data.document._id, projectId);
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: JSON.stringify(data.errors)
            });
            this.submiting = false;
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snacbar", {
            display: true
          });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.sendImage,
            data: projectId
          });
        });
    },
    updateImgRef(docId, projectId) {
      this.$axios
        .get(`/api/project/${projectId}/${docId}`)
        .then(({ data }) => {
          this.submiting = false;
          if (data.status) {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Project create whit success."
            });
            this.$router.push("/dashboard/projects");
          } else {
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snackbar", {
            display: true
          });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.updateImgRef,
            data: { docId, projectId }
          });
        });
    },
    file(file) {
      this.projectimg = file;
      this.previewLoad = true;

      var reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.previewSrc = reader.result;
          this.previewLoad = false;
        }, 500);
      };
      reader.readAsDataURL(file);
    },
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
    compress(e) {
      const width = 400;
      const height = 300;
      const fileName = e.name;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        (img.onload = () => {
          const elem = document.createElement("canvas");
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext("2d");
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            blob => {
              const file = new File([blob], fileName, {
                type: "image/jpeg",
                lastModified: Date.now()
              });
            },
            "image/jpeg",
            1
          );
        }),
          (reader.onerror = error => console.log(error));
      };
    }
  },
  computed: {}
};
</script>

<style lang="css" scoped>
.v-form {
  width: 100%;
}
</style>

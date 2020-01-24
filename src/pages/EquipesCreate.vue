<template>
  <v-container :fluid="true">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col
          cols="12"
          md="4"
          offset-md="1"
          offset-lg="0"
          lg="5"
          :order="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)?'first':'last'"
        >
          <p align="center">{{$t("createproject.f_img")}}</p>
          <v-row justify="center">
            <v-img
              @drop.prevent="addFile"
              @dragleave.prevent="gradient=''"
              @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
              :lazy-src="previewSrc"
              :src="previewSrc"
              max-width="300"
              max-height="300"
              :gradient="gradient"
              @click="getImg"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-row>
          <v-row align="center">
            <label for="editionimg" hidden>
              <p>{{$t("createproject.f_img")}}</p>
            </label>
            <input
              hidden
              name="editionimg"
              id="editionimg"
              type="file"
              @input="checkFile"
              accept="image/*"
            />
          </v-row>
        </v-col>
        <v-col cols="12" md="6" offset-md="1" offset-lg="1" lg="6">
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
            <h2 class="title mt-1 mb-2">Theme:</h2>
            <v-text-field v-model="theme" :label="'Theme'" required solo max-length="150"></v-text-field>
            <h2 class="title mt-1 mb-2">Slogan:</h2>
            <v-text-field v-model="slogan" :label="'slogan'" required solo max-length="150"></v-text-field>
            <v-switch color="primary" :label="$t('pollCreate.startNowLabel')" v-model="startNow"></v-switch>

            <v-dialog
              ref="startDialog"
              v-model="startDateModal"
              :return-value.sync="startDate"
              persistent
              v-if="!startNow"
              max-width="500px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDate"
                  :label="$t('pollCreate.startDate')"
                  prepend-icon="event"
                  solo
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                :allowed-dates="allowedStartDates"
                :landscape="!$vuetify.breakpoint.xs"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="startDateModal = false"
                >{{$t("pollCreate.cancel")}}</v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.startDialog.save(startDate)"
                >{{$t("pollCreate.ok")}}</v-btn>
              </v-date-picker>
            </v-dialog>
            <v-dialog
              max-width="500px"
              ref="endDialog"
              v-model="endDateModal"
              :return-value.sync="endDate"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDate"
                  :label="$t('pollCreate.endDate')"
                  prepend-icon="event"
                  readonly
                  solo
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                :allowed-dates="allowedEndDates"
                :landscape="!$vuetify.breakpoint.xs"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="endDateModal = false"
                >{{$t('pollCreate.cancel')}}</v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.endDialog.save(endDate)"
                >{{$t('pollCreate.ok')}}</v-btn>
              </v-date-picker>
            </v-dialog>
            <h2 class="title mt-1 mb-2">{{$t("createproject.description")}}:</h2>
            <froala
              :tag="'textarea'"
              :config="config"
              v-model="description"
            >Un mot au suject de cette edition</froala>

            <v-btn
              :disabled="!valid || submiting || !theme || !data_debut || (!startNow&&!startDate) || !endDate   "
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
    inner: "Creer une Edition",
    separator: " | ",
    complement: process.env.APP_NAME
  },
  meta: [
    { name: "description", content: "pages de creation d'une edition" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: process.env.twitter_name },
    {
      name: "twitter:title",
      content: `Creer edition | ${process.env.APP_NAME}`
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
    this.$root.$emit("loadStatus", { status: false });
  },
  data() {
    return {
      submiting: false,
      voter: {},
      startDate: null,
      endDate: null,
      startNow: true,
      endDateModal: false,
      startDateModal: false,
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
      theme: "",
      date_debut: "",
      date_fint: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 150) || "Name must be less than 150 characters"
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
    allowedStartDates(val) {
      if (!this.endDate) {
        return new Date(val) >= new Date();
      } else {
        return (
          new Date(val) >= new Date() && new Date(val) <= new Date(this.endDate)
        );
      }
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
    loadToggle(status) {
      this.$root.$emit("loadStatus", { status: status });
    },
    save() {
      this.submiting = true;
      let data = {};
      data.name = this.name;

      data.description = this.description;
      data.cathegories = this.cathegories;
      this.$axios
        .post("/api/project", data, {
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
              text: "competition create whit success."
            });
            this.$router.push("/dashboard/projects");
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
      var e = document.getElementById("editionimg");
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

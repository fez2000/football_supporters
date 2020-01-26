<template>
  <v-container>
    <v-row>
      <v-col v-if="(donthaveedition) || (edition&& edition.is_end)" cols="12">
        <md-empty-state
          md-icon="soccer"
          :md-label="'Pas d\'edition courante'"
          :md-description="'Vous n\'avez pas d\'edition en cour, creez en une!'"
        >
          <md-button @click="goToCreateEdition()" class="md-primary md-raised">creer une competition</md-button>
        </md-empty-state>
      </v-col>
      <v-col v-if="mode == 'edit'">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="11">
              <v-card-text>
                <h2 class="title mt-1 mb-2">{{$t("createproject.f_name")}}:</h2>
                <v-text-field
                  v-model="edit2.name"
                  :label="$t('createproject.f_name')"
                  required
                  solo
                  max-length="150"
                ></v-text-field>
                <h2 class="title mt-1 mb-2">Slogan:</h2>
                <v-text-field
                  v-model="edit2.slogan"
                  :label="'slogan'"
                  required
                  solo
                  max-length="150"
                ></v-text-field>
                <h2 class="title mt-1 mb-2">Participants:</h2>
                <v-text-field
                  :label="'nombre'"
                  v-model="edit2.nombre_participant"
                  single-line
                  solo
                  type="number"
                  style="width: 60px"
                ></v-text-field>

                <v-dialog
                  ref="startDialog"
                  v-model="startDateModal"
                  :return-value.sync="edit2.date_debut"
                  persistent
                  max-width="500px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="edit2.date_debut"
                      :label="$t('pollCreate.startDate')"
                      prepend-icon="event"
                      solo
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="edit2.date_debut"
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
                      @click="$refs.startDialog.save(edit2.date_debut)"
                    >{{$t("pollCreate.ok")}}</v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-dialog
                  max-width="500px"
                  ref="endDialog"
                  v-model="endDateModal"
                  :return-value.sync="edit2.date_fin"
                  persistent
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="edit2.date_fin"
                      :label="$t('pollCreate.endDate')"
                      prepend-icon="event"
                      readonly
                      solo
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="edit2.date_fin"
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
                      @click="$refs.endDialog.save(edit2.date_fin)"
                    >{{$t('pollCreate.ok')}}</v-btn>
                  </v-date-picker>
                </v-dialog>
                <h2 class="title mt-1 mb-2">{{$t("createproject.description")}}:</h2>
                <froala
                  :tag="'textarea'"
                  :config="config"
                  v-model="edit2.description"
                >Un mot au suject de cette edition</froala>

                <v-btn
                  :disabled="!valid || submiting  || !edit2.name || !edit2.date_debut || !edit2.date_fin   "
                  color="blue darken-1"
                  text
                  @click="save()"
                >{{(submiting)?$t("createproject.f_runbutton"):$t("createproject.f_button")}}</v-btn>

                <v-btn @click="mode = 'read'" color="red">Annuler</v-btn>
              </v-card-text>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col v-if="edition && mode == 'read'" cols="12">
        <v-card>
          <v-card-title>{{edition.name}}</v-card-title>
          <v-card-subtitle>
            {{edition.slogan}}
            <br />
            le nombre de equipes {{edition.nombre_participant}}
          </v-card-subtitle>
          <v-card-text>
            <froalaView v-model="edition.description"></froalaView>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!edition.is_end"
              @click="edit2 = edition; mode = 'edit'"
              text
              color="primary"
            >Modifier</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="sup()" color="red" text>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="editions" :search="search"></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mode_exact } from "@/fonctions";
export default {
  head: {
    title: {
      inner: "Editions",
      separator: " | ",
      complement: process.env.APP_NAME
    }
  },
  data() {
    return {
      mode: "read",
      edition: null,
      headers: [
        {
          text: "Nom de l'edition",
          align: "left",
          filterable: true,
          value: "name"
        },
        { text: "Nombre d'equipe", value: "nombre_participant" },
        { text: "Slogan", value: "slogan" },
        { text: "Date de debut", value: "date_debut" },
        { text: "Date de fin", value: "date_fin" },
        { text: "Encour", value: "is_end" }
      ],
      editions: [],
      donthaveedition: false,
      search: "",
      edit2: "",
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
        toolbarSticky: false,
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
      dialog: false,
      submiting: false
    };
  },
  created() {
    this.getCurrent();
    this.getEdition();
  },
  methods: {
    save() {
      this.submiting = true;

      this.$axios
        .put("/api/edition/" + this.edit2._id, this.edit2, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            this.edition = this.edit2;
            this.mode = "read";
            this.submiting = false;
            this.$root.$emit("snackbar", {
              display: true,
              text: "Edition create whit success."
            });
            this.$router.push("/dashboard/editions");
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: data.errors
            });
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
    sup() {
      this.$axios
        .delete("/api/edition/" + this.edition._id)
        .then(({ data }) => {
          if (data.status) {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Edition delete white success."
            });
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Edition delete failled."
            });
          }
        });
    },
    getCurrent() {
      this.$axios
        .get("/api/edition/current")
        .then(({ data }) => {
          this.$root.$emit("loadStatus", { status: false });
          if (data.status) {
            
            this.edition = data.edition;

            this.edition.date_debut = "";
            this.edition.date_fin = "";
          }else{
            this.donthaveedition = true;
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", { err: err, callback: this.getCurrent });
        });
    },
    allowedStartDates(val) {
      if (!this.endDate) {
        return new Date(val) >= new Date();
      } else {
        return (
          new Date(val) >= new Date() && new Date(val) <= new Date(this.endDate)
        );
      }
    },
    allowedEndDates(val) {
      if (!this.startDate) {
        return new Date(val) >= new Date();
      } else {
        return (
          new Date(val) >= new Date() &&
          new Date(val) >= new Date(this.startDate)
        );
      }
    },
    goToCreateEdition() {
      this.$root.$emit("loadStatus", { status: true });
      this.$router.push("/dashboard/editions/create");
    },
    getEdition() {
      this.$axios.get("/api/edition").then(({ data }) => {
        if (data.length) {
          for (let e of data) {
            e.is_end = e.is_end ? "Fini" : "Encour";
            e.date_debut = mode_exact(e.date_debut);
            e.date_fin = mode_exact(e.date_fin);
            this.editions.push(e);
          }
        }
      });
    }
  }
};
</script>

<style>
</style>
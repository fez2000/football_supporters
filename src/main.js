import "babel-polyfill";
import "core-js";
import Vue from "vue";
import VueRouter from "vue-router";
import VueHead from "vue-head";
import Chartist from "chartist";
import axios from "axios";
import Cookies from "js-cookie";

import VueI18n from "vue-i18n";

import { EmojiConvertor } from "emoji-js";
import VuePlyr from "vue-plyr";
import SocialSharing from "vue-social-sharing";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";
import MaterialKit from "./plugins/material-kit";
import "vue-plyr/dist/vue-plyr.css";
import "intersection-observer";

// configure router
const router = new VueRouter({
    mode: "history",
    routes, // short for routes: routes
    linkExactActiveClass: "nav-item active",
    beforeRouteUpdate(to, from, next) {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        this.transitionName =
            toDepth < fromDepth ? "slide-right" : "slide-left";
        next();
    }
});

Vue.config.productionTip = false;

const NavbarStore = {
    showNavbar: false
};

const socket = io("/", {
    query: {
        Token: Cookies.get("XSRF-TOKEN")
    }
});
socket.on("reconnect_attempt", () => {
    socket.io.opts.query = {
        Token: Cookies.get("XSRF-TOKEN")
    };
});

Vue.prototype.$Chartist = Chartist;
Vue.prototype.$axios = axios;
Vue.prototype.$Cookies = Cookies;
Vue.prototype.$socket = socket;
Vue.prototype.$emoji = new EmojiConvertor();
Vue.prototype.$emoji.include_title = true;
Vue.prototype.$emoji.img_set = "emojione";

// Configure this library to use the sheets defined in `img_sets` (see above)
Vue.prototype.$emoji.use_sheet = true;
Vue.prototype.$emoji.img_sets.apple.path =
    "https://unpkg.com/emoji-datasource-emojione@4.0.4/img/emojione/";
Vue.use(VueRouter);
Vue.use(VueHead);
Vue.use(MaterialKit);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.use(VuePlyr);
Vue.use(VueI18n);
Vue.use(SocialSharing);

Vue.mixin({
    data() {
        return {
            NavbarStore
        };
    }
});

/* eslint-disable no-new */
new Vue({
    el: "#app",
    render: h => h(App),
    vuetify,
    router,
    i18n,
    socket,
    data: {
        Chartist
    },
    methods: {
        axios,
        Cookies
    },
    head: {}
});

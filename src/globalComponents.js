import LinkPrevue from "link-prevue";
import VueDocPreview, { vueDocPreview } from "vue-doc-preview";
import pdf from "./components/pdf/vuePdfSss.vue";
import DropDown from "./components/Dropdown.vue";
import LInput from "./components/LInput.vue";
import LLocationInput from "./components/LLocationInput.vue";
import EditJoueurs from "./components/EditJoueurs.vue";
import VueFeedbackReaction from "@/components/VueFeedbackReaction.vue";
import PdfCard from "@/components/Cards/PdfCard.vue";
import SocialsLinks from "@/components/SocialsLinks.vue";
import Paiement from "./components/Paiement.vue";
import PreviewJoueurs from "@/components/PreviewJoueurs.vue";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
    install(Vue) {
        Vue.component("preview-joueurs", PreviewJoueurs);
        Vue.component("edit-joueurs", EditJoueurs);
        Vue.component("drop-down", DropDown);
        Vue.component("l-input", LInput);
        Vue.component("l-location-input", LLocationInput);
        Vue.component("link-preview", LinkPrevue);
        Vue.component("feed-back-reaction", VueFeedbackReaction);
        Vue.component("pdf-preview", pdf);
        Vue.component("pdf-card", PdfCard);
        Vue.component("doc-preview", VueDocPreview);
        Vue.component("socials-links", SocialsLinks);
        Vue.component("paiement", Paiement);
    }
};

export default GlobalComponents;

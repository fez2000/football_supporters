import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import '../assets/scss/material-kit.scss';
import '../assets/demo.css';
import VueLazyload from 'vue-lazyload';
import VueCarousel from 'vue-carousel';
import globalDirectives from './globalDirectives';
import globalMixins from './globalMixins';
import globalComponents from './globalComponents';


export default {
  install(Vue) {
    Vue.use(VueMaterial);
    Vue.use(globalDirectives);
    Vue.use(globalMixins);
    Vue.use(globalComponents);
    Vue.use(VueCarousel);
    Vue.use(VueLazyload, {
      observer: true,
      // optional
      observerOptions: {
        rootMargin: '0px',
        threshold: 0.1,
      },
    });
  },
};

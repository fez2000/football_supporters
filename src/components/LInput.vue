<template>
  <div>
    <span v-if="label" :class="labelClass">{{ label }}</span>

    <div class="d-flex mt-3">
      <textarea
        hidden
        ref="p"
        v-model="a"
        :style="pStyle"
        :class="pClass"
        :placeholder="placeholder"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { util } from "@/fonctions/emojis";
import {
  replaceAllBy,
  insertTextAtIndices,
  traitement_text
} from "@/fonctions/post";
export default {
  name: "l-input",
  props: {
    label: {
      type: String,
      default: ""
    },
    init: {},
    inline: {
      type: Boolean,
      default: true
    },
    labelClass: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ""
    },
    emptyStyle: {
      type: String,
      default: `flex-grow:1;width:auto; font-size: 14px; color: '#888'; display: inline-flex`
    },
    emptyClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      first: true,
      text: "",
      selection: null,
      elm: null,
      position: 0,
      valueFiltered: "",
      menu: false,
      selected: "point_up",
      hasFocus: false,
      a: ""
    };
  },
  methods: {
    insertTextAtIndices,

    enterUpdate(o) {
      this.$emit("value", this.$refs.p.innerText);
      //  this.text = o.target.innerText   ;
    },

    replaceAllBy,
    desable() {
      this.$refs.p.emojioneArea.desable();
    },
    enable() {
      this.$refs.p.emojioneArea.enable();
    }
  },
  watch: {
    clear() {
      this.first = true;
      this.$refs.p.emojioneArea.setText("");
    },
    init() {
      if (this.first) {
        this.first = false;
        if (this.$refs.p.emojioneArea) {
          this.$refs.p.emojioneArea.setText(this.init);
        } else {
          this.a = this.init;
        }
      }
    },
    text() {
      this.$emit("value", this.text);
    },
    disabled() {
      if (this.disabled) {
        this.desable();
      } else {
        this.enable();
      }
    }
  },

  created() {
    this.text = this.value;
  },
  computed: {
    pClass() {
      return this.value ? this.$Attr.class : this.emptyClass;
    },
    pStyle() {
      return this.value ? this.$Attr.style : this.emptyStyle;
    }
  },

  mounted() {
    $(this.$refs.p).emojioneArea({
      emojiPlaceholder: "emoji",
      pickerPosition: "bottom",
      filtersPosition: "top",
      searchPosition: "bottom",
      inline: this.inline,
      autocomplete: false,
      textcomplete: {
        maxCount: 8,
        placement: "top"
      },
      attributes: {
        dir: "ltr",
        spellcheck: true,
        autocomplete: "on",
        autocorrect: "on",
        autocapitalize: "on"
      },
      events: {
        keyup: (editor, event) => {
          this.$emit("value", this.$refs.p.emojioneArea.getText());
        },
        paste: (editor, event) => {
          this.$emit("value", this.$refs.p.emojioneArea.getText());
        },
        change: (editor, event) => {
          this.$emit("value", this.$refs.p.emojioneArea.getText());
        }
      }
    });

    if (this.$refs.p.emojioneArea) {
      this.$refs.p.emojioneArea.setText(this.init);
    } else {
      this.a = this.init;
    }
  },
  beforeDestroy() {}
};
</script>

<style>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
}

.embedded-link {
  color: primary;
}
/*[data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #888;
    font-style: italic;
    }*/
</style>

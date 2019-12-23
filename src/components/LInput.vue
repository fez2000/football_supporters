<template>
  <div>
    <span v-if="label" :class="labelClass">{{ label }}</span>

    <div class="d-flex mt-3">
      <textarea ref="p" v-model="a" :style="pStyle" :class="pClass" :placeholder="placeholder"></textarea>
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" dark icon>
            <v-icon>mdi-emoticon-happy-outline</v-icon>
          </v-btn>
        </template>
        <emojis-picker
          set="emojione"
          :showSkinTones="false"
          @select="addEmoji"
          title="Pick your emoji…"
          :emoji="selected"
          :i18n="{
                        search: 'Recherche',
                        categories: {
                            search: 'Résultats de recherche',
                            recent: 'Récents'
                        }
                    }"
        />
      </v-menu>
    </div>
  </div>
</template>

<script>
import { wrapEmoji, mousedown, util } from "@/fonctions/emojis";
import {
  replaceAllBy,
  insertTextAtIndices,
  traitement_text,
  blockHtml
} from "@/fonctions/post";
export default {
  name: "l-input",
  props: {
    label: {
      type: String,
      default: ""
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
    clear: {
      type: String,
      default: ""
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
    blockHtml,
    traitement_text,
    addEmoji(e) {
      this.valueFiltered += this.$emoji.replace_unified(e.native);
      this.$refs.p.focus();
      a = `${a}${e.native}`;
      // this.$refs.p.value += e.native;
      //this.setCaretPos(this.$refs.p, this.position)
      util.insertAtCursor(e.native, this.$refs.p);
      // this.text = this.$refs.p.innerText;
      this.$emit("value", this.$refs.p.value);
    },
    insertTextAtIndices,

    enterUpdate(o) {
      this.position = this.getCaretPosition(this.$refs.p);

      this.$emit("value", this.$refs.p.innerText);
      //  this.text = o.target.innerText   ;
    },
    wrapEmoji,
    update(o) {
      if (this.$refs.p.innerText) {
        this.position = this.getCaretPosition(this.$refs.p);
      }
      if (!o.data) return;

      this.$emit("value", this.$refs.p.value);

      return false;
    },
    getCaretPosition(element) {
      var ie =
        typeof document.selection != "undefined" &&
        document.selection.type != "Control" &&
        true;
      var w3 = typeof window.getSelection != "undefined" && true;
      var caretOffset = 0;
      if (w3) {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);

        preCaretRange.setEnd(range.endContainer, range.endOffset);

        caretOffset = preCaretRange.toString().length;
      } else if (ie) {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.expand(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },
    mousedown,
    setCaretPos(el, sPos) {
      /*range = document.createRange();                    
        range.setStart(el.firstChild, sPos);
        range.setEnd  (el.firstChild, sPos);*/
      var charIndex = 0,
        range = document.createRange();
      range.setStart(el, 0);
      range.collapse(true);
      var nodeStack = [el],
        node,
        foundStart = false,
        stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
          var nextCharIndex = charIndex + node.length;
          if (!foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
            range.setStart(node, sPos - charIndex);
            foundStart = true;
          }
          if (foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
            range.setEnd(node, sPos - charIndex);
            stop = true;
          }
          charIndex = nextCharIndex;
        } else {
          var i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }
      this.selection = window.getSelection();
      this.selection.removeAllRanges();
      this.selection.addRange(range);
    },
    replaceAllBy,
    getCodePoint(chaine, indice) {
      function toUTF16(codePoint) {
        var TEN_BITS = parseInt("1111111111", 2);
        function u(codeUnit) {
          return "\\u" + codeUnit.toString(16).toUpperCase();
        }

        if (codePoint <= 0xffff) {
          return u(codePoint);
        }
        codePoint -= 0x10000;

        // Shift right to get to most significant 10 bits
        var leadSurrogate = 0xd800 + (codePoint >> 10);

        // Mask to get least significant 10 bits
        var tailSurrogate = 0xdc00 + (codePoint & TEN_BITS);

        return u(leadSurrogate) + u(tailSurrogate);
      }
      return String.fromCodePoint(chaine.codePointAt(indice));
    }
  },
  watch: {
    clear() {
      if (this.clear) this.text = "";
    },
    a() {
      this.$emit("value", this.a);
    },
    text() {
      this.$emit("value", this.text);

      this.valueFiltered = this.traitement_text(this.text);

      this.$refs.p.innerHTML = this.$emoji.replace_unified(this.valueFiltered);

      this.setCaretPos(this.$refs.p, this.position);
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
    },
    enable() {
      return this.disabled ? "false" : "true";
    }
  },

  mounted() {
    this.$refs.p.addEventListener("focus", () => {
      this.hasFocus = true;
    });
    this.$refs.p.addEventListener("blur", () => {
      this.hasFocus = false;
    });

    /*
     * MODIFICATION: Following line was added by Igor Zhukov, in order to
     * save recent emojis
     */

    window.emojiPicker = new EmojiPicker({
      emojiable_selector: "[data-emojiable=true]",
      assetsPath: "/assets/img",
      popupButtonClasses: "fa fa-smile-o"
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    window.emojiPicker.discover();
    window.addEventListener("mousedown", mousedown);
  },
  beforeDestroy() {
    window.removeEventListener("mousedown", mousedown);
  }
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
span.emoji {
  display: -moz-inline-box;
  -moz-box-orient: vertical;
  display: inline-block;
  vertical-align: baseline;
  *vertical-align: auto;
  *zoom: 1;
  *display: inline;
  width: 24px;
  height: 24px;
  background-size: 24px;
  background-repeat: no-repeat;
  text-indent: -9999px;
  background-position: 50%, 50%;
  background-size: contain;
}

span.emoji-sizer {
  line-height: 0.81em;
  font-size: 24px;
  margin: -2px 0;
}

span.emoji-outer {
  display: -moz-inline-box;
  display: inline-block;
  *display: inline;
  height: 24px;
  width: 24px;
}

span.emoji-inner {
  display: -moz-inline-box;
  display: inline-block;
  text-indent: -9999px;
  width: 100%;
  height: 100%;
  vertical-align: baseline;
  *vertical-align: auto;
  *zoom: 1;
}

img.emoji {
  width: 24px;
  height: 24px;
}
.emoji-mart-body .emoji-type-image.emoji-set-emojione {
  background-image: url(/assets/img/emojione-4.0.4-sheets-256-64.png);
}
</style>

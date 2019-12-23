import emojiRegex from "emoji-regex";

import data from "emoji-mart-vue/data/all.json";

import { EmojiIndex, Emoji } from "emoji-mart-vue-fast";
const unicodeEmojiRegex = emojiRegex();
const emojiIndex = new EmojiIndex(data);
export function wrapEmoji(text) {
    return text.replace(unicodeEmojiRegex, function(match, offset) {
        const before = text.substring(0, offset);

        if (
            text.endsWith(before, 'alt="') ||
            text.endsWith(before, 'data-text="')
        ) {
            // Emoji inside the replaced <img>
            return match;
        }
        // Find emoji object by native emoji.
        let emoji = emojiIndex.nativeEmoji(match);
        if (!emoji) {
            // Can't find unicode emoji in our index
            return match;
        }
        // See `emojiToHtml` function above.
        return emojiToHtml(emoji);
    });
}

/**
 * Convert Emoji to HTML to represent it as an image.
 */
export function emojiToHtml(emoji) {
    console.log(emoji);
    // let emoji = new Emoji();
    let style = `background-position: ${emoji.getPosition()}`;
    // The src="data:image..." is needed to prevent border around img tags.
    return `<img data-text="${emoji.native}" alt="${emoji.colons}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class='emoji-text' style="${style}">`;
}

export var util = {};

util.restoreSelection = (function() {
    if (window.getSelection) {
        return function(savedSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSelection.length; i < len; ++i) {
                sel.addRange(savedSelection[i]);
            }
        };
    } else if (document.selection && document.selection.createRange) {
        return function(savedSelection) {
            if (savedSelection) {
                savedSelection.select();
            }
        };
    }
})();

util.saveSelection = (function() {
    if (window.getSelection) {
        return function() {
            var sel = window.getSelection(),
                ranges = [];
            if (sel.rangeCount) {
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    ranges.push(sel.getRangeAt(i));
                }
            }
            return ranges;
        };
    } else if (document.selection && document.selection.createRange) {
        return function() {
            var sel = document.selection;
            return sel.type.toLowerCase() !== "none" ? sel.createRange() : null;
        };
    }
})();

util.replaceSelection = (function() {
    if (window.getSelection) {
        return function(content) {
            var range,
                sel = window.getSelection();
            var node =
                typeof content === "string"
                    ? document.createTextNode(content)
                    : content;
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                //range.insertNode(document.createTextNode(''));
                range.insertNode(node);
                range.setStart(node, 0);

                window.setTimeout(function() {
                    range = document.createRange();
                    range.setStartAfter(node);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }, 0);
            }
        };
    } else if (document.selection && document.selection.createRange) {
        return function(content) {
            var range = document.selection.createRange();
            if (typeof content === "string") {
                range.text = content;
            } else {
                range.pasteHTML(content.outerHTML);
            }
        };
    }
})();

util.insertAtCursor = function(text, el) {
    text = " " + text;
    var val = el.value,
        endIndex,
        startIndex,
        range;
    if (
        typeof el.selectionStart != "undefined" &&
        typeof el.selectionEnd != "undefined"
    ) {
        startIndex = el.selectionStart;
        endIndex = el.selectionEnd;
        el.value =
            val.substring(0, startIndex) +
            text +
            val.substring(el.selectionEnd);
        el.selectionStart = el.selectionEnd = startIndex + text.length;
    } else if (
        typeof document.selection != "undefined" &&
        typeof document.selection.createRange != "undefined"
    ) {
        el.focus();
        range = document.selection.createRange();
        range.text = text;
        range.select();
    }
};

util.extend = function(a, b) {
    if (typeof a === "undefined" || !a) {
        a = {};
    }
    if (typeof b === "object") {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
    }
    return a;
};

util.escapeRegex = function(str) {
    return (str + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

util.htmlEntities = function(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
};

export function paste(e) {
    e.preventDefault();
    var content;
    var charsRemaining = this.maxlength - this.text.length;
    if ((e.originalEvent || e).clipboardData) {
        content = (e.originalEvent || e).clipboardData.getData("text/plain");
        if (self.options.onPaste) {
            content = self.options.onPaste(content);
        }
        if (charsRemaining < content.length) {
            content = content.substring(0, charsRemaining);
        }
        document.execCommand("insertText", false, content);
    } else if (window.clipboardData) {
        content = window.clipboardData.getData("Text");
        if (self.options.onPaste) {
            content = self.options.onPaste(content);
        }
        if (charsRemaining < content.length) {
            content = content.substring(0, charsRemaining);
        }
        document.selection.createRange().pasteHTML(content);
    }
}
export function mousedown() {
    if (this.hasFocus) {
        this.selection = util.saveSelection();
    }
}

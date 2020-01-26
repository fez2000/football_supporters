<template>
    <vuetify-google-autocomplete
        ref="address"
        :id="id"
        :value="value"
        :solo="solo"
        :color="color"
        :types="types"
        :label="label"
        :mutiLine="multiLine"
        v-on:placechanged="getAddressData"
        :country="country"
        :clearable="clearable"
    >
    </vuetify-google-autocomplete>
</template>

<script>
export default {
    props: {
        appendIcon: {
            type: String,
            default: undefined
        },
        appendIconCb: {
            type: Function,
            default: null
        },
        autoGrow: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        box: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: "primary"
        },
        counter: {
            type: [Boolean, Number],
            default: undefined
        },
        country: {
            type: [String, Array],
            default: null
        },
        dark: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        dontFillMaskBlanks: {
            type: Boolean,
            default: false
        },
        enableGeolocation: {
            type: Boolean,
            default: false
        },
        error: {
            type: Boolean,
            default: false
        },
        errorMessages: {
            type: Array,
            default: () => []
        },
        flat: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
        hideDetails: {
            type: Boolean,
            default: false
        },
        hint: {
            type: String,
            default: undefined
        },
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: undefined
        },
        light: {
            type: Boolean,
            default: false
        },
        loadGoogleApi: {
            type: Boolean,
            default: true,
            required: false
        },
        loading: {
            type: [Boolean, String],
            default: false
        },
        mask: {
            type: String,
            default: undefined
        },
        multiLine: {
            type: Boolean,
            default: false
        },
        noResize: {
            type: Boolean,
            default: false
        },
        persistentHint: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: undefined
        },
        prefix: {
            type: String,
            default: undefined
        },
        prependIcon: {
            type: String,
            default: undefined
        },
        prependIconCb: {
            type: Function,
            default: null
        },
        readonly: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        returnMaskedValue: {
            type: Boolean,
            default: false
        },
        rowHeight: {
            type: [Number, String],
            deffault: 24
        },
        rows: {
            type: [Number, String],
            default: 5
        },
        rules: {
            type: Array,
            default: () => []
        },
        singleLine: {
            type: Boolean,
            default: false
        },
        solo: {
            type: Boolean,
            default: false
        },
        soloInverted: {
            type: Boolean,
            default: false
        },
        suffix: {
            type: String,
            default: undefined
        },
        tabindex: {
            default: 0
        },
        textarea: {
            type: Boolean,
            default: false
        },
        toggleKeys: {
            type: Array,
            default: () => [13, 32]
        },
        type: {
            type: String,
            default: "text"
        },
        types: {
            type: String,
            default: "address"
        },
        validateOnBlur: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: undefined,
            required: false
        }
    },
    methods: {
        updateValue: function(value) {
            this.$emit("input", value);
        },
        getAddressData(addressData, placeResultData, id) {
            this.$emit("input", addressData);
        }
    }
};
</script>

<style></style>

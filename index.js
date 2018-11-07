/**
 * * * LOCALE INTL SETTINGS * * *
 * */
const React = require("react")
const { IntlProvider, addLocaleData } = require("react-intl")

async function load() {
    const [module1, module2, module3] = await Promise.all([
        require("intl"),
        require("intl/locale-data/jsonp/en"),
        require("intl/locale-data/jsonp/it"),
        require("intl/locale-data/jsonp/de")
    ])

    return [module1, module2, module3]
}

/* needed in order to user nested translation objects */
const flattenMessages = (nestedMessages, prefix = "") => {
    if (!nestedMessages) {
        return {}
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
        const value = nestedMessages[key] || ""
        const prefixedKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === "string") {
            Object.assign(messages, { [prefixedKey]: value })
        } else {
            Object.assign(messages, flattenMessages(value, prefixedKey))
        }

        return messages
    }, {})
}

const IntlProviderHoc = props => {
    // props.localeData is Our translated strings
    const { localeData = {}, initialLocale = {} } = props

    const localeToAdd = Object.keys(localeData).map(value => ({
        locale: value,
        fields: localeData[value],
        pluralRuleFunction: () => {}
    }))

    addLocaleData(localeToAdd)
    // Define user's language. Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these different by checking all of them

    const language = initialLocale.length
        ? initialLocale
        : (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          navigator.userLanguage ||
          "it"

    // Split locales with a region code
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

    // Try full locale, try locale without region code, fallback to 'en'
    const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en
    // If browser doesn't support Intl (i.e. Safari), then we manually import
    // the intl polyfill and locale data.
    if (!window.Intl) {
        load()
    }

    return (
        <IntlProvider locale={language} key={language} messages={flattenMessages(messages)}>
            {props.children}
        </IntlProvider>
    )
}

module.exports = IntlProviderHoc

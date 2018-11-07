const React = require("react")
const { mount, configure } = require("enzyme")
import Adapter from "enzyme-adapter-react-16"
const IntlProvider = require("../index")
const data = require("./locale/data.json")

configure({ adapter: new Adapter() })

describe("Sxc Localization", () => {
    const mounted = mount(
        <IntlProvider localeData={data}>
            <a>ididid</a>
        </IntlProvider>
    )

    it("should", () => {
        console.log(mounted.props())
    })
})

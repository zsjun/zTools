const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/zsj/work/tools/z-ui/.docz/.cache/dev-404-page.js"))),
  "component---src-components-alert-index-mdx": hot(preferDefault(require("/Users/zsj/work/tools/z-ui/src/components/alert/index.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/zsj/work/tools/z-ui/.docz/src/pages/404.js")))
}


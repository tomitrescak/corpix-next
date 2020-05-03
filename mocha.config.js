require.extensions[".css"] = () => {};

global.jsdom = require("jsdom-global")(undefined, {
  url: "http://localhost",
});

require("@babel/register")({ extensions: [".js", ".jsx", ".ts", ".tsx"] });

// https://umijs.org/config/
import os from "os";
import pageRoutes from "./router.config";
import webpackPlugin from "./plugin.config";
import defaultSettings from "../src/defaultSettings";

const plugins = [
  [
    "umi-plugin-react",
    {
      antd: true,
      dva: {
        hmr: true
      },
      targets: {
        ie: 11
      },
      locale: {
        enable: true, // default false
        default: "zh-CN", // default zh-CN
        baseNavigator: false // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: "./components/PageLoading/index"
      },
      ...(!process.env.TEST && os.platform() === "darwin"
        ? {
            dll: {
              include: ["dva", "dva/router", "dva/saga", "dva/fetch"],
              exclude: ["@babel/runtime"]
            },
            hardSource: true
          }
        : {})
    }
  ]
];

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || "",
    DEP_ENV: process.env.DEP_ENV || "",
    SYS_NAME: process.env.DEP_ENV === "night" ? "夜班" : "白班",
    AUTHORITY_KEY:
      process.env.DEP_ENV === "day"
        ? "authority-day"
        : process.env.DEP_ENV === "night"
          ? "authority-night"
          : "authority-dev"
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    "primary-color": defaultSettings.primaryColor
  },
  externals: {
    "@antv/data-set": "DataSet"
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes("node_modules") ||
        context.resourcePath.includes("ant.design.pro.less") ||
        context.resourcePath.includes("global.less")
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace(".less", "");
        const arr = antdProPath
          .split("/")
          .map(a => a.replace(/([A-Z])/g, "-$1"))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join("-")}-${localName}`.replace(/--/g, "-");
      }
      return localName;
    }
  },
  manifest: {
    name: "ant-design-pro",
    background_color: "#FFF",
    description:
      "An out-of-box UI solution for enterprise applications as a React boilerplate.",
    display: "standalone",
    start_url: "/index.html",
    icons: [
      {
        src: "/favicon.png",
        sizes: "48x48",
        type: "image/png"
      }
    ]
  },

  cssnano: {
    mergeRules: false
  },

  history: "hash", // 切换 history 方式为 hash（默认是 browser history）
  hash: true, // 开启 hash 文件后缀

  proxy: {
    "/api": {
      target: "http://127.0.0.1:8080/sf/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  },

  chainWebpack: webpackPlugin
};

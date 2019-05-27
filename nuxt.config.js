const pkg = require('./package')


module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    'iview/dist/styles/iview.css',
    'element-ui/lib/theme-chalk/index.css',
    'iview-editor/dist/iview-editor.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '@/plugins/iview',
      ssr: true
    },
    {
      src: '@/plugins/iview-editor',
      ssr: false
    },
    {
      src: '@/plugins/ElementUI',
      ssr: true
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [
    [
      '/api',
      {
        target: 'http://localhost:3001', // api主机
        pathRewrite: {
          '^/api': '/'
        }
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}

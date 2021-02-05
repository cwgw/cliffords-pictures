module.exports = {
  flags: {
    DEV_SSR: true,
  },
  siteMetadata: {
    title: "Clifford's Pictures",
    description: "",
    author: "Charlie",
  },
  plugins: [
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'gatsby-starter-default',
    //     short_name: 'starter',
    //     start_url: '/',
    //     background_color: '#663399',
    //     theme_color: '#663399',
    //     display: 'minimal-ui',
    //     icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
    //   },
    // },
    {
      resolve: "cp-source-photos",
      options: {
        path: `${__dirname}/content`,
        withWebp: true,
        withBase64: true,
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-offline",
  ],
};

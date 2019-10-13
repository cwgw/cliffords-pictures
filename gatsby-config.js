module.exports = {
  siteMetadata: {
    title: "Clifford's Pictures",
    description: '',
    author: 'Charlie',
  },
  mapping: {
    // 'FacesJson.person': 'PeopleJson',
    'FacesJson.image': 'ImageSharp.fields.imageID',
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
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        useMozJpeg: true,
        stripMetadata: true,
        defaultQuality: 85,
      },
    },
    'gatsby-plugin-emotion',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    'gatsby-transformer-yaml',
    'gatsby-plugin-offline',
  ],
};

const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};

exports.onCreateNode = ({ node, actions: { createNodeField } }) => {
  if (node.internal.type === 'PhotosJson') {
    createNodeField({
      node,
      name: 'slug',
      value: `/i/${node.id}`,
    });
  }
};

exports.createPages = ({ graphql, actions: { createPage } }) =>
  new Promise((resolve, reject) => {
    const SingleImageTemplate = path.resolve('src/templates/SinglePhoto.js');
    resolve(
      graphql(`
        {
          images: allPhotosJson(sort: { fields: id }) {
            edges {
              node {
                id
                fields {
                  slug
                }
              }
            }
          }
        }
      `).then(({ data, errors }) => {
        if (errors) {
          reject(errors);
        }

        data.images.edges.forEach(({ node }, i, arr) => {
          const next = i + 1 === arr.length ? arr[0].node : arr[i + 1].node;

          const prev = i - 1 < 0 ? arr[arr.length - 1].node : arr[i - 1].node;

          createPage({
            path: node.fields.slug,
            component: SingleImageTemplate,
            context: {
              id: node.id,
              next: next.fields.slug,
              prev: prev.fields.slug,
            },
          });
        });
      })
    );
  });

const path = require('path');
const get = require('lodash/get');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'ImageSharp') {
    const parentFileNode = getNode(node.parent);
    const name = parentFileNode && parentFileNode.name;
    if (name) {
      createNodeField({
        node,
        name: 'imageID',
        value: name,
      });
    }
  }
  if (node.internal.type === 'ImageMetaJson') {
    const slug = `/i/${node.id}`;
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    const SingleImageTemplate = path.resolve('src/templates/SinglePhoto.js');
    resolve(
      graphql(
        `
          {
            images: allImageMetaJson(sort: { fields: id }) {
              edges {
                node {
                  id
                  transform {
                    rotation
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) reject(result.errors);
        result.data.images.edges.forEach(({ node }, i, arr) => {
          const next = i + 1 === arr.length ? arr[0].node : arr[i + 1].node;
          const previous =
            i - 1 < 0 ? arr[arr.length - 1].node : arr[i - 1].node;
          createPage({
            path: node.fields.slug,
            component: SingleImageTemplate,
            context: {
              id: node.id,
              next: next.fields.slug,
              previous: previous.fields.slug,
              imageRotation: get(node, 'transform.rotation', 0),
            },
          });
        });
      })
    );
  });
};

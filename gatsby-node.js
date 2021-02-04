const path = require("path");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  });
};

exports.createPages = ({ actions: { createPage }, graphql }) => {
  return Promise.all([createPhotoPages({ graphql, createPage })]);
};

async function createPhotoPages({ graphql, createPage }) {
  const { data, errors } = await graphql(`
    query {
      allPhoto(sort: { fields: id }) {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `);

  if (errors) {
    throw new Error(errors);
  }

  const albumTemplate = path.resolve("src/templates/AlbumPage.js");
  const photoTemplate = path.resolve("src/templates/SinglePhoto.js");
  const perPage = 12;
  const total = Math.ceil(data.allPhoto.edges.length / perPage);

  data.allPhoto.edges.forEach(({ node }, i, arr) => {
    createPage({
      path: node.slug,
      component: photoTemplate,
      context: {
        id: node.id,
        navigation: {
          next: i + 1 < arr.length ? arr[i + 1].node.slug : null,
          prev: i - 1 >= 0 ? arr[i - 1].node.slug : null,
        },
      },
    });
  });

  Array.from({ length: total }).forEach((el, i) => {
    const index = i + 1;
    const context = {
      limit: perPage,
      skip: i * perPage,
      pagination: {
        index,
        total,
        next: index + 1 < total ? index + 1 : null,
        prev: index - 1 >= 0 ? index - 1 : null,
      },
    };

    createPage({
      path: `/photos/${index}`,
      component: albumTemplate,
      context,
    });

    if (i < 1) {
      createPage({
        path: "/",
        component: path.resolve("src/templates/HomePage.js"),
        context,
      });
    }
  });
}

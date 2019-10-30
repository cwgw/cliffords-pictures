const path = require('path');
const fs = require('fs-extra');

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

exports.createPages = ({ graphql, actions: { createPage }, reporter }) => {
  return graphql(`
    {
      photos: allPhotosJson(sort: { fields: id }) {
        edges {
          node {
            id
            fields {
              slug
            }
            image {
              fluid(maxWidth: 384) {
                src
                srcSet
                srcSetWebp
                srcWebp
                sizes
                aspectRatio
                base64
                width
                height
              }
            }
          }
        }
      }
    }
  `).then(({ data, errors }) => {
    if (errors) {
      reporter.panicOnBuild(errors);
    }
    const HomePage = path.resolve('src/templates/HomePage.js');
    const SinglePhotoTemplate = path.resolve('src/templates/SinglePhoto.js');
    const PaginatedListTemplate = path.resolve(
      'src/templates/PaginatedPhotoList.js'
    );
    const photosJson = data.photos.edges;
    const perPageLimit = 18;
    const total = Math.ceil(photosJson.length / perPageLimit);

    photosJson.forEach(({ node }, i, arr) => {
      const next = i + 1 === arr.length ? arr[0].node : arr[i + 1].node;
      const prev = i - 1 < 0 ? arr[arr.length - 1].node : arr[i - 1].node;
      createPage({
        path: node.fields.slug,
        component: SinglePhotoTemplate,
        context: {
          id: node.id,
          next: next.fields.slug,
          prev: prev.fields.slug,
        },
      });
    });

    Array.from({ length: total }).forEach((_, i, arr) => {
      const photos = photosJson.slice(
        i * perPageLimit,
        i * perPageLimit + perPageLimit
      );

      createPage({
        path: `/page/${i + 1}`,
        component: PaginatedListTemplate,
        context: {
          photos,
          index: i + 1,
          total,
          pagination: {
            prev: i ? `/page/${i}` : null,
            next: i + 2 < arr.length ? `/page/${i + 2}` : null,
          },
        },
      });

      if (!i) {
        createPage({
          path: '/',
          component: HomePage,
          context: {
            photos,
            index: 1,
            total,
            pagination: {
              prev: null,
              next: `/page/2`,
            },
          },
        });
      }

      createPaginationJSON({
        data: {
          data: photos,
          total,
          index: i + 1,
        },
        reporter,
      });
    });
  });
};

const createPaginationJSON = ({ data, reporter }) => {
  const dir = `public/pagination`;
  fs.ensureDir(dir)
    .then(() =>
      fs.writeJSON(path.join(dir, `${data.index}.json`), data).catch(err => {
        reporter.panicOnBuild(`Couldn't write pagination data`, err);
      })
    )
    .catch(err => {
      reporter.panicOnBuild(`Couldn't write pagination data`, err);
    });
};

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
  if (node.internal.type === 'Photo') {
    createNodeField({
      node,
      name: 'slug',
      value: `/photo/${node.id}`,
    });
  }
};

exports.createPages = ({
  actions: { createPage },
  createContentDigest,
  graphql,
  reporter,
}) => {
  return graphql(`
    {
      photos: allPhoto(sort: { fields: id }) {
        edges {
          node {
            id
            fields {
              slug
            }
            aspectRatio
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
              full: fluid(maxWidth: 768) {
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
    const SinglePhoto = path.resolve('src/templates/SinglePhoto.js');
    const ListTemplate = path.resolve('src/templates/PaginatedPhotoList.js');
    const photos = data.photos.edges.map(({ node }) => node);
    const perPageLimit = 18;
    const pageTotal = Math.ceil(photos.length / perPageLimit);

    const hash = createContentDigest({ photos, perPageLimit, pageTotal });

    photos.forEach((node, i, arr) => {
      const next = i + 1 === arr.length ? arr[0] : arr[i + 1];
      const prev = i - 1 < 0 ? arr[arr.length - 1] : arr[i - 1];
      createPage({
        path: node.fields.slug,
        component: SinglePhoto,
        context: {
          id: node.id,
          next: next.fields.slug,
          prev: prev.fields.slug,
        },
      });
    });

    Array.from({ length: pageTotal }).forEach((_, i, arr) => {
      const pageIndex = i + 1;
      const context = {
        pageIndex,
        pageTotal,
        photoTotal: photos.length,
        paginationEndpoint: path.join('static/pagination', hash),
        photos: photos.slice(i * perPageLimit, i * perPageLimit + perPageLimit),
      };

      createPaginationJSON({
        data: context,
        reporter,
      });

      context.prev = pageIndex - 1 > 0 ? `/page/${pageIndex - 1}` : null;
      context.next =
        pageIndex + 1 < pageTotal ? `/page/${pageIndex + 1}` : null;

      createPage({
        path: `/page/${i + 1}`,
        component: ListTemplate,
        context,
      });

      if (!i) {
        createPage({
          path: '/',
          component: HomePage,
          context,
        });
      }
    });
  });
};

const createPaginationJSON = ({ data, reporter }) => {
  const dir = path.join('public', data.paginationEndpoint);
  fs.ensureDir(dir)
    .then(() =>
      fs
        .writeJSON(path.join(dir, `${data.pageIndex}.json`), data)
        .catch(err => {
          reporter.panicOnBuild(`Couldn't write pagination data`, err);
        })
    )
    .catch(err => {
      reporter.panicOnBuild(`Couldn't write pagination data`, err);
    });
};

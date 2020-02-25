const path = require('path');
const fs = require('fs-extra');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require(`gatsby/graphql`);

exports.createSchemaCustomization = (
  { actions, schema },
  { withWebp, withBase64 }
) => {
  const { createTypes } = actions;

  function resolveFluid(node, { maxWidth }) {
    return node.images.reduce(
      (o, { width: size, path, ext }, i, arr) => {
        if (ext === 'webp') {
          if (withWebp) {
            o.srcSetWebp.push(`${path} ${size}w`);
            if (size <= maxWidth) {
              o.srcWebp = path;
            }
          }
        } else {
          o.srcSet.push(`${path} ${size}w`);

          if (size <= maxWidth) {
            o.src = path;
          }

          if (size === maxWidth) {
            o.sizes.push(`${size}px`);
          } else if (size < maxWidth) {
            o.sizes.push(`(max-width: ${size}px) ${size}px`);
          } else if (arr[i - 1] < maxWidth) {
            o.sizes.push(`${size}px`);
          }
        }

        if (i + 1 === arr.length) {
          o.sizes = o.sizes.join(', ');
          o.srcSet = o.srcSet.join(', ');
          o.srcSetWebp = o.srcSetWebp.join(', ');
        }

        return o;
      },
      {
        aspectRatio: node.aspectRatio,
        base64: withBase64 ? node.base64 : null,
        sizes: [],
        srcSet: [],
        srcSetWebp: [],
        width: maxWidth,
        height: Math.round(maxWidth / node.aspectRatio),
      }
    );
  }

  const typeDefs = [
    schema.buildObjectType({
      name: 'Photo',
      fields: {
        image: {
          type: new GraphQLObjectType({
            name: 'PhotoImage',
            fields: {
              fluid: {
                type: new GraphQLObjectType({
                  name: 'PhotoImageFluid',
                  fields: {
                    aspectRatio: { type: GraphQLFloat },
                    base64: { type: GraphQLString },
                    src: { type: GraphQLString },
                    srcSet: { type: GraphQLString },
                    srcWebp: { type: GraphQLString },
                    srcSetWebp: { type: GraphQLString },
                    sizes: { type: GraphQLString },
                    width: { type: GraphQLFloat },
                    height: { type: GraphQLFloat },
                  },
                }),
                resolve: resolveFluid,
                args: {
                  maxWidth: {
                    type: GraphQLInt,
                  },
                },
              },
            },
          }),
          resolve(node) {
            return node;
          },
        },
      },
      interfaces: ['Node'],
      extensions: {
        infer: true,
      },
    }),
  ];

  createTypes(typeDefs);
};

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, reporter },
  options
) => {
  if (!options.path || !fs.existsSync(options.path)) {
    reporter.error(
      new Error(
        `Couldn't find path "${options.path}". Set path in plugin options.`
      )
    );
  }

  const allowedFileExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const dirs = fs.readdirSync(options.path);

  if (dirs.length < 1) {
    reporter.warn(
      `No photo data was found in ${options.path}`,
      'Are you sure you set the right path in plugin options?'
    );
  }

  const pendingNodes = dirs
    .map(async id => {
      if (!fs.existsSync(path.resolve(options.path, id, `data.json`))) {
        return null;
      }

      try {
        const data = await fs.readJSON(
          path.resolve(options.path, id, 'data.json')
        );

        const files = await fs.readdir(path.resolve(options.path, id));

        for (const file of files) {
          const { ext, base } = path.parse(file);

          if (!allowedFileExtensions.includes(ext)) {
            continue;
          }

          await fs.ensureDir(path.resolve('public/photos', id));

          const publicPath = path.join('photos', id, file);

          await fs.copyFile(
            path.resolve(options.path, id, file),
            path.resolve('public', publicPath)
          );

          data.images = [
            ...(data.images || []),
            {
              path: `/${publicPath}`,
              width: parseInt(base, 10),
              ext: ext.split('.').pop(),
            },
          ];
        }

        data.images.sort((a, b) => a.width - b.width);

        return Promise.resolve(
          createNode({
            ...data,
            children: [],
            parent: '__SOURCE__',
            internal: {
              type: 'Photo',
              contentDigest: createContentDigest(data),
            },
          })
        );
      } catch (error) {
        reporter.error(error);
      }
    })
    .filter(o => !!o);

  return Promise.all(pendingNodes);
};

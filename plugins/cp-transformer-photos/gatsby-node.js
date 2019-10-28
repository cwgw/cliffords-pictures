const path = require('path');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require(`gatsby/graphql`);

exports.createSchemaCustomization = (
  { actions, schema },
  { dest, imageSizes, imageFormat: ext, imagePath, withWebp, withBase64 }
) => {
  const { createTypes } = actions;

  function resolveFluid(node, { maxWidth }) {
    const publicPath = ({ size, ext }) => {
      const src = path.join(dest.images, imagePath({ id: node.id, size, ext }));
      return `/${path.relative(dest.images, src)}`;
    };
    const sizes = imageSizes.sort();
    const lg = sizes[sizes.length - 1];

    let fluid = {
      aspectRatio: node.aspectRatio,
      base64: withBase64 ? node.base64 : null,
      width: lg,
      height: Math.round(lg / node.aspectRatio),
      sizes: '',
      src: publicPath({ size: lg, ext }),
      srcSet: sizes
        .map(size => `${publicPath({ size, ext })} ${size}w`)
        .join(', '),
    };

    if (withWebp) {
      fluid.srcWebp = publicPath({ size: lg, ext: 'webp' });
      fluid.srcSetWebp = sizes
        .map(size => `${publicPath({ size, ext: 'webp' })} ${size}w`)
        .join(', ');
    }

    return fluid;
  }

  const typeDefs = [
    schema.buildObjectType({
      name: 'PhotosJson',
      fields: {
        image: {
          type: new GraphQLObjectType({
            name: 'Photo',
            fields: {
              fluid: {
                type: new GraphQLObjectType({
                  name: 'PhotoFluid',
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

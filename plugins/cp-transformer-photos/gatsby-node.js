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
      const staticPath = path.join(
        dest.images,
        imagePath({ id: node.id, size, ext })
      );
      return `/${path.relative('static', staticPath)}`;
    };

    const fluid = imageSizes.reduce(
      (o, size, i, arr) => {
        if (size <= maxWidth) {
          o.src = publicPath({ size, ext });
          o.srcSet.push(`${publicPath({ size, ext })} ${size}w`);
          o.srcWebp = publicPath({ size, ext: 'webp' });
          o.srcSetWebp.push(`${publicPath({ size, ext: 'webp' })} ${size}w`);

          if (size === maxWidth) {
            o.sizes.push(`${size}px`);
          } else {
            o.sizes.push(`(width <= ${size}px) ${size}px`);
          }
        } else if (arr[i - 1] < maxWidth) {
          o.sizes.push(`${size}px`);
          o.srcSet.push(`${publicPath({ size, ext })} ${size}w`);
          o.srcSetWebp.push(`${publicPath({ size, ext: 'webp' })} ${size}w`);
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

    if (!withWebp) {
      fluid.srcWebp = null;
      fluid.srcSetWebp = null;
    }

    fluid.sizes = fluid.sizes.join(', ');
    fluid.srcSet = fluid.srcSet.join(', ');
    fluid.srcSetWebp = fluid.srcSetWebp && fluid.srcSetWebp.join(', ');

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

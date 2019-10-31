/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';

const propTypes = {
  id: PropTypes.string,
  rect: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    center: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }),
};

const FaceScrim = ({ faces, aspectRatio }) => {
  const percentify = n => `${n * 100}%`;
  return (
    <span
      css={css({
        position: 'absolute',
        width: '100%',
        height: 0,
        top: 0,
        left: 0,
        paddingBottom: percentify(1 / aspectRatio),
        fontFamily: 'sans',
        fontWeight: 100,
        fontSize: 'small',
      })}
    >
      {faces.map(({ id, rect }) => (
        <React.Fragment key={id}>
          <span
            style={{
              top: percentify(rect.top),
              left: percentify(rect.left),
              width: percentify(rect.width),
              height: percentify(rect.height),
            }}
            css={css({
              position: 'absolute',
              border: `3px double currentColor`,
              color: 'white',
              opacity: 0.35,
              '&:after': {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                border: '1px solid currentColor',
                borderRadius: '50%',
                content: `''`,
                width: '4px',
                height: '4px',
              },
            })}
          />
          <span
            key={id}
            style={{
              top: percentify(rect.center.y),
              left: percentify(rect.center.x),
              width: percentify(rect.width * 1.5),
              height: percentify(rect.height * 1.5),
            }}
            css={css({
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              border: `1px dotted currentColor`,
              color: 'white',
              '&:after': {
                position: 'absolute',
                right: 0,
                top: '100%',
                content: 'attr(data-ar)',
              },
            })}
            data-ar={Math.round((rect.width / rect.height) * 10000) / 10000}
          />
        </React.Fragment>
      ))}
    </span>
  );
};

FaceScrim.propTypes = propTypes;

export default FaceScrim;

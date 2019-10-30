/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import css from '@styled-system/css';

import Button from 'components/Button';

const propTypes = {
  next: PropTypes.string,
  prev: PropTypes.string,
};

const defaultProps = {
  next: null,
  prev: null,
};

const Pagination = ({ prev, next }) => {
  const directions = [
    {
      slug: prev,
      style: { justifySelf: 'end' },
      text: `←`,
    },
    {
      slug: next,
      style: { gridColumn: 2 },
      text: `→`,
    },
  ];
  return (
    <nav
      css={css({
        marginY: 'lg',
        marginX: 'auto',
        paddingX: 'md',
        maxWidth: '768px',
        boxSizing: 'content-box',
      })}
    >
      <ul
        css={css({
          padding: 0,
          margin: 0,
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: 'md',
        })}
      >
        {directions.map(({ slug, style, text }) => (
          <li
            key={slug}
            css={css({
              display: 'inline-block',
              ...style,
            })}
          >
            <Button to={slug} disabled={!!!slug}>
              {text}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = propTypes;

Pagination.defaultProps = defaultProps;

export default Pagination;

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import feather from 'feather-icons';

const Svg = styled.svg`
  vertical-align: middle;
`;

const propTypes = {
  icon: PropTypes.string,
};

const defaultProps = {};

const Icon = ({ icon, ...props }) => {
  const { attrs, contents } = feather.icons[icon];

  const getAtt = (o, [key, value]) => {
    const map = {
      class: 'className',
      ['stroke-linecap']: 'strokeLinecap',
      ['stroke-linejoin']: 'strokeLinejoin',
      ['stroke-width']: 'strokeWidth',
      xmlns: false,
    };
    if (map[key] === false) return o;
    if (map[key]) return { ...o, [map[key]]: value };
    return { ...o, [key]: value };
  };

  const atts = Object.entries(attrs).reduce(getAtt, {});

  return <Svg {...atts} dangerouslySetInnerHTML={{ __html: contents }} />;
};

Icon.propTypes = propTypes;

Icon.defaultProps = defaultProps;

export default Icon;

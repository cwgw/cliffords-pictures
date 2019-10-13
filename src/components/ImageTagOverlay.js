import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Manager, Reference, Popper } from 'react-popper';

import { getDisplayName, getFullName } from 'utils/people';
import ImageEditContext from 'context/ImageEdit';

const Rect = styled('button')({
  position: 'absolute',
  border: 'none',
  background: 'none',
  top: p => `${p.rect.top * 100}%`,
  left: p => `${p.rect.left * 100}%`,
  width: p => `${p.rect.width * 100}%`,
  height: p => `${p.rect.height * 100}%`,
  '&:hover, &:active, &:focus, &.isVisible': {
    border: '1px solid',
    borderColor: 'accent',
    boxShadow: 'raised',
  },
});

const TagDetailsContainer = styled('div')({
  position: 'absolute',
  margin: '1rem',
  maxWidth: '300px',
  visibility: 'hidden',
  '&.isVisible': {
    visibility: 'visible',
    zIndex: 1,
  },
});

const TagDetailsWrapper = styled('div')({
  position: 'relative',
  padding: '1rem',
  background: '#fff',
  '& > p': {
    marginTop: 0,
  },
  '& > p:last-child': {
    marginBottom: 0,
  },
  '& pre': {
    background: '#eee',
    overflow: 'scroll',
    margin: '0 -1rem -1rem',
    padding: '1rem 1rem 1.5rem',
  },
  '& small': {
    opacity: 0.5,
  },
});

const Caret = styled('span')({
  position: 'absolute',
  width: '0.75rem',
  height: '0.75rem',
  transform: 'translate(-50%, -50%) rotate(45deg)',
  transformOrigin: 'left top',
  top: '0',
  background: 'inherit',
});

const propTypes = {
  rect: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  id: PropTypes.string.isRequired,
  person: PropTypes.object,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  size: 18 / 100,
};

const Tag = ({ size, ...tag }) => {
  const { activeTag, setActiveTag } = React.useContext(ImageEditContext);
  let isActive = activeTag.id === tag.id;

  const onClick = React.useCallback(
    e => {
      if (activeTag.id !== tag.id) {
        setActiveTag(tag);
      }
    },
    [activeTag]
  );

  const { rect, person } = tag;

  return (
    <Manager>
      <div onClick={onClick}>
        <Reference>
          {({ ref }) => <Rect isVisible={isActive} ref={ref} rect={rect} />}
        </Reference>
        <Popper eventsEnabled>
          {({ ref, style, placement, arrowProps }) => (
            <TagDetailsContainer
              ref={ref}
              style={style}
              data-placement={placement}
              isVisible={isActive}
            >
              <TagDetailsWrapper>
                <Caret ref={arrowProps.ref} style={arrowProps.style} />
                {person ? (
                  <p>
                    {getDisplayName(person)}
                    <br />
                    <small>
                      <em>{getFullName(person)}</em>
                    </small>
                  </p>
                ) : (
                  <React.Fragment>
                    <p>Unknown Person</p>
                  </React.Fragment>
                )}
              </TagDetailsWrapper>
            </TagDetailsContainer>
          )}
        </Popper>
      </div>
    </Manager>
  );
};

Tag.propTypes = propTypes;

Tag.defaultProps = defaultProps;

export default Tag;

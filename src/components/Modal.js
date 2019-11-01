/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import mousetrap from 'mousetrap';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import Image from 'gatsby-image';

import { space, transparentize } from 'style/system';

import Button from 'components/Button';
import AlbumContext from 'components/AlbumContext';
// import Photo from 'components/Photo';

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    currentPhoto,
    nextPhoto,
    prevPhoto,
  } = React.useContext(AlbumContext);

  const [{ x }, setX] = useSpring(() => ({ x: 0 }));

  React.useEffect(() => {
    mousetrap.bind('left', prevPhoto);
    mousetrap.bind('right', nextPhoto);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, [nextPhoto, prevPhoto]);

  const bind = useGesture({
    onDrag: state => {
      setX({ x: state.down ? state.movement[0] : 0 });
      console.log(state);
    },
  });

  return (
    <DialogOverlay
      isOpen={isModalOpen}
      onDismiss={closeModal}
      css={css({
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        padding: 'sm',
        backgroundColor: transparentize(0.1, 'black'),
        backdropFilter: 'blur(4px)',
        color: 'white',
      })}
    >
      <DialogContent
        css={css({
          width: '100%',
          maxWidth: '768px',
          marginY: 0,
          marginX: 'auto',
          // overflow: 'hidden',
        })}
        aria-label="Photo modal"
      >
        <Button
          onClick={closeModal}
          css={css({
            position: 'absolute',
            top: 'sm',
            right: 'sm',
          })}
          children="Close"
        />
        <animated.div
          css={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100%)',
            gridColumnGap: '32px',
          })}
          style={{
            transform: x.interpolate(
              x => `translateX(calc(${x}px - 100% - 32px))`
            ),
          }}
          {...bind()}
        >
          {currentPhoto &&
            currentPhoto.map((photo, i) =>
              photo ? (
                <div key={photo.id}>
                  <Image
                    fluid={photo.image.full}
                    style={{
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              ) : (
                <span key={i} />
              )
            )}
        </animated.div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import mousetrap from 'mousetrap';

import { space, transparentize } from 'style/system';

import Button from 'components/Button';
import AlbumContext from 'components/AlbumContext';
import Photo from 'components/Photo';

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    currentPhoto,
    nextPhoto,
    prevPhoto,
  } = React.useContext(AlbumContext);

  React.useEffect(() => {
    mousetrap.bind('left', prevPhoto);
    mousetrap.bind('right', nextPhoto);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, [nextPhoto, prevPhoto]);

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
      >
        <Button
          onClick={closeModal}
          css={css({
            position: 'absolute',
            top: 'sm',
            right: 'sm',
          })}
        >
          Close
        </Button>
        <div
          css={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100%)',
            gridColumnGap: 'lg',
            transform: `translateX(calc(-100% - ${space.lg}px))`,
          })}
        >
          {currentPhoto &&
            currentPhoto.map(({ id, image }) => (
              <Photo key={id} image={image.full} />
            ))}
        </div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

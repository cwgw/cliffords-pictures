import React from 'react';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import mousetrap from 'mousetrap';

import { transparentize } from 'style/utils';

import AlbumContext from 'components/AlbumViewState';
import Button from 'components/Button';
import Carousel from 'components/Carousel';

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    photos,
    photoIndex,
    changePhoto,
  } = React.useContext(AlbumContext);

  React.useEffect(() => {
    const prev = e => {
      e.preventDefault();
      changePhoto(-1);
    };
    const next = e => {
      e.preventDefault();
      changePhoto(1);
    };

    mousetrap.bind(['left', 'j'], prev);
    mousetrap.bind(['right', 'k'], next);

    return () => {
      mousetrap.unbind(['left', 'j']);
      mousetrap.unbind(['right', 'k']);
    };
  }, [changePhoto]);

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
          margin: 'auto',
          outline: 'none',
        })}
        aria-label="Photo modal"
      >
        <Button
          onClick={closeModal}
          css={css({
            position: 'fixed',
            top: 'sm',
            right: 'sm',
            zIndex: 1000,
          })}
          children="Close"
        />
        <Carousel items={photos} handleChange={changePhoto} {...photoIndex} />
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

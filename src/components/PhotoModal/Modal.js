import React from 'react';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import mousetrap from 'mousetrap';

import { transparentize } from 'style/utils';

import AlbumContext from 'components/AlbumViewState';
import Button from 'components/Button';

import Carousel from './Carousel';

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    photos,
    photoIndex,
    changePhoto,
  } = React.useContext(AlbumContext);

  const prev = React.useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      changePhoto(-1);
    },
    [changePhoto]
  );

  const next = React.useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      changePhoto(1);
    },
    [changePhoto]
  );

  React.useEffect(() => {
    mousetrap.bind(['left', 'j'], prev);
    mousetrap.bind(['right', 'k'], next);

    return () => {
      mousetrap.unbind(['left', 'j']);
      mousetrap.unbind(['right', 'k']);
    };
  }, [prev, next]);

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
          children="╳"
          title="Close"
        />
        <nav
          css={{
            '@media (max-width: 768px)': {
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              display: 'flex',
              background: '#000',
              borderTop: '1px solid #333',
              '& > *': {
                flex: 1,
              },
            },
          }}
        >
          <Button
            onClick={prev}
            css={css({
              '@media (min-width: 768px)': {
                position: 'fixed',
                top: 'calc(50% - 0.5em)',
                left: 'sm',
              },
            })}
            children="←"
            title="Previous photo"
            disabled={photoIndex.current === 0}
          />
          <Button
            onClick={next}
            css={css({
              '@media (min-width: 768px)': {
                position: 'fixed',
                top: 'calc(50% - 0.5em)',
                right: 'sm',
              },
            })}
            children="→"
            title="Next photo"
          />
        </nav>
        <Carousel
          items={photos}
          onDismiss={closeModal}
          onChange={changePhoto}
          {...photoIndex}
        />
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

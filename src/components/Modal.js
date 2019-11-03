/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import mousetrap from 'mousetrap';

import { transparentize } from 'style/system';

import Button from 'components/Button';
import AlbumContext from 'components/AlbumContext';
import Carousel from 'components/Carousel';

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    data,
    currentIndex,
    changeSlide,
    slide,
  } = React.useContext(AlbumContext);

  React.useEffect(() => {
    const prev = () => {
      changeSlide(-1);
    };
    const next = () => {
      changeSlide(1);
    };

    mousetrap.bind('left', prev);
    mousetrap.bind('right', next);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, [changeSlide]);

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
          outline: 'none',
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
            zIndex: 1000,
          })}
          children="Close"
        />
        <Carousel
          items={data}
          currentIndex={currentIndex}
          slide={slide}
          onChange={changeSlide}
        />
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

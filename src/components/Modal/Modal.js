import React from 'react';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import { transparentize } from 'style/utils';
import { spanParent } from 'style/shared';

import Button from 'components/Button';
import Carousel from './Carousel';

const Modal = ({ handleRequestClose, isOpen, setContentRef, children }) => {
  return (
    <DialogOverlay
      isOpen={isOpen}
      onDismiss={handleRequestClose}
      css={css({
        ...spanParent,
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        padding: 'sm',
        backgroundColor: transparentize(0.1, 'black'),
        backdropFilter: 'blur(4px)',
        color: 'white',
      })}
    >
      <DialogContent
        ref={setContentRef}
        css={css({
          width: '100%',
          maxWidth: '768px',
          margin: 'auto',
          outline: 'none',
        })}
        aria-label="Photo modal"
      >
        <Button
          onClick={handleRequestClose}
          css={css({
            position: 'fixed',
            top: 'sm',
            right: 'sm',
            zIndex: 1000,
          })}
          children="╳"
          title="Close"
        />
        <Carousel dismiss={handleRequestClose}>{children}</Carousel>
      </DialogContent>
    </DialogOverlay>
  );
};

export default Modal;

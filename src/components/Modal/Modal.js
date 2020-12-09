import React from 'react';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { animated, useSpring } from '@react-spring/web';

import { spanParent } from 'style/shared';

import Button from 'components/Button';
import Carousel from './Carousel';

const Overlay = animated(
  styled(DialogOverlay)(
    css({
      ...spanParent,
      position: 'fixed',
      backdropFilter: 'blur(4px)',
      color: 'white',
    })
  )
);

const Content = styled(DialogContent)({
  outline: 'none',
});

const Modal = ({
  onDismiss,
  isOpen,
  setContentRef,
  children,
  onNext,
  onPrevious,
}) => {
  const { backgroundColor } = useSpring({
    backgroundColor: isOpen ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0)',
  });

  return (
    <Overlay isOpen={isOpen} onDismiss={onDismiss} style={{ backgroundColor }}>
      <Content ref={setContentRef} aria-label="Photo modal">
        <Button
          onClick={onDismiss}
          css={css({
            position: 'fixed',
            top: 'sm',
            right: 'sm',
            zIndex: 1000,
          })}
          children="╳"
          title="Close"
        />
        <Carousel onDismiss={onDismiss} onRight={onNext} onLeft={onPrevious}>
          {children}
        </Carousel>
      </Content>
    </Overlay>
  );
};

export default Modal;

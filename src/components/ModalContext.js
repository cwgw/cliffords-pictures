import React from 'react';

const ModalContext = React.createContext({
  isModalOpen: false,
  closeModal: () => {},
  openModal: () => {},
  data: {},
  setData: () => {},
});

const Provider = ({ children }) => {
  const [data, setData] = React.useState({});
  const [isModalOpen, setStatus] = React.useState(false);

  const closeModal = React.useCallback(() => {
    setStatus(false);
  }, [setStatus]);

  const openModal = React.useCallback(() => {
    setStatus(true);
  }, [setStatus]);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        closeModal,
        openModal,
        data,
        setData,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext as default, Provider };

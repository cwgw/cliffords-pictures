import React from 'react';

const EditorContext = React.createContext({
  isVisible: false,
  toggleVisibility: () => {},
});

const Provider = ({ children }) => {
  const [isVisible, setVisibility] = React.useState(false);

  const toggleVisibility = React.useCallback(() => {
    setVisibility(b => !b);
    console.log('toggleVisibility');
  }, [setVisibility]);

  return (
    <EditorContext.Provider
      value={{
        isVisible,
        toggleVisibility,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export { EditorContext as default, Provider };

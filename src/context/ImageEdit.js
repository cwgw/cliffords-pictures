import React from 'react';

const ImageEditContext = React.createContext({});

const Provider = ({ children }) => {
  const [activeTag, setActiveTag] = React.useState({});
  const [isEditing, setEditStatus] = React.useState(false);

  return (
    <ImageEditContext.Provider
      value={{
        activeTag,
        setActiveTag,
        isEditing,
        setEditStatus,
      }}
    >
      {children}
    </ImageEditContext.Provider>
  );
};

export { ImageEditContext as default, ImageEditContext, Provider };

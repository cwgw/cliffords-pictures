export const shouldUpdateScroll = (args) => {
  const {
    routerProps: { location },
  } = args;
  const state = location.state || {};

  if (state.scrollTo) {
    return state.scrollTo;
  }

  return !(state.modal || state.noScroll);
};

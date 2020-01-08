import get from 'lodash/get';

export default ({ routerProps: { location } }) => {
  const isModal = get(location, 'state.modal');
  const preventUpdateScroll = get(location, 'state.noScroll');

  return !isModal && !preventUpdateScroll;
};

import get from "lodash/get";

const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const isModal = get(location, "state.modal");
  const preventUpdateScroll = get(location, "state.noScroll");

  return !isModal && !preventUpdateScroll;
};

export default shouldUpdateScroll;

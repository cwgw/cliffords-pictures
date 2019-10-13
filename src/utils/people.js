import isNil from 'lodash/isNil';

const getDisplayName = ({ name, displayName }) =>
  Array.isArray(displayName)
    ? displayName.map(key => name[key] || key).join(' ')
    : name.first;

const getFullName = ({ name: { first, last, suffix } }) =>
  [first, last, suffix]
    .reduce((s, val) => (isNil(val) ? s : `${s} ${val}`), '')
    .trim();

// export { getDisplayName, getFullName, personFragment };
export { getDisplayName, getFullName };

import _ from 'lodash';

export default (diff) => {
  const startPhrase = (path) => `Property '${path}'`;
  const added = (addedValue) => {
    if (addedValue === '[complex value]') return ` was added with value: ${addedValue}`;
    if (_.isString(addedValue)) return ` was added with value: '${addedValue}'`;
    return ` was added with value: ${addedValue}`;
  };
  const removed = ' was removed';
  const updated = (oldValue, newValue) => {
    const values = [oldValue, newValue];
    const newValues = values.reduce((acc, val) => {
      if (_.isObject(val)) return [...acc, '[complex value]'];
      if (_.isString(val)) return [...acc, `'${val}'`];
      return [...acc, `${val}`];
    }, []);
    return ` was updated. From ${newValues[0]} to ${newValues[1]}`;
  };
  const createPhrase = (start, condition) => `${start}${condition}`;

  const iter = (tree, currentPath) => {
    const keys = Object.keys(tree);
    const result = keys.reduce((acc, key, index) => {
      const splitedKey = key.split(' ');
      const sign = splitedKey[0];
      const actualKey = splitedKey[splitedKey.length - 1];
      const value = tree[key];

      const nextSplitedKey = keys[index + 1] ? keys[index + 1].split(' ') : [];
      const nextActualKey = nextSplitedKey[nextSplitedKey.length - 1];
      const nextValue = tree[nextSplitedKey.join(' ')];

      const previousSplitedKey = keys[index - 1] ? keys[index - 1].split(' ') : [];
      const previousActualKey = previousSplitedKey[previousSplitedKey.length - 1];

      if (actualKey === previousActualKey) return acc;

      const newCurrentPath = [...currentPath, actualKey];
      const strPath = newCurrentPath.join('.');

      if (actualKey === nextActualKey) {
        return [...acc, createPhrase(startPhrase(strPath), updated(value, nextValue))];
      }
      if (sign !== '+' && sign !== '-' && _.isObject(value)) return [...acc, iter(value, newCurrentPath)];
      if (actualKey !== nextActualKey) {
        if (sign === '-' || sign === '+') {
          return sign === '-' ? [...acc, createPhrase(startPhrase(strPath), removed)] : [...acc, createPhrase(startPhrase(strPath), _.isObject(value) ? added('[complex value]') : added(value))];
        }
      }
      return acc;
    }, []);
    return result.join('\n');
  };

  return iter(diff, []).trimEnd();
};

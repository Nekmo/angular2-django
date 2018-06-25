export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}


export default function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}


function lookupToDictKeyValue(data, key, value) {
    if(key.indexOf('__') === -1) {
        data[key] = value;
    }
    // let data = {};
    key.split('__').forEach((lookup, idx, array) => {
        if (idx === array.length - 1) {
            data[lookup] = value;
        } else if(data[lookup]) {
            data = data[lookup];
        } else {
            data[lookup] = {};
            data = data[lookup];
        }
    });
    // return rootData;
}


export function lookupsToDicts(data) {
    let newData = {};
    Object.entries(data).forEach(([key, value]) => {
        lookupToDictKeyValue(newData, key, value);
    });
    return newData;
}
import stringify from 'fast-json-stable-stringify';

// Hash function is from here: https://stackoverflow.com/a/7616484/20089
const hashcode = (str: string) => {
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

export default (obj: Object) => hashcode(stringify(obj));

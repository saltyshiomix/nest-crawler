const K: number = 1000;
const M: number = 1000000;
const G: number = 1000000000;
const T: number = 1000000000000;

const preNormalize = (x: string) => {
  return x.toLowerCase()
          .replace(' ', '')
          .replace('　', '')
          .replace(',', '');
};

const postNormalize = (x: string) => {
  return x.replace('k', '')
          .replace('m', '')
          .replace('g', '')
          .replace('t', '');
};

const detectScale = (x: string): number => {
  if (0 <= x.indexOf('t')) {
    return T;
  }
  if (0 <= x.indexOf('g')) {
    return G;
  }
  if (0 <= x.indexOf('m')) {
    return M;
  }
  if (0 <= x.indexOf('k')) {
    return K;
  }
  return 1;
}

const normalizeNumber = (x: string): number => {
  x = preNormalize(x);
  const scale: number = detectScale(x);
  if (scale === 1) {
    return parseFloat(x);
  }
  x = postNormalize(x);
  return parseFloat(x) * scale;
};

export {
  normalizeNumber,
};

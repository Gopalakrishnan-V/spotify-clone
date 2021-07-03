export const nFormatter = (num: number, digits: number) => {
  const si = [
    {value: 1e18, symbol: 'E'},
    {value: 1e15, symbol: 'P'},
    {value: 1e12, symbol: 'T'},
    {value: 1e9, symbol: 'G'},
    {value: 1e6, symbol: 'M'},
    {value: 1e3, symbol: 'k'},
  ];

  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      );
    }
  }
  return num.toString();
};

export const round = (value: number, precision?: number) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const pluralize = (
  count: number,
  text: string,
  pluralString?: string,
) => {
  return `${nFormatter(count, 1)} ${
    count === 1 ? text : text + `${pluralString ? pluralString : 's'}`
  }`;
};

export const commas = (n: number) => {
  if (n < 1000) {
    return String(n);
  } else {
    let whole: any = Math.floor(n);
    let fraction = n - whole;
    whole = String(whole).split('');
    let i = whole.length;
    while (i > 3) {
      whole.splice((i -= 3), 0, ',');
    }
    return whole.join('') + String(fraction).slice(1);
  }
};

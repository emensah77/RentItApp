export function formatCurrency(currency) {
  let localCurrency = currency;
  if (Array.isArray(currency)) {
    // eslint-disable-next-line prefer-destructuring
    localCurrency = currency[0];
  }
  if (localCurrency === 'usd') {
    return '$';
  }
  if (localCurrency === 'ghs') {
    return 'GH₵';
  }

  return 'GH₵';
}

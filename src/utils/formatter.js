export function formatCurrency(currency) {
  if (currency === 'usd') {
    return '$';
  }
  if (currency === 'ghs') {
    return 'GH₵';
  }

  return 'GH₵';
}

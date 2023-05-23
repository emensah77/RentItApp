import numeral from 'numeral';

export const Marketer_Status = {
  accepted: 'ACCEPTED',
  inReview: 'REVIEW',
  decline: 'DECLINE',
};

export const ROLE = {user: 'USER', admin: 'ADMIN'};

export const HOME_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export function convertDays(days) {
  const months = Math.floor(days / 30);
  const weeks = Math.floor((days % 30) / 7);
  const d = Math.floor((days % 30) % 7);
  return {months, weeks, days: d};
}

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

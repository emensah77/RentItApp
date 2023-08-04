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

const monthArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function mapMonthToText(month) {
  return monthArr[month];
}

export function mapWeekToText(week) {
  return weekArr[week];
}

export function extractDate(date) {
  const obj = {
    weekDay: '',
    day: '1',
    month: '',
    year: 0,
    isNextYear: false,
  };

  if (!(date instanceof Date)) {
    return null;
  }

  let day = date.getDate();

  if (day < 10) {
    day = `0${day}`;
  }

  obj.day = day;
  obj.weekDay = mapWeekToText(date.getDay());
  obj.month = mapMonthToText(date.getMonth());
  obj.year = date.getFullYear();

  const now = new Date();

  if (obj.year < now.getFullYear()) {
    obj.isNextYear = true;
  }

  return obj;
}

export function calculatePriceForDays(from, to, monthPrice) {
  const diff = to.getTime() - from.getTime();

  return Math.ceil((monthPrice / 31) * (diff / (1000 * 3600 * 24)));
}
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
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (_date, type = 1, isEndDate = false) => {
  if (!_date) return '';

  let date;

  // Check if _date is a string in the format DD/MM/YYYY
  if (typeof _date === 'string' && /\d{2}\/\d{2}\/\d{4}/.test(_date)) {
    const [month, day, year] = _date.split('/');
    date = new Date(Date.UTC(year, month - 1, day));
  } else {
    date = new Date(_date);
  }

  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    console.error(`Invalid date provided: ${_date}`);
    return '';
  }

  if (type === 1) {
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  } else if (type === 2) {
    let month = date.getUTCMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getUTCDate();
    day = day < 10 ? `0${day}` : day;
    return `${month}/${day}/${date.getUTCFullYear()}`;
  } else if (type === 3) {
    const hour = isEndDate ? '23' : '00';
    const minute = isEndDate ? '59' : '00';
    const second = isEndDate ? '59' : '00';

    let month = date.getUTCMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getUTCDate();
    day = day < 10 ? `0${day}` : day;

    return `${date.getUTCFullYear()}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }
};

export default formatDate;

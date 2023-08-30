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

const formatDate = (_date, type = 1) => {
  if (!_date) return '';
  let date = new Date(_date);

  if (type === 1) {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (type === 2) {
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${month}/${day}/${date.getFullYear()}`;
  } else if (type === 3) {
    // Just because react-native on Hermes throws "Date value out of bounds" so .toISOString() is not usable
    // when date is formatted as `DD/MM/YYYY`
    if (Number.isNaN(date.getMonth()) && /\//.test(_date)) {
      const parts = _date.split('/');
      date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
    }

    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;

    let hr = date.getHours();
    hr = hr < 10 ? `0${hr}` : hr;

    let mins = date.getMinutes();
    mins = mins < 10 ? `0${mins}` : mins;

    let secs = date.getSeconds();
    secs = secs < 10 ? `0${secs}` : secs;

    return `${date.getFullYear()}-${month}-${day}T${hr}:${mins}:${secs}Z`;
  }
};

export default formatDate;

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
const formatDate = _date => {
  if (!_date) return '';

  const months = [
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
  const date = new Date(_date);
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default formatDate;

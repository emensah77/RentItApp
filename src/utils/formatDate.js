const formatDate = _date => {
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

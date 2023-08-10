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

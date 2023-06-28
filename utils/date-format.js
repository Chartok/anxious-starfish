const addDateSuffix = (date) => {
    const dateStr = date.toString();
    const lastDigit = dateStr.slice(-1);

    switch (lastDigit) {
        case '1':
            return dateStr + (dateStr === '11' ? 'th' : 'st');
        case '2':
            return dateStr + (dateStr === '12' ? 'th' : 'nd');
        case '3':
            return dateStr + (dateStr === '13' ? 'th' : 'rd');
        default:
            return dateStr + 'th';
    }
};

const months = {
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const formatHour = (hour) => {
    if (hour === 0) return 12;
    return hour > 12 ? hour - 12 : hour;
};

const formatMinutes = (minutes) => minutes < 10 ? `0${minutes}` : minutes;

const periodOfDay = (hour) => hour >= 12 ? 'pm' : 'am';

module.exports = (timestamp, { monthLength = 'short', dateSuffix = true } = {}) => {
    const dateObj = new Date(timestamp);
    const dayOfMonth = dateSuffix ? addDateSuffix(dateObj.getDate()) : dateObj.getDate();
    const formattedMonth = months[monthLength][dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const hour = formatHour(dateObj.getHours());
    const minutes = formatMinutes(dateObj.getMinutes());
    const period = periodOfDay(dateObj.getHours());

    return `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${period}`;
};

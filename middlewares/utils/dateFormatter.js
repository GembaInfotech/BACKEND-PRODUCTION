// dateUtils.js

const { format } = require('date-fns');

// Function to format a date into a readable form
const formatDate = (date, dateFormat) => {
    return format(new Date(date), dateFormat);
};

module.exports = { formatDate };

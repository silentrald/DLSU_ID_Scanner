

const dateFunc = {
    /**
     * Returns the date into a proper date string
     * @param {string|date} d
     * @return {string} format yyyy-mm-dd
     */
    getDateString: d => (new Date(d)).toISOString().substring(0, 10),

    /**
     * Compare 2 dates
     * if d1 > d2 return    1
     * if d1 == d2 return   0
     * if d1 < d2 return    -1
     * @param {string|date} d1
     * @param {string|date} d2
     * @returns -1 | 0 | 1
     */
    compareDates: (d1, d2) => {
        d1 = new Date(d1);
        d2 = new Date(d2);
        return d1 > d2 ? 1 : (d1 < d2 ? -1 : 0);
    },

    /**
     * Compare the date to today
     * if date is before today  -1
     * if date is today         0
     * if date is after today   1
     * @param {string|date} d
     * @returns -1 | 0 | 1
     */
    compareToNow: d => {
        let now = new Date();
        d = new Date(d);
        return d > now ? 1 : (d < now ? -1 : 0);
    },
};

module.exports = dateFunc;
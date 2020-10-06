/**
 * Check if the password fits the regexs
 * @param {regex} regex 
 * @param {string} password 
 * @return {Promise<boolean>}
 */
const promiseRegex = (regex, password) => new Promise((resolve, reject) => {
    resolve(regex.test(password) ? true : false);
});

/**
 * Validates whether the password is strong
 * req at least 3 from the 4 stated:
 * - at least 1 a-z (small letter)
 * - at least 1 A-Z (big letter)
 * - at least 1 0-9 (number)
 * - at least 1 special character (not from the above)
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
const passwordStrength = async (password) => {
    let strength = 0;

    let p1 = promiseRegex(/[a-z]/, password);
    let p2 = promiseRegex(/[A-Z]/, password);
    let p3 = promiseRegex(/[0-9]/, password);
    let p4 = promiseRegex(/[^(a-zA-Z0-9)]/, password);

    try {
        let [ r1, r2, r3 ] = await Promise.all([ p1, p2, p3 ]);
        strength = r1 + r2 + r3;

        if (strength >= 3) {
            return true;
        }

        strength += await p4;

        return strength >= 3;
    } catch (err) {
        throw err;
    }
}

module.exports = passwordStrength;
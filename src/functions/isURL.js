/**
 *
 * @param {string} string
 * @returns {boolean}
 */
module.exports = function (string) {
  const regex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (regex.test(string)) {
    const isValidURL = fetch(string)
      .then(fetched => {
        fetched.ok
      });

    if (isValidURL)
      return true;

    else
      return false;
  }
  else
    return false;
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */

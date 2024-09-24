/**
 *
 * @param {string} string
 * @param {object} object
 * @returns {string}
 */
module.exports = function (string, object) {
  Object
    .keys(object)
    .forEach(a => string = string.replace(`{${a}}`, object[a]));

  return string;
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
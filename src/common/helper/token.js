let JSONWebToken = require("jsonwebtoken");
class Token {
  constructor() {}
  static signToken(payload, secret, options) {
    return new Promise((resolve, reject) => {
      JSONWebToken.sign(payload, secret, options, (error, token) => {
        if (error) return reject(error);
        resolve(token);
      });
    });
  }
  static verify(token, secret) {
    return new Promise((resolve, reject) => {
      JSONWebToken.verify(token, secret, async (error, decoded) => {
        if (error)
          return resolve({
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null,
          });
        resolve({
          valid: true,
          expired: false,
          decoded: decoded,
        });
      });
    });
  }
}

module.exports = { Token };

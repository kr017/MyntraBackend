const bcrypt = require("bcrypt");

const encrypt = password => {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const decrypt = (password, hash) => {
  const result = bcrypt.compareSync(password, hash); // true

  return result;
};

module.exports = {
  encrypt,
  decrypt,
};

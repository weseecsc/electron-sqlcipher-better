const keytar = require("keytar");
const crypto = require("crypto");

const SERVICE = "SQLCipherBetter";
const ACCOUNT = "database-key";

async function getOrCreateDbKey() {
  let key = await keytar.getPassword(SERVICE, ACCOUNT);

  if (!key) {
    // 256-bit random key
    key = crypto.randomBytes(32).toString("hex");
    await keytar.setPassword(SERVICE, ACCOUNT, key);
  }

  return key;
}

module.exports = { getOrCreateDbKey };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY_URL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_URL}`;

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};

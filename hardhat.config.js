require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-etherscan");
const { task } = require("hardhat/config");
let secrets = require('./secret.json');
require("dotenv").config();
const { INFURA, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  paths: {
    artifacts: './artifacts'
  },
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby : {
      url: INFURA,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey:ETHERSCAN_API_KEY
  }
};

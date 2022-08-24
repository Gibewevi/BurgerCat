require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  paths: {
    artifacts: './artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};

const Web3 = require("web3");
const net = require("net");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*", // Match any network id
      gas:500000,
    },

    net421337:{
      host: "localhost",
      port: 8545,
      network_id: 421337,
      gas:500000,
    },

    ropsten: {
      provider: new Web3.providers.IpcProvider("~/.ethereum/geth.ipc", net),
      network_id: 3,
      gas:500000,
    }
  }
};

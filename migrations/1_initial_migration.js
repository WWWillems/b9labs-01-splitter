var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(
      Splitter,
      accounts[1],
      accounts[2],
      { from: accounts[0], gas:1000000});
};

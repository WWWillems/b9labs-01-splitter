var Splitter = artifacts.require('./Splitter.sol');

// there are 3 people: Alice, Bob and Carol.
// we can see the balance of the Splitter contract on the Web page.
// whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol.
// we can see the balances of Alice, Bob and Carol on the Web page.
// Alice can use the Web page to split her ether

contract('Splitter', function(accounts) {

  var contract;

  beforeEach(function() {
    return Splitter.new()
                    .then(function(instance){
                      contract = instance;
    })
  });

  it("should say hello", function(){
    assert.equal(true, false, "Hello!");
  });

});

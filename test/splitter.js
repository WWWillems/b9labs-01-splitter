var Splitter = artifacts.require('./Splitter.sol');

// there are 3 people: Alice, Bob and Carol.
// we can see the balance of the Splitter contract on the Web page.
// whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol.
// we can see the balances of Alice, Bob and Carol on the Web page.
// Alice can use the Web page to split her ether

contract('Splitter', function(accounts) {

  var contract;

  var owner;
  var account1;
  var account2;

  var balances;

  beforeEach('Setup contract for eacht test', async function() {
    contract = await Splitter.new();

    owner = accounts[0];
    account1 = accounts[1];
    account2 = accounts[2];
  });

  it("should be owned by the owner", function(){

    return contract.owner({from: owner})
                    .then(function(_owner){
                      assert.strictEqual(owner, _owner);
                    })
  });

  it("should verify if a sent payment is correctly being split", function(){
    var amountToSend = 10000;
    var expectedAmount = "" + amountToSend / 2;
    var balance1;
    var balance2;

    return contract.splitPayment(
        account1,
        account2,
        {from: owner, value: amountToSend})
      .then(function(txReceipt){
        //console.log('Payment receipt ' , txReceipt)

        return contract.balances(account1)
      })
      .then(function(_balance1){
        balance1 = _balance1;

        return contract.balances(account2)
      })
      .then(function(_balance2){
          balance2 = _balance2

          assert.strictEqual(balance1.toString(10), expectedAmount.toString(10));
          assert.strictEqual(balance2.toString(10), expectedAmount.toString(10));
          assert.strictEqual(balance1.toString(10), balance2.toString(10));
    })
  });
});

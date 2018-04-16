var Splitter = artifacts.require('./Splitter.sol');

// there are 3 people: Alice, Bob and Carol.
// we can see the balance of the Splitter contract on the Web page.
// whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol.
// we can see the balances of Alice, Bob and Carol on the Web page.
// Alice can use the Web page to split her ether

contract('Splitter', function(accounts) {

  var contractInstance;

  var owner;
  var account1;
  var account2;

  var balances;

  var event1;

  beforeEach('Setup contract for each test', async function() {
    contractInstance = await Splitter.new({from: accounts[0]});

    owner = accounts[0];
    account1 = accounts[1];
    account2 = accounts[2];
  });

  it("should be owned by the creator", function(){

    return contractInstance.owner()
                    .then(function(_owner){
                      assert.strictEqual(owner, _owner);
                    })
  });

  it("should throw an error when an empty recipient address is passed", async function(){
    var amountToSend = 10000;
    var txReceipt;

    try{
      txReceipt = await contractInstance.splitPayment(account1, '', {from: owner, value: amountToSend});

      assert.fail(null, null, 'Expected transaction to fail, as an empty address is being used.')
    }catch(e){
      assert.strictEqual(txReceipt, undefined);
    }
  });

  it("should verify if a sent payment is correctly being split", function(){
    var amountToSend = 10000;
    var expectedAmount = "" + (amountToSend / 2);
    var balance1;
    var balance2;

    return contractInstance.splitPayment(
        account1,
        account2,
        {from: owner, value: amountToSend})
      .then(function(txReceipt){
        //console.log('Payment receipt logs ' , txReceipt)

        try{
          // Check if a LogPayment Event was emitted
          var eventName = txReceipt.logs.filter(log => log.event == "LogPayment")[0].event;
          assert.equal(eventName, "LogPayment", "LogPayment Event isn't being emitted correctly");
        }catch(e){
          assert.fail(null, null, `No event(s) found, are they being emitted?`);
        }

        return contractInstance.balances(account1)
      })
      .then(function(_balance1){
        balance1 = _balance1;

        assert.strictEqual(balance1.toString(10), expectedAmount.toString(10));

        return contractInstance.balances(account2)
      })
      .then(function(_balance2){
        balance2 = _balance2

        assert.strictEqual(balance2.toString(10), expectedAmount.toString(10));
        assert.strictEqual(balance1.toString(10), balance2.toString(10));
    })
  });

  it("Should fail withdrawal of funds when no funds are available for the current withdrawer.", async function(){
    var txReceipt;

    try{
      txReceipt = await contractInstance.withdrawFunds({from: accounts[1]});
    }catch(e){
      assert.isDefined(e, 'Contract should revert() when no funds are available.');
    }
  });

  it("Should allow withdrawal of funds when funds are available for the current withdrawer.", async function(){
    var amountToSend = 10000;
    var expectedAmount = "" + (amountToSend / 2);

    // Top-up balances
    var txReceipt = await contractInstance.splitPayment(account1, account2, {from: owner, value: amountToSend});
    assert.strictEqual(txReceipt.receipt.status, '0x01');

    try{
      // Make sure balance is > 0
      var preBalance = await contractInstance.balances(account1)
      assert.strictEqual(preBalance.toString(10) > "0".toString(10), true);

      // Withdraw
      txReceipt = await contractInstance.withdrawFunds({from: account1});
      assert.strictEqual(txReceipt.receipt.status, '0x01');

      // Make sure balance has been reset to 0
      var balance = await contractInstance.balances(account1)
      assert.strictEqual(balance.toString(10), "0".toString(10));

    }catch(e){
      console.log(e);
      assert.fail("Withdrawal shouldn't fail when funds are available for the current withdrawer.");
    }
  });
});

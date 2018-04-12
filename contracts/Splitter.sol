pragma solidity ^0.4.0;

// there are 3 people: Alice, Bob and Carol.
// we can see the balance of the Splitter contract on the Web page.
// whenever Alice sends ether to the contract, half of it goes to Bob and the other half to Carol.
// we can see the balances of Alice, Bob and Carol on the Web page.
// Alice can use the Web page to split her ether


contract Splitter {

    uint public balance;

    address public alice;

    uint public bob;
    uint public carol;

    function Splitter(){
        alice = msg.sender;
        balance = 0;
    }

    function
    public
    payable
    splitPayment(bool){
        if(msg.value == 0) throw;

        return true;
    }

    function
    public
    constant
    getBalanceBob(){
        return bob.balance;
    }

    function
    public
    constant
    getBalanceCarol(){
        return carol.balance;
    }
}

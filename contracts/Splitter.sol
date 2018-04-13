pragma solidity ^0.4.6;

contract Splitter {
    address public owner;
    mapping (address => uint) public balances;

    address public recipient1;
    address public recipient2;

    // Constructor
    function Splitter(address _recipient1, address _recipient2)
    payable
    public {
        require(_recipient1 != _recipient2);

        owner = msg.sender;
        recipient1 = _recipient1;
        recipient2 = _recipient2;
    }

    // Fallback function
    function()
    public {

    }

    function split()
    public
    payable
    returns (bool success){
        require(msg.value > 0);
        require(msg.sender == owner);

        balances[recipient1] += msg.value / 2;
        balances[recipient2] += msg.value / 2;

        sendPayment(recipient1);
        sendPayment(recipient2);

        return true;
    }

    function sendPayment(address recipient)
    private
    returns (bool success){
        require(msg.sender == owner);
        require(balances[recipient] > 0);

        recipient.transfer(balances[recipient]);
        balances[recipient] = 0;

        return true;
    }
}

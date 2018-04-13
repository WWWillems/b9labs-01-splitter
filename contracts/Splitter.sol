pragma solidity ^0.4.19;

contract Splitter {
    address public owner;
    mapping (address => uint) public balances;

    address public recipient1;
    address public recipient2;

    event LogPayment(address indexed from, uint value);
    event LogWithdrawal(address indexed to, uint value);

    // Constructor
    function Splitter(address _recipient1, address _recipient2)
    payable
    public {
        require(_recipient1 != address(0x0));
        require(_recipient2 != address(0x0));
        require(_recipient1 != _recipient2);

        owner = msg.sender;
        recipient1 = _recipient1;
        recipient2 = _recipient2;
    }

    // Fallback function
    function()
    public {
        revert();
    }

    // Updates balances for recipients when a payment is sent to this function
    function splitPayment()
    public
    payable
    returns (bool success){
        require(msg.value > 0);
        require(msg.sender == owner);
        require(msg.value % 2 == 0);

        balances[recipient1] += msg.value / 2;
        balances[recipient2] += msg.value / 2;

        // Not sending payment here
        // Using the Withdrawal pattern:
        // http://solidity.readthedocs.io/en/v0.4.21/common-patterns.html

        emit LogPayment(msg.sender, msg.value);

        return true;
    }

    // Recipients can use this function to withdraw their part of the payments
    function withdrawFunds()
    public
    returns (bool success){
        uint amount = balances[msg.sender];
        require(amount > 0);

        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        balances[msg.sender] = 0;

        msg.sender.transfer(amount);

        emit LogWithdrawal(msg.sender, amount);

        return true;
    }
}

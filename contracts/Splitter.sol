pragma solidity ^0.4.19;

contract Splitter {
    address public owner;
    mapping (address => uint) public balances;

    event LogPayment(address indexed from, uint value);
    event LogWithdrawal(address indexed to, uint value);

    // Constructor
    function Splitter()
    payable
    public {
        owner = msg.sender;
    }

    // Fallback function
    function()
    public {
        revert();
    }

    // Updates balances for recipients when a payment is sent to this function
    function splitPayment(address recipient1, address recipient2)
    public
    payable
    returns (bool success){
        require(recipient1 != address(0x0));
        require(recipient2 != address(0x0));
        require(recipient1 != recipient2);

        require(msg.value > 0);
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
        emit LogWithdrawal(msg.sender, amount);

        msg.sender.transfer(amount);

        return true;
    }

    function kill()
    public {
        require(msg.sender == owner);
        
        selfdestruct(owner);
    }
}

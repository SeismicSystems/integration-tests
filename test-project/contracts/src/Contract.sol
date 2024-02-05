// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Contract { 
    event emitDummyEvent(address owner, uint256 dummy);
    
    address public owner;
    uint256 public dummy;

    constructor(address _addr) {
        owner = address(_addr);
    }

    function setDummy(uint256 _dummy) public {
        dummy = _dummy;
        emit emitDummyEvent(owner, dummy);
    }

    function getDummy() public view returns (uint256) {
        return dummy;
    }
}

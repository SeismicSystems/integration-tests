// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Contract { 
    event emitDummyEvent(uint256 dummy);
    uint256 public dummy;

    function setDummy(uint256 _dummy) public {
        dummy = _dummy;
        emit emitDummyEvent(dummy);
    }

    function getDummy() public view returns (uint256) {
        return dummy;
    }
}

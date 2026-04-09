// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20ToERC7984Wrapper} from "@iexec-nox/nox-confidential-contracts/contracts/token/extensions/ERC20ToERC7984Wrapper.sol";
import {ERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GhostPay
 * @dev A confidential payroll management contract using iExec Nox.
 * Employers can wrap tokens and distribute them to employees anonymously.
 */
contract GhostPay is ERC20ToERC7984Wrapper, Ownable {
    
    event PayrollDistributed(address indexed employer, uint256 employeeCount);
    event SalaryClaimed(address indexed employee, uint256 amount);

    constructor(
        IERC20 underlying_,
        string memory name_,
        string memory symbol_,
        string memory contractURI_
    ) 
        ERC20ToERC7984Wrapper(underlying_)
        ERC7984(name_, symbol_, contractURI_)
        Ownable(msg.sender)
    {}

    /**
     * @dev Allows the employer to wrap tokens and distribute them in one go.
     */
    function distributeConfidentialPayroll(
        address[] calldata employees,
        uint256[] calldata amounts
    ) external {
        require(employees.length == amounts.length, "GhostPay: Length mismatch");
        
        for (uint256 i = 0; i < employees.length; i++) {
            // Internal _transfer moves encrypted tokens from msg.sender to employee
            // In Nox, transfer logic handles the encryption/decryption via protocol
            transfer(employees[i], amounts[i]);
        }
        
        emit PayrollDistributed(msg.sender, employees.length);
    }

    /**
     * @dev Allows employees to unwrap their confidential tokens back to underlying ERC20.
     */
    function reclaimToUnderlying(uint256 amount) external {
        unwrap(msg.sender, amount);
        emit SalaryClaimed(msg.sender, amount);
    }
}


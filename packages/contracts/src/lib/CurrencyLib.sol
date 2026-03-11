// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title CurrencyLib
/// @notice Unified helpers for transferring ERC-20 tokens and native ETH
/// @dev address(0) is treated as native ETH, matching Uniswap V4 Currency convention
library CurrencyLib {
    using SafeERC20 for IERC20;

    error ETHTransferFailed();

    function isNative(address token) internal pure returns (bool) {
        return token == address(0);
    }

    function balanceOf(address token, address account) internal view returns (uint256) {
        return isNative(token) ? account.balance : IERC20(token).balanceOf(account);
    }

    function safeTransfer(address token, address to, uint256 amount) internal {
        if (isNative(token)) {
            (bool ok,) = to.call{value: amount}("");
            if (!ok) revert ETHTransferFailed();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }
}

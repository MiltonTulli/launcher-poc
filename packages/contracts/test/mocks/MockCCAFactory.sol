// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IAuctionInitializer} from "../../src/interfaces/IAuctionInitializer.sol";
import {MockCCA} from "./MockCCA.sol";

/// @notice Mock CCA factory that deploys MockCCA instances
/// @dev Mirrors real CCAAdapter behavior: pulls tokens from caller via transferFrom
///      and forwards them to the deployed CCA.
contract MockCCAFactory is IAuctionInitializer {
    using SafeERC20 for IERC20;

    address public lastDeployedCCA;
    address public lastToken;
    uint256 public lastAmount;
    bytes public lastConfigData;

    // Pre-configured mock CCA to return (if set)
    address public presetCCA;

    function setPresetCCA(address cca) external {
        presetCCA = cca;
    }

    function createAuction(
        address token,
        uint256 amount,
        bytes calldata configData,
        bytes32 /* salt */
    )
        external
        override
        returns (address cca)
    {
        lastToken = token;
        lastAmount = amount;
        lastConfigData = configData;

        // Pull tokens from caller (mirrors real CCAAdapter behavior)
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        if (presetCCA != address(0)) {
            cca = presetCCA;
        } else {
            // Decode currency and fundsRecipient from configData
            (address currency, address tokensRecipient, address fundsRecipient,, uint64 endBlock_,,,,) =
                abi.decode(configData, (address, address, address, uint64, uint64, uint64, uint256, address, bytes));
            cca = address(new MockCCA(token, currency, tokensRecipient, fundsRecipient, endBlock_));
        }

        // Forward tokens to the CCA (mirrors real factory behavior)
        IERC20(token).safeTransfer(cca, amount);

        lastDeployedCCA = cca;
    }
}

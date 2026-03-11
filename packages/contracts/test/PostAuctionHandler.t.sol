// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {TestBase} from "./helpers/TestBase.sol";
import {TestablePostAuctionHandler} from "./mocks/TestablePostAuctionHandler.sol";
import {MockLockupFactory} from "./mocks/MockLockupFactory.sol";
import {MockLaunchLiquidityVault} from "./mocks/MockLaunchLiquidityVault.sol";
import {VaultConfig} from "../src/types/LaunchTypes.sol";
import {PriceLib} from "../src/lib/PriceLib.sol";
import {PoolKeyLib} from "../src/lib/PoolKeyLib.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";

contract PostAuctionHandlerTest is TestBase {
    TestablePostAuctionHandler public handler;
    MockLockupFactory public lockupFactory;

    uint256 constant TOKEN_AMOUNT = 500_000e18;
    uint256 constant PAYMENT_AMOUNT = 250_000e6;
    uint256 constant Q96 = 2 ** 96;
    uint256 constant CLEARING_PRICE = Q96 / 2; // 0.5 in Q96 format (CCA convention)
    uint24 constant POOL_FEE = 3000;
    int24 constant TICK_SPACING = 60;

    function setUp() public override {
        super.setUp();

        lockupFactory = new MockLockupFactory();

        handler = new TestablePostAuctionHandler(
            address(poolManager),
            address(positionManager),
            address(lockupFactory),
            address(0) // no vault implementation for mock
        );

        vm.label(address(handler), "PostAuctionHandler");
        vm.label(address(lockupFactory), "LockupFactory");
    }

    // ============================================
    // CREATE LIQUIDITY POSITION — HAPPY PATH
    // ============================================

    function test_createLiquidityPosition_happyPath() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();

        (address vault, uint256 posTokenId) = handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            false, // no lockup
            0,
            positionBeneficiary
        );

        assertTrue(vault != address(0), "Vault should be deployed");
        assertTrue(posTokenId > 0, "Position token ID should be > 0");

        // Pool should have been initialized
        assertEq(poolManager.getInitializeCallCount(), 1);

        // Position NFT should be in the vault
        assertEq(positionManager.ownerOf(posTokenId), vault);
    }

    function test_createLiquidityPosition_pullsTokens() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();

        handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            false,
            0,
            positionBeneficiary
        );

        // Tokens should have been pulled from the caller (this contract)
        // Handler returns unused tokens, so check handler has no residual
        assertEq(auctionToken.balanceOf(address(handler)), 0);
        assertEq(paymentToken.balanceOf(address(handler)), 0);
    }

    // ============================================
    // VAULT DEPLOYMENT
    // ============================================

    function test_vaultReceivesCorrectConfig() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();

        (address vault,) = handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            false,
            0,
            positionBeneficiary
        );

        MockLaunchLiquidityVault mockVault = MockLaunchLiquidityVault(vault);
        assertEq(mockVault.platformBeneficiary(), platformFeeRecipient);
        assertEq(mockVault.creatorBeneficiary(), treasury);
        assertEq(mockVault.platformFeeBps(), LP_FEE_SHARE_BPS);
    }

    // ============================================
    // LOCKUP
    // ============================================

    function test_createLiquidityPosition_withLockup() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();
        uint64 lockupDuration = 30 days;

        handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            true, // lockup enabled
            lockupDuration,
            positionBeneficiary
        );

        // Lockup factory should have been called
        assertEq(lockupFactory.getCallCount(), 1);
        (address lockupVault, address lockupBeneficiary, uint64 unlockTs) = lockupFactory.createLockupCalls(0);
        assertEq(lockupBeneficiary, positionBeneficiary);
        assertEq(unlockTs, uint64(block.timestamp) + lockupDuration);
        assertTrue(lockupVault != address(0));
    }

    function test_createLiquidityPosition_noLockup() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();

        handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            false, // no lockup
            0,
            positionBeneficiary
        );

        // Lockup factory should NOT have been called
        assertEq(lockupFactory.getCallCount(), 0);
    }

    // ============================================
    // POOL INITIALIZATION
    // ============================================

    function test_poolInitializedWithCorrectPrice() public {
        _fundAndApprove(address(handler), TOKEN_AMOUNT, PAYMENT_AMOUNT);

        VaultConfig memory vaultCfg = createDefaultVaultConfig();

        handler.createLiquidityPosition(
            address(auctionToken),
            address(paymentToken),
            TOKEN_AMOUNT,
            PAYMENT_AMOUNT,
            POOL_FEE,
            TICK_SPACING,
            CLEARING_PRICE,
            vaultCfg,
            false,
            0,
            positionBeneficiary
        );

        uint160 expectedSqrtPrice =
            PriceLib.clearingPriceToSqrtPriceX96(CLEARING_PRICE, address(auctionToken), address(paymentToken));
        assertEq(poolManager.getLastSqrtPriceX96(), expectedSqrtPrice);
    }

    // ============================================
    // HELPERS
    // ============================================

    function _fundAndApprove(address spender, uint256 tokenAmt, uint256 paymentAmt) internal {
        auctionToken.mint(address(this), tokenAmt);
        paymentToken.mint(address(this), paymentAmt);
        auctionToken.approve(spender, tokenAmt);
        paymentToken.approve(spender, paymentAmt);
    }
}

// ============================================
// PRICELIB TESTS
// ============================================

contract PriceLibTest is TestBase {
    function test_computeSqrtPriceX96_equalAmounts() public pure {
        // price = 1, sqrtPrice = 1, sqrtPriceX96 = 2^96
        uint160 result = PriceLib.computeSqrtPriceX96(1e18, 1e18);
        uint160 q96 = uint160(2 ** 96);
        assertEq(result, q96);
    }

    function test_computeSqrtPriceX96_priceOf4() public pure {
        // price = 4, sqrtPrice = 2, sqrtPriceX96 = 2 * 2^96
        uint160 result = PriceLib.computeSqrtPriceX96(1e18, 4e18);
        uint160 expected = uint160(2 * (2 ** 96));
        assertEq(result, expected);
    }

    function test_computeSqrtPriceX96_fractionalPrice() public pure {
        // price = 0.25, sqrtPrice = 0.5, sqrtPriceX96 = 0.5 * 2^96 = 2^95
        uint160 result = PriceLib.computeSqrtPriceX96(4e18, 1e18);
        uint160 expected = uint160(2 ** 95);
        assertEq(result, expected);
    }

    function test_clearingPriceToSqrtPriceX96_tokenOrdering() public pure {
        address tokenA = address(0x1);
        address tokenB = address(0x2);
        uint256 q96 = 2 ** 96;

        uint160 priceAB = PriceLib.clearingPriceToSqrtPriceX96(q96 / 2, tokenA, tokenB);
        uint160 priceBA = PriceLib.clearingPriceToSqrtPriceX96(q96 / 2, tokenB, tokenA);

        // Different orderings should give different prices
        assertTrue(priceAB != priceBA, "Token ordering should affect price");
    }

    function test_clearingPriceToSqrtPriceX96_nonZero() public pure {
        uint256 q96 = 2 ** 96;
        uint160 result = PriceLib.clearingPriceToSqrtPriceX96(q96 / 2, address(0x1), address(0x2));
        assertTrue(result > 0, "sqrtPriceX96 should be non-zero");
    }

    function test_computeSqrtPriceX96_revertsZeroAmount0() public {
        PriceLibWrapper wrapper = new PriceLibWrapper();
        vm.expectRevert("PriceLib: zero amount0");
        wrapper.computeSqrtPriceX96(0, 1e18);
    }

    function test_computeSqrtPriceX96_revertsZeroAmount1() public {
        PriceLibWrapper wrapper = new PriceLibWrapper();
        vm.expectRevert("PriceLib: zero amount1");
        wrapper.computeSqrtPriceX96(1e18, 0);
    }

    // ============================================
    // clearingPriceToSqrtPriceX96 — Q96 correctness
    // ============================================

    function test_clearingPriceQ96_unitPrice_auctionIsToken0() public pure {
        // CCA clearing price = 1.0 → Q96 = 2^96
        // auctionToken < paymentToken → token0=auction, token1=payment
        // sqrtPriceX96 = sqrt(price) * 2^96 = sqrt(1) * 2^96 = 2^96
        uint256 q96 = 2 ** 96;
        uint160 result = PriceLib.clearingPriceToSqrtPriceX96(q96, address(0x1), address(0x2));
        assertEq(result, uint160(q96), "Unit price should give sqrtPriceX96 = 2^96");
    }

    function test_clearingPriceQ96_unitPrice_auctionIsToken1() public pure {
        // CCA clearing price = 1.0 → Q96 = 2^96
        // auctionToken > paymentToken → token0=payment, token1=auction
        // Inverted: sqrtPriceX96 = sqrt(1/price) * 2^96 = 2^96
        uint256 q96 = 2 ** 96;
        uint160 result = PriceLib.clearingPriceToSqrtPriceX96(q96, address(0x2), address(0x1));
        assertEq(result, uint160(q96), "Unit price inverted should also give 2^96");
    }

    function test_clearingPriceQ96_priceOf4_auctionIsToken0() public pure {
        // CCA clearing price = 4.0 → Q96 = 4 * 2^96
        // token0=auction, token1=payment → sqrtPriceX96 = sqrt(4) * 2^96 = 2 * 2^96
        uint256 q96 = 2 ** 96;
        uint256 priceQ96 = 4 * q96;
        uint160 result = PriceLib.clearingPriceToSqrtPriceX96(priceQ96, address(0x1), address(0x2));
        assertEq(result, uint160(2 * q96), "Price=4 should give sqrtPriceX96 = 2 * 2^96");
    }

    function test_clearingPriceQ96_priceOf4_auctionIsToken1() public pure {
        // CCA clearing price = 4.0 → Q96 = 4 * 2^96
        // token0=payment, token1=auction → sqrtPriceX96 = sqrt(1/4) * 2^96 = 0.5 * 2^96 = 2^95
        uint256 q96 = 2 ** 96;
        uint256 priceQ96 = 4 * q96;
        uint160 result = PriceLib.clearingPriceToSqrtPriceX96(priceQ96, address(0x2), address(0x1));
        assertEq(result, uint160(2 ** 95), "Price=4 inverted should give sqrtPriceX96 = 2^95");
    }

    function test_clearingPriceQ96_inverseRelationship() public pure {
        // For price P: when auction is token0, sqrtPrice = sqrt(P) * 2^96
        //              when auction is token1, sqrtPrice = sqrt(1/P) * 2^96
        // Product should be (2^96)^2 = 2^192
        uint256 q96 = 2 ** 96;
        uint256 priceQ96 = 4 * q96; // price = 4

        uint160 sqrtWhenToken0 = PriceLib.clearingPriceToSqrtPriceX96(priceQ96, address(0x1), address(0x2));
        uint160 sqrtWhenToken1 = PriceLib.clearingPriceToSqrtPriceX96(priceQ96, address(0x2), address(0x1));

        // sqrt(4) * sqrt(1/4) = 1, so sqrtWhenToken0 * sqrtWhenToken1 should equal Q96^2 = Q192
        uint256 product = uint256(sqrtWhenToken0) * uint256(sqrtWhenToken1);
        assertEq(product, 2 ** 192, "Inverse orderings should multiply to 2^192");
    }

    function test_clearingPriceQ96_revertsZeroPrice() public {
        PriceLibWrapper wrapper = new PriceLibWrapper();
        vm.expectRevert("PriceLib: zero clearing price");
        wrapper.clearingPriceToSqrtPriceX96(0, address(0x1), address(0x2));
    }

    function test_clearingPriceQ96_withinTickRange() public pure {
        // Verify output stays within Uniswap V4 valid sqrtPrice range
        uint256 q96 = 2 ** 96;

        // Test various prices: 0.01, 0.1, 1, 10, 100
        uint256[5] memory prices = [q96 / 100, q96 / 10, q96, 10 * q96, 100 * q96];

        for (uint256 i = 0; i < prices.length; i++) {
            uint160 result = PriceLib.clearingPriceToSqrtPriceX96(prices[i], address(0x1), address(0x2));
            assertTrue(result >= TickMath.MIN_SQRT_PRICE, "sqrtPrice below MIN");
            assertTrue(result <= TickMath.MAX_SQRT_PRICE, "sqrtPrice above MAX");
        }
    }

    function test_clearingPriceQ96_monotonic() public pure {
        // Higher clearing price → higher sqrtPriceX96 (when auction is token0)
        uint256 q96 = 2 ** 96;

        uint160 priceLow = PriceLib.clearingPriceToSqrtPriceX96(q96 / 10, address(0x1), address(0x2));
        uint160 priceMid = PriceLib.clearingPriceToSqrtPriceX96(q96, address(0x1), address(0x2));
        uint160 priceHigh = PriceLib.clearingPriceToSqrtPriceX96(10 * q96, address(0x1), address(0x2));

        assertTrue(priceLow < priceMid, "Lower price should give lower sqrtPrice");
        assertTrue(priceMid < priceHigh, "Higher price should give higher sqrtPrice");
    }

    function test_clearingPriceQ96_monotonic_inverted() public pure {
        // Higher clearing price → LOWER sqrtPriceX96 when auction is token1
        // (because sqrtPrice = sqrt(1/P) * 2^96)
        uint256 q96 = 2 ** 96;

        uint160 priceLow = PriceLib.clearingPriceToSqrtPriceX96(q96 / 10, address(0x2), address(0x1));
        uint160 priceMid = PriceLib.clearingPriceToSqrtPriceX96(q96, address(0x2), address(0x1));
        uint160 priceHigh = PriceLib.clearingPriceToSqrtPriceX96(10 * q96, address(0x2), address(0x1));

        assertTrue(priceLow > priceMid, "Lower price should give higher sqrtPrice (inverted)");
        assertTrue(priceMid > priceHigh, "Higher price should give lower sqrtPrice (inverted)");
    }
}

/// @notice External wrapper to allow vm.expectRevert on internal library calls
contract PriceLibWrapper {
    function computeSqrtPriceX96(uint256 a, uint256 b) external pure returns (uint160) {
        return PriceLib.computeSqrtPriceX96(a, b);
    }

    function clearingPriceToSqrtPriceX96(uint256 price, address auction, address payment)
        external
        pure
        returns (uint160)
    {
        return PriceLib.clearingPriceToSqrtPriceX96(price, auction, payment);
    }
}

// ============================================
// POOLKEYLIB TESTS
// ============================================

contract PoolKeyLibTest is TestBase {
    function test_constructPoolKey_ordersSorted() public pure {
        address tokenA = address(0x2);
        address tokenB = address(0x1);

        PoolKey memory key = PoolKeyLib.constructPoolKey(tokenA, tokenB, 3000, 60);

        // token0 should be the lower address
        assertEq(Currency.unwrap(key.currency0), address(0x1));
        assertEq(Currency.unwrap(key.currency1), address(0x2));
        assertEq(key.fee, 3000);
        assertEq(key.tickSpacing, 60);
    }

    function test_constructPoolKey_alreadySorted() public pure {
        address tokenA = address(0x1);
        address tokenB = address(0x2);

        PoolKey memory key = PoolKeyLib.constructPoolKey(tokenA, tokenB, 500, 10);

        assertEq(Currency.unwrap(key.currency0), address(0x1));
        assertEq(Currency.unwrap(key.currency1), address(0x2));
    }

    function test_constructPoolKey_revertsIdenticalTokens() public {
        PoolKeyLibWrapper wrapper = new PoolKeyLibWrapper();
        vm.expectRevert("PoolKeyLib: identical tokens");
        wrapper.constructPoolKey(address(0x1), address(0x1), 3000, 60);
    }

    function test_getFullRangeTicks() public pure {
        (int24 tickLower, int24 tickUpper) = PoolKeyLib.getFullRangeTicks(60);

        // Should be aligned to tick spacing
        assertEq(tickLower % 60, 0);
        assertEq(tickUpper % 60, 0);

        // Should be close to MIN_TICK / MAX_TICK
        assertTrue(tickLower <= TickMath.MIN_TICK + 60);
        assertTrue(tickUpper >= TickMath.MAX_TICK - 60);

        // Symmetric
        assertEq(tickLower, -tickUpper);
    }

    function test_getFullRangeTicks_spacing1() public pure {
        (int24 tickLower, int24 tickUpper) = PoolKeyLib.getFullRangeTicks(1);

        assertEq(tickLower, TickMath.MIN_TICK);
        assertEq(tickUpper, TickMath.MAX_TICK);
    }
}

/// @notice External wrapper to allow vm.expectRevert on internal library calls
contract PoolKeyLibWrapper {
    function constructPoolKey(address tokenA, address tokenB, uint24 fee, int24 tickSpacing)
        external
        pure
        returns (PoolKey memory)
    {
        return PoolKeyLib.constructPoolKey(tokenA, tokenB, fee, tickSpacing);
    }
}

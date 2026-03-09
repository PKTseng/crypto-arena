// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title  CryptoArenaBet
 * @notice Records BTC UP/DOWN predictions on-chain (Sepolia testnet demo).
 *         Prices are stored as integer × 100  (e.g. $67,475.10 → 6747510).
 *         No ETH is at risk — this is a provable-prediction ledger.
 */
contract CryptoArenaBet {

    // ── Types ──────────────────────────────────────────────────────────────
    enum Direction { UP, DOWN }

    struct BetRecord {
        address   player;
        Direction direction;
        uint256   lockedPrice;    // price × 100  (cents)
        uint256   betAmount;      // game points
        uint256   timestamp;
        bool      settled;
        bool      won;
    }

    // ── State ──────────────────────────────────────────────────────────────
    uint256 public totalBets;
    mapping(uint256 => BetRecord)   public bets;
    mapping(address => uint256[])   private _playerBetIds;

    // ── Events ─────────────────────────────────────────────────────────────
    event BetPlaced(
        uint256 indexed betId,
        address indexed player,
        uint8           direction,   // 0 = UP, 1 = DOWN
        uint256         lockedPrice,
        uint256         betAmount,
        uint256         timestamp
    );

    event BetSettled(
        uint256 indexed betId,
        address indexed player,
        bool            won,
        uint256         settlementPrice
    );

    // ── Write: Place a bet ─────────────────────────────────────────────────
    /**
     * @param direction   0 = UP, 1 = DOWN
     * @param lockedPrice Current BTC price × 100  (e.g. 6747510)
     * @param betAmount   Game-point wager
     * @return betId      Unique bet identifier
     */
    function placeBet(
        uint8   direction,
        uint256 lockedPrice,
        uint256 betAmount
    ) external returns (uint256 betId) {
        require(direction  <= 1, "Invalid direction");
        require(lockedPrice > 0, "Invalid price");
        require(betAmount   > 0, "Invalid bet amount");

        betId = totalBets++;

        bets[betId] = BetRecord({
            player:      msg.sender,
            direction:   Direction(direction),
            lockedPrice: lockedPrice,
            betAmount:   betAmount,
            timestamp:   block.timestamp,
            settled:     false,
            won:         false
        });

        _playerBetIds[msg.sender].push(betId);

        emit BetPlaced(betId, msg.sender, direction, lockedPrice, betAmount, block.timestamp);
    }

    // ── Write: Settle a bet ────────────────────────────────────────────────
    /**
     * @param betId           The bet to settle
     * @param settlementPrice BTC price at settlement × 100
     */
    function settleBet(uint256 betId, uint256 settlementPrice) external {
        BetRecord storage r = bets[betId];
        require(r.player    == msg.sender, "Not your bet");
        require(!r.settled,                "Already settled");
        require(r.lockedPrice > 0,         "Bet not found");

        bool won = (r.direction == Direction.UP   && settlementPrice > r.lockedPrice)
                || (r.direction == Direction.DOWN  && settlementPrice < r.lockedPrice);

        r.settled = true;
        r.won     = won;

        emit BetSettled(betId, msg.sender, won, settlementPrice);
    }

    // ── Views ──────────────────────────────────────────────────────────────
    function getPlayerBetIds(address player) external view returns (uint256[] memory) {
        return _playerBetIds[player];
    }

    function getBet(uint256 betId) external view returns (BetRecord memory) {
        return bets[betId];
    }
}

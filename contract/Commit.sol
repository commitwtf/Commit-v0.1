// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Commit {
    using SafeERC20 for IERC20;

    // USDC token contract
    IERC20 public stakeToken;
    address public owner;

    // The structure of the commitment
    struct Commitment {
        uint256 id;
        uint256 stakeAmount;
        string oneLiner;
        address[] participants;
        mapping(address => bool) participantSuccess;
        bool isPaid;
        uint256 failedCount;
    }

    uint256 public nextCommitmentId;
    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => mapping(address => bool)) public commitmentParticipation;
    mapping(uint256 => mapping(address => uint256)) public balances;

    event CommitmentCreated(uint256 id, uint256 stakeAmount, string oneLiner);
    event CommitmentJoined(uint256 id, address participant);
    event CommitmentEvaluated(uint256 id, address[] participants, bool success);
    event Withdrawal(address indexed user, uint256 amount);
    event TokenAddressUpdated(address newTokenAddress);
    event RewardDistributed(uint256 id);

    constructor(IERC20 _stakeToken) {
        stakeToken = _stakeToken;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function updateTokenAddress(IERC20 _newstakeToken) external onlyOwner {
        stakeToken = _newstakeToken;
        emit TokenAddressUpdated(address(_newstakeToken));
    }

    function createCommitment(uint256 _stakeAmount, string calldata _oneLiner) external onlyOwner {
        stakeToken.safeTransferFrom(msg.sender, address(this), _stakeAmount);
        Commitment storage commitment = commitments[nextCommitmentId];
        commitment.id = nextCommitmentId;
        commitment.stakeAmount = _stakeAmount;
        commitment.oneLiner = _oneLiner;

        emit CommitmentCreated(nextCommitmentId, _stakeAmount, _oneLiner);
        nextCommitmentId++;
    }

    // Join a commitment
    function joinCommitment(uint256 _id) external {
        Commitment storage commitment = commitments[_id];
        require(commitment.id == _id, "Commitment does not exist");
        require(!commitmentParticipation[_id][msg.sender], "Already joined");

        stakeToken.safeTransferFrom(msg.sender, address(this), commitment.stakeAmount);

        commitment.participants.push(msg.sender);
        commitmentParticipation[_id][msg.sender] = true;
        balances[_id][msg.sender] = commitment.stakeAmount;

        emit CommitmentJoined(_id, msg.sender);
    }

    // Admin-only function to evaluate participants and mark success or failure
    function evaluateCommitment(uint256 _id, address[] calldata _participants, bool _success) external onlyOwner {
        Commitment storage commitment = commitments[_id];
        require(commitment.id == _id, "Commitment does not exist");

        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            require(commitmentParticipation[_id][participant], "Participant did not join");

            if (!_success) {
                commitment.failedCount++;
            }

            commitment.participantSuccess[participant] = _success;
        }

        emit CommitmentEvaluated(_id, _participants, _success);
    }

    // Distribute rewards after evaluation
    function distributeRewards(uint256 _id) external onlyOwner {
        Commitment storage commitment = commitments[_id];
        require(commitment.id == _id, "Commitment does not exist");
        require(!commitment.isPaid, "Rewards already distributed");

        uint256 totalStake = commitment.participants.length * commitment.stakeAmount;
        uint256 failedStake = commitment.failedCount * commitment.stakeAmount;
        uint256 rewardPerSuccess = failedStake / (commitment.participants.length - commitment.failedCount);

        for (uint256 i = 0; i < commitment.participants.length; i++) {
            address participant = commitment.participants[i];
            if (commitment.participantSuccess[participant]) {
                balances[_id][participant] += rewardPerSuccess;
            }
        }

        balances[_id][address(this)] -= totalStake;

        commitment.isPaid = true;
        emit RewardDistributed(_id);
    }

    // Function to withdraw USDC rewards
    function withdraw(uint256 _id) external {
        uint256 amount = balances[_id][msg.sender];
        require(amount > 0, "No balance to withdraw");

        balances[_id][msg.sender] = 0;
        stakeToken.safeTransfer(msg.sender, amount);

        emit Withdrawal(msg.sender, amount);
    }
}

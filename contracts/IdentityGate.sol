// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityGate
 * @notice Smart contract for gating chat rooms based on Self Protocol identity verification
 * @dev This contract stores verification status for users and allows room gating
 */
contract IdentityGate {
    // Mapping from user address to verification status
    mapping(address => bool) public verifiedUsers;
    
    // Mapping from user address to proof type (e.g., "adult", "unique", "country")
    mapping(address => string) public userProofType;
    
    // Mapping from room ID to required proof type
    mapping(string => string) public roomRequirements;
    
    // Owner of the contract
    address public owner;
    
    // Events
    event UserVerified(address indexed user, string proofType);
    event RoomRequirementSet(string indexed roomId, string proofType);
    event AccessGranted(address indexed user, string indexed roomId);
    event AccessDenied(address indexed user, string indexed roomId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Verify a user's identity (called after Self Protocol proof verification)
     * @param user Address of the user to verify
     * @param proofType Type of proof (e.g., "adult", "unique", "country")
     */
    function verifyUser(address user, string memory proofType) external onlyOwner {
        verifiedUsers[user] = true;
        userProofType[user] = proofType;
        emit UserVerified(user, proofType);
    }
    
    /**
     * @notice Set the proof requirement for a specific room
     * @param roomId Identifier of the room
     * @param requiredProofType Required proof type to access the room
     */
    function setRoomRequirement(string memory roomId, string memory requiredProofType) external onlyOwner {
        roomRequirements[roomId] = requiredProofType;
        emit RoomRequirementSet(roomId, requiredProofType);
    }
    
    /**
     * @notice Check if a user can access a room
     * @param user Address of the user
     * @param roomId Identifier of the room
     * @return canAccess True if user can access the room
     */
    function canAccessRoom(address user, string memory roomId) external view returns (bool) {
        // If room has no requirements, allow access
        bytes memory requirement = bytes(roomRequirements[roomId]);
        if (requirement.length == 0) {
            return true;
        }
        
        // Check if user is verified and has the required proof type
        if (!verifiedUsers[user]) {
            return false;
        }
        
        // Compare proof types (simple string comparison)
        // In production, this would use more sophisticated proof verification
        return keccak256(bytes(userProofType[user])) == keccak256(bytes(roomRequirements[roomId]));
    }
    
    /**
     * @notice Check if a user is verified
     * @param user Address of the user
     * @return isVerified True if user is verified
     */
    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }
    
    /**
     * @notice Get the proof type for a user
     * @param user Address of the user
     * @return proofType The proof type string
     */
    function getUserProofType(address user) external view returns (string memory) {
        return userProofType[user];
    }
}


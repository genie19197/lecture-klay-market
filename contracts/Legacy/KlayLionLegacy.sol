pragma solidity ^0.5.0;

contract IKIP17Receiver {
    function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4);
}
contract IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4);
}

/// @title NFTSimple
/// @dev NFTSimple
contract NFTSimple {
    string public name = "KlayLion";

    // Token symbol
    string public symbol= "KL";
    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => string) public tokenURIs;
    
    // info for view
    mapping(address => uint256[]) private _ownedTokens;
    
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "KIP17: transfer of token that is not own");
        //
        _removeTokenFromList(from, tokenId);
        tokenOwner[tokenId] = to;
        //
        require(_checkOnKIP17Received(from, to, tokenId, _data), "KIP17: transfer to non KIP17Receiver implementer");
    }
    
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {
        tokenOwner[tokenId] = to;
        _ownedTokens[to].push(tokenId);
    
        // Set Token URI
        tokenURIs[tokenId] = tokenURI;
        return true;
    }
    
    function ownedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
    
    function _removeTokenFromList(address from, uint256 tokenId) private {
        // Find the tokenId from list
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;

        for(uint256 i=0;i<_ownedTokens[from].length;i++) {
            if (tokenId == _ownedTokens[from][i]) {
                uint256 temp = tokenId;
                tokenId = _ownedTokens[from][i];
                _ownedTokens[from][i] = temp;
                break;
            }
        }
        // Swap the token with the last
        // subtract length
        _ownedTokens[from].length--;
    }
    function _checkOnKIP17Received(address from, address to, uint256 tokenId, bytes memory _data)
        internal returns (bool)
    {
        if (!isContract(to)) {
            return true;
        }
        
        bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data);
        if (retval == _ERC721_RECEIVED) {
            return true;
        }
        
        return false;
        // bytes4 retval = IKIP17Receiver(to).onKIP17Received(msg.sender, from, tokenId, _data);
        // return (retval == _KIP17_RECEIVED);
    }
    
    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
}

/// @title NFTMarket
/// @dev NFTMarket works with NFTSimple and KIP17
contract NFTMarket {
    mapping(uint256 => address) public seller;
    
    function buyNFT(uint256 tokenId, address NFT) public payable returns (bool) {
        address payable receiver = address(uint160(seller[tokenId]));
        
        // Send 0.01 klay to Seller
        receiver.transfer(10**16); 
        
        // Send NFT if properly send klay
        NFTSimple(NFT).safeTransferFrom(address(this), msg.sender, tokenId, '0x00');
        
        return true;
    }
    
    // function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
    //     // Executed when received token;
    //     // seller[tokenId] = from;
    //     return bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    // }
    
    // Called when SafeTransferFrom called from NFT Contract
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
        public
        returns (bytes4)
    {
        // Set token seller, who was a token owner
        seller[tokenId] = from;
        
        // return signature which means this contract implemented interface for ERC721
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}
pragma solidity >=0.4.25 <0.9.0;

import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract myERC is ERC165, Ownable, IERC721 {
  using Address for address;
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  string private _name;
  string private _symbol;

  mapping(uint256 => address) private _owners;
  mapping(address => uint256) private _balances;
  mapping(uint256 => address) private _tokenApprovals;
  mapping(address => mapping(address => bool)) private _operatorApprovals;

  // tested, works
  constructor(string memory name_, string memory symbol_){
    _name = name_;
    _symbol = symbol_;
  }

  // helper
  // tested
  function name() public view virtual returns (string memory) {
    return _name;
  }

  // tested
  // helper
  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  // required by spec, check that it supports ERC165 
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return 
      interfaceId == type(IERC721).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  // required by spec
  // count all NFTs assigned to an owner
  function balanceOf(address owner) external view returns (uint256){
    require(owner != address(0), "ERC721: address zero is not a valid owner");
    return _balances[owner];
  }

  // required by spec
  // find the owner of an NFT
  function ownerOf(uint256 tokenId) public view returns (address) {
    address owner = _owners[tokenId];
    require(owner != address(0), "ERC721: invalid token ID");
    return owner;
  }

  // extra
  function mint(address to) public {
    require(to != address(0), "ERC721: mint to the zero address");

    uint256 tokenId = _tokenIdCounter.current();
    require(_owners[tokenId] == address(0), "ERC721: token already minted");
    _tokenIdCounter.increment();

    require(
      _checkOnERC721Received(address(0), to, tokenId, ""),
      "ERC721: transfer to non ERC721Receiver implementer"
    );

    unchecked {
      _balances[to] += 1;
    }

    _owners[tokenId] = to;

    // required by spec
    emit Transfer(address(0), to, tokenId);
  }

  function transfer(address from, address to, uint256 tokenId) public {
    require(myERC.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    require(to != address(0), "ERC721: transfer to the zero address");

    delete _tokenApprovals[tokenId];

    unchecked {
      _balances[from] -= 1;
      _balances[to] += 1;
    }

    _owners[tokenId] = to;

    // the ERC721 standard requires we emit this event
    emit Transfer(from, to, tokenId);
  }

  // required by the spec (marked as external payable)
  function approve(address to, uint256 tokenId) external {
    address owner = myERC.ownerOf(tokenId);
    require(to != owner, "ERC721: approval to current owner");

    // check that the caller has the authority to approve addresses
    require(
      _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
      "ERC721: approved caller is not token owner or approved for all"
    );

    _tokenApprovals[tokenId] = to;

    // the ERC721 standard requires we emit this event when a new approval occurs
    emit Approval(owner, to, tokenId);
  }

  // helper
  function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
    address owner = myERC.ownerOf(tokenId);
    return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
  }

  // required by the spec
  function getApproved(uint256 tokenId) public view returns (address) {
    require(_owners[tokenId] != address(0), "ERC721: invalid token ID");
    return _tokenApprovals[tokenId];
  }

  // required by the spec
  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  // required by spec
  function setApprovalForAll(address operator, bool approved) external {
    require(_msgSender() != operator, "ERC721: approve to caller");
    _operatorApprovals[_msgSender()][operator] = approved;
    emit ApprovalForAll(_msgSender(), operator, approved);
  }

  // required by the spec
  function transferFrom(address from, address to, uint256 tokenId) external {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    transfer(from, to, tokenId);
  }

  // required by the spec
  function safeTransferFrom(address from, address to, uint256 tokenId) external {
    safeTransferFrom(from, to, tokenId, "");
  }

  // required by the spec
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    transfer(from, to, tokenId);
    require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721REceiver implementer");
  }

  // required by spec
  // handle the receipt of the NFT
  function _checkOnERC721Received(
    address from,
    address to,
    uint256 tokenId,
    bytes memory data
  ) private returns (bool) {
    if(to.isContract()) {
      try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
        return retval == IERC721Receiver.onERC721Received.selector;
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert("ERC721: transfer to non ERC721Receiver implementer");
        } else {
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }
  }
}
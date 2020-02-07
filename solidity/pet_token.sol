
pragma solidity ^0.4.4;
import "./pet_factory.sol";
import "./ecr712.sol";

// PET 宠物 version - 1.0
contract PetToken is PetFactory, ERC721{
    
    string public name = "Pet Token";  // token 名称
 
    string public symbol = "PET";    // token 简称
    
    uint8 public decimals = 0; //token小数点后几位，PET币不可分割，所以小数点后没有位
   
    mapping (address => mapping (address => uint256)) allowed;  // 地址 => ( 允许转账的地址 => 准许转账数量 )映射
    
    
    mapping (uint => address) petApprovals; //预授权转账地址
    
    
    // 遵守 ECR712协议
    
    // 获取某个账户的余额
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return balances[_owner];
    }
    
    // 获取某个token的地址
    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return petToOwner[_tokenId];
    }  
    
    // 转账私有函数
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        balances[_to] ++;
        balances[msg.sender] --;
        petToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId, uint32(now));
    }

    //转账
    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }
    
    // 预授权
    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        petApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }
    
    // 行使授权
    function takeOwnership(uint256 _tokenId) public {
        require(petApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
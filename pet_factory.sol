pragma solidity ^0.4.4;

import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "./ownable.sol";

contract PetFactory is Ownable {
    
    using strings for *;

    event NewPet(uint petId, string name, uint dna, address master); // 新生成宠物事件
    event NewFeed(uint petId, address indexed from, string message, uint32 time, uint levelCount); // 新喂食事件
    event NewPerson(address person, string name, uint32 time); //新地址事件
    
    uint dnaModulus = 10 ** 16; // DNA位数 16位整型
    uint8 maxLevel = 99; // 宠物最大等级
    uint32 cooldownTime = 12 hours; // 下次可捕获宠物间隔时间
    uint32 feedCooldownTime = 6 hours; // 下次可喂食的间隔时间
    uint private randNonce = 0;
    uint public price =  0.001 ether; // 定制宠物的价格
    
    // 宠物结构体
    struct Pet {
        string name; // 宠物名
        uint dna; // 宠物dna
        uint8 level; // 宠物等级 
        uint32 createTime; // 宠物创建时间
        uint32 readyTime; // 宠物喂食冻结时间
        uint feedCount; //喂养次数
    }
    
    // 用户（宠物主人）
    struct Person {
        string name; // 用户名
        uint32 readyTime; // 下次可捕获宠物时间
    }
    
    Pet[] public pets; // 所有宠物的数组
    
    //喂养记录结构体
    struct Feed {
        address from; // 喂养人的地址
        string message; //留言
        uint32 feedTime; //喂养时间
        uint8 levelCount;  //此次喂食的升级等级
    }
 
    mapping (uint => address) public petToOwner; // 宠物Id => 宠物主人地址的映射
    mapping (address => Person) public peoples;  // 地址 => 人的映射
    mapping (address => uint256) public balances;  // 地址 => token余额(拥有宠物数量)的映射
    mapping (uint => mapping(uint => Feed)) public myFeeds; // 宠物id => (喂食记录自增id，非喂食id => 喂食记录结构体)
    
    modifier onlyOwnerOf(uint _tokenId) {
        require(msg.sender == petToOwner[_tokenId]);
        _;
    }
    
    // 创建一个小宠物
    function _createPet(string _name, uint _dna, uint8 _level, address _who) internal {
        if(balances[msg.sender] == 0 && utilCompareInternal(peoples[msg.sender].name, "" ) ) {
            // 第一次创建宠物的情况下， 如果没有创建用户信息，则自动创建
            updateUser("");
        }
        uint id = pets.push(Pet(_name, _dna,_level, uint32(now), 0, 0)) - 1;  // 宠物数组里生成一个， id为宠物Id 默认一级
        petToOwner[id] = _who; //宠物认主
        balances[_who] ++; // 主人宠物数量 + 1
        emit NewPet(id, _name, _dna, _who); // 发送事件
    }
    
    // 初始化一个用户或者更新用户名
    function updateUser(string _name) public {
        string memory defalutName = "用户".toSlice().concat(toString(now ).toSlice()); // 如果没有传入name参数，则默认一个用户名
        if(utilCompareInternal(peoples[msg.sender].name, "" ) ) {
            emit NewPerson(msg.sender, utilCompareInternal(_name, "") ? defalutName : _name, uint32(now));
        } 
        peoples[msg.sender].name = utilCompareInternal(_name, "") ? defalutName : _name;
    }
    
    // 捕获宠物函数
    function capture(string _name) public returns(string){
        require(balances[msg.sender] == 0 || now >= peoples[msg.sender].readyTime);  // 保证这是第一次捕猎或者过了冷却时间
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;   //生成一个随机dna
        string memory defalutName = "宠物".toSlice().concat(toString(pets.length + 1).toSlice()); //如果没有传入宠物名称，则生成一个默认的宠物名
        _createPet(utilCompareInternal(_name, "") ? defalutName : _name, randDna, 1, msg.sender);
        peoples[msg.sender].readyTime = uint32(now + cooldownTime); //更新宠物冷却时间 
    }
    
    // 定制一个宠物
    function customPet(string _name, uint _dna) external payable {
        require(msg.value >= price);
        string memory defalutName = "宠物".toSlice().concat(toString(pets.length + 1).toSlice()); //如果没有传入宠物名称，则生成一个默认的宠物名
        uint dna;
        if(_dna < 1000000000) {  //输入的dna一定是个十位数以上的，否则新生成一个16位的dna
           dna = _generateRandomDna(defalutName);
        }else{
            dna =  _dna % dnaModulus;
        }
        _createPet(utilCompareInternal(_name, "") ? defalutName : _name, dna, uint8(20), msg.sender);
    }
    
    function setPrice(uint _price) public onlyOwner {
        price = _price;
    }
    
    // ETH提现
    function withdraw() public onlyOwner{
        owner.transfer(address(this).balance);
    }
    
    // 获取ETH余额
    function getBalance() public view returns(uint){
      return address(this).balance;
    }
    
    // 宠物喂养 _id => 宠物id, _message => 留言
    function feed(uint _id, string _message) public {
        require( now >= pets[_id].readyTime);
         uint8 rand = uint8(randMod(5)); // 1~5随机数
        //喂养后宠物升级 随机升个1到5级
        if(_upgrade(_id, rand)) {
            myFeeds[_id][pets[_id].feedCount] = Feed(msg.sender, _message, uint32(now), rand); // 将喂食记录的id指向给对应的宠物
            pets[_id].feedCount ++; //这个宠物喂养次数+1
            pets[_id].readyTime = uint32(now + feedCooldownTime); // 更新宠物下次可喂养时间 
            emit NewFeed(_id, msg.sender, _message, uint32(now), rand);
            // 20级以上宠物喂食后 有30%的概率生成一个新宠物
            if( pets[_id].level >= 20) {
                if(randMod(100) <= 30) { 
                    string memory defalutName = "喂食生成宠物"; //如果没有传入宠物名称，则生成一个默认的宠物名
                    uint randDna = _generateRandomDna(defalutName);
                    randDna = randDna - randDna % 100;   //生成一个随机dna
                    _createPet(defalutName, randDna, uint8(1), petToOwner[_id]);  // 生成的新宠物是喂食宠物的主人的，并不是喂食的人
                }
            }
        }
    }
    
    // 宠物升级 
    // _id => 宠物id  _levelCount 升级级数
    function _upgrade(uint _id, uint8 _levelCount ) internal returns (bool) {
        if(pets[_id].level + _levelCount <= maxLevel) {  // 升级后的等级要小于最大等级
            pets[_id].level += _levelCount;
            return true;
        } 
        return false;
    }
    
    // 获取某地址下的全部宠物id
    function getPetsByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](balances[_owner]);
        uint counter = 0;
        for (uint i = 0; i < pets.length; i++) {
          if (petToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
          }
        }
        return result;
    }
    
    // 比对俩个字符串是否相等
    function utilCompareInternal(string a, string b) internal pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }
    
    // 讲一个整数型转发为string型
    function toString(uint i) pure internal returns (string) {
      if (i == 0) return "0";
       uint j = i;
       uint length;
       while (j != 0){
           length++;
           j /= 10;
       }
       bytes memory bstr = new bytes(length);
       uint k = length - 1;
       while (i != 0){
           bstr[k--] = byte(48 + i % 10);
           i /= 10;
       }
       return string(bstr); 
    }
    
    // 创建一个随机Dna
    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(bytes(_str.toSlice().concat(toString(now).toSlice()))));
        return rand % dnaModulus;
    }
    
    //生成一个随机数
    function randMod(uint _modulus) internal returns(uint num) {
        randNonce++;
        num = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        if(num == 0) {
            num = 1;
        } 
    }

}
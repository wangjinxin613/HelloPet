import myABI from './assets/cryptozombies_abi.json';
var Web3 = require('web3');
import store from './vuex/store.js'
import Vue from 'vue';
import main from '@/main.js';
import config from './config.js';

class Token {

    //初始化
    constructor() {


        window.onload = () => {
            // console.log(ethereum.networkVersion);
            // // 只能合约地址
            // let myContractAddress = config.contractAddress;

            // if (typeof web3 === 'undefined') {
            //     if (main.$route.path.indexOf('/error') == -1) {
            //         main.$router.push({
            //             path: '/error/请先安装MetaMask浏览器插件'
            //         })
            //     }
            //     setInterval(() => {
            //         if (typeof web3 === 'undefined') {
            //             if (main.$route.path.indexOf('/error') == -1)
            //                 main.$router.push({
            //                     path: '/error/请先安装MetaMask浏览器插件'
            //                 })
            //             return;
            //         }
            //     }, 100)
            //     return;
            // }
            // var web3js = new Web3(web3.currentProvider);
            // this.web3js = web3js;
            // var myContract = new web3js.eth.Contract(myABI, myContractAddress);
            // this.myContract = myContract;

            // setInterval(() => {
            //     this.login(); //自动登录
            // }, 500)
           setInterval(() => {
               this.init();
           }, 500)
        }
    }

    init() {
        if (typeof web3 === 'undefined') {
            if (main.$route.path.indexOf('/error') == -1)
                main.$router.push({
                    path: '/error/请先安装MetaMask浏览器插件'
                })
            return;
        }
        var networkVersion = ethereum.networkVersion; //网络类型
        var have = false;
        Object.keys(config.net).forEach((key, value) => {
            if (key == networkVersion) {
                have = true;
            }
        })
        if (!have) { // 不支持的网络类型
            main.$router.push({
                path: '/error/不支持的网络类型'
            })
            return;
        }
        let myContractAddress = config.net[networkVersion].contractAddress;
        var web3js = new Web3(web3.currentProvider);
        this.web3js = web3js;
        var myContract = new web3js.eth.Contract(myABI, myContractAddress);
        this.myContract = myContract;
        this.login();
    }

    // metamask 授权
    async login() {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({ /* ... */ });
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({ /* ... */ });
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        this.getAddress();
    }

    //获取目前的address
    getAddress() {
        web3.eth.getAccounts((error, result) => {
            if (typeof result[0] != 'undefined' && result[0] != this.userAccount) {
                this.userAccount = result[0];
                store.commit("updateAddress", this.userAccount);
                console.log("更换用户");
            }
            this.getUserInfo(); // 更新用户信息
            this.getBalance(); //更新余额
            this.getMyPet();
        })
    }

    //读取合约
    readContract(contractName, ...args) {
        return new Promise((resolve, reject) => {
            this.myContract.methods[contractName](...args).call().then(result => {
                resolve(result);
            }).catch((error) => {
                // new Vue().$message({
                //     message: '网络开小差了，刷新试试',
                //     type: 'error'
                // })
                reject(error);
            })
        })
    }

    // 发送合约
    sendContract(contractName, ...args) {
        return new Promise((resolve, reject) => {
            this.myContract.methods[contractName](...args).send({
                from: this.userAccount
            }).on("receipt", receipt => {
                resolve(receipt);
            }).on("error", function(error) {
                reject(error);
            });
        })
    }

    // 带着ETH发送合约
    sendContractWithEth(contractName, value, ...args) {
        return new Promise((resolve, reject) => {
            this.myContract.methods[contractName](...args).send({
                from: this.userAccount,
                value: value
            }).on("receipt", receipt => {
                resolve(receipt);
            }).on("error", function(error) {
                console.log(error);
                reject(error);
            });
        })
    }

    // 读取过去的事件
    readEvents(eventName, filter) {
        return new Promise((resolve, reject) => {
            this.myContract.getPastEvents(eventName, {
                    fromBlock: 0,
                    toBlock: 'latest',
                    filter: filter
                })
                .then(function(events) {
                    resolve(events);
                }).catch((error) => {
                    // new Vue().$message({
                    //     message: '网络开小差了，刷新试试',
                    //     type: 'error'
                    // })
                    reject(error);
                });
        })
    }

    // 获取目前登录用户信息
    async getUserInfo() {
        let result = await this.readContract("peoples", this.userAccount);
        store.commit("updateUserInfo", {
            name: result.name,
            readyTime: result.readyTime
        });
    }

    // 获取某地址的用户信息
    async getUserInfoByAddress(address) {
        let result = await this.readContract("peoples", address);
        return result;
    }

    // 获取账户余额
    async getBalance() {
        let result = await this.readContract("balanceOf", this.userAccount);
        store.commit("updateBalance", result);
    }

    // 获取某人的账户余额
    async getBalanceByAddress(address) {
        let result = await this.readContract("balanceOf", address);
        return result;
    }

    // 设置用户名
    setNickName(name) {
        this.sendContract("updateUser", name).then(result => {
            this.getUserInfo();
        })
    }

    // 捕获一只宠物
    capture(name) {
        return new Promise((resolve, reject) => {
            this.sendContract("capture", name).then(result => {
                this.getBalance();
                this.getUserInfo();
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })

    }

    // 喂食宠物
    feed(id, message) {
        return new Promise((resolve, reject) => {
            this.sendContract("feed", id, message).then(result => {
                this.getBalance();
                this.getMyPet();
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    // 获取某个宠物的详情
    async getPetDetail(petId) {
        var result = await this.readContract("pets", petId);
        let pet = {
            id: petId,
            name: result.name,
            level: result.level,
            dna: result.dna,
            feedCount: result.feedCount,
            createTime: result.createTime,
            readyTime: result.readyTime
        };
        if (Number(pet.readyTime) * 1000 >= new Date().getTime()) {
            pet.countDown = new Vue().$getStr(pet.readyTime);
        }
        return pet;
    }

    // 获取我的所有宠物
    async getMyPet() {
        var myPetIds = await this.readContract("getPetsByOwner", this.userAccount);
        var myPets = [];
        for (let i in myPetIds) {
            let pet = await this.getPetDetail(myPetIds[i]);
            myPets.push(pet);
        }
        store.commit("updateMyPets", myPets);
    }

    // 获取某个地址下的所有宠物
    async getPetByAddress(address) {
        var myPetIds = await this.readContract("getPetsByOwner", address);
        var myPets = [];
        for (let i in myPetIds) {
            let pet = await this.getPetDetail(myPetIds[i]);
            myPets.push(pet);
        }
        return myPets;
    }

    // 获取喂食记录详情
    async getFeedDetail(petId, feedId) {
        var result = await this.readContract("myFeeds", petId, feedId);
        return {
            from: result.from,
            message: result.message,
            feedTime: result.feedTime,
            levelCount: result.levelCount
        }
    }

    // 获取某宠物的喂食记录
    async getFeeds(id) {
        var pet = await this.getPetDetail(id);
        var feeds = [];
        for (let i = Number(pet.feedCount) - 1; i >= 0; i--) { //倒叙展示
            feeds.push(await this.getFeedDetail(id, i));
        }
        return feeds;
    }

    // 获取宠物主人的地址
    async petToOwner(id) {
        var result = await this.readContract("petToOwner", id);
        return result;
    }

    // 宠物转赠
    transfer(to, petId) {
        return new Promise((resolve, reject) => {
            this.sendContract("transfer", to, petId).then(result => {
                this.getBalance();
                this.getMyPet();
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    // 获取所有宠物, 根据事件
    async getAllPets() {
        return this.readEvents("NewPet");
    }

    //获取我送出的宠物
    async getMySendPet() {
        return this.readEvents("Transfer", {
            _from: this.userAccount
        });
    }

    async getMyReceivedPet() {
        return this.readEvents("Transfer", {
            _to: this.userAccount
        });
    }

    // 获取所有的喂食记录
    async getAllFeeds() {
        return await this.readEvents("NewFeed");
    }

    // 获取我的喂食记录
    async getMyFeeds() {
        return await this.readEvents("NewFeed", {
            from: this.userAccount
        });
    }

    // 获取某个宠物的转移记录
    getTransferData(petId) {
        return this.readEvents("Transfer", {
            _tokenId: petId
        });
    }

    // 获取所有的节点
    async getAllPerson() {
        return await this.readEvents("NewPerson");
    }

    // 根据dna计算出宠物的类型
    getPetType(dna) {
        if (typeof dna != 'undefined' && dna != "")
            return parseInt(dna.substring(0, 4)) % 20 + 1; // 1~20个数代表20中不同的宠物
    }

    // 修改用户名
    updateUser(name) {
        return new Promise((resolve, reject) => {
            this.sendContract("updateUser", name).then(result => {
                this.getUserInfo();
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    // 定制一直宠物
    customPet(name, dna) {
        return new Promise(async (resolve, reject) => {
            this.sendContractWithEth("customPet", await this.getPrice(), name, dna).then(result => {
                this.getBalance();
                this.getMyPet();
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    // 获取定制宠物的价格
    async getPrice() {
        var result = await this.readContract("price");
        return result;
    }

}

export default new Token();

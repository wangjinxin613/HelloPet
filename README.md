# HelloPet - 基于solidity的分布式虚拟宠物系统

> 这是一个完全分布式的虚拟宠物系统，不需要中心服务器，运行于以太坊网络上，需要依赖MetaMask浏览器插件。新加入的节点可以捕猎一只宠物，并且经过12小时后可进行下一次捕猎，宠物可以收藏可以流通。任何人可以给任何人的宠物喂食，喂食可以留言，留言内容永久存储在区块链系统里，哪怕千年之后，这些数据依然会存在，只要以太坊还运行着一个节点。

[演示地址](https://wangjinxin613.github.io/HelloPet/)
[备份演示地址](http://pet.youzhis.cn/)

## 准备环境

### 1. 安装Node.js

目前Node.js的最新版本是7.6.x。首先，从[Node.js](https://nodejs.org/)官网下载对应平台的安装程序。
在Windows上安装时务必选择全部组件，包括勾选Add to Path。

安装完成后，在Windows环境下，请打开命令提示符，然后输入node -v，如果安装正常，你应该看到v7.6.0这样的输出：
```
C:\Users\IEUser>node -v
v7.6.0
```

### 2. npm
npm是Node.js的包管理工具（package manager）。npm已经在Node.js安装的时候顺带装好了。我们在命令提示符或者终端输入npm -v，应该看到类似的输出：

```
C:\>npm -v
4.1.2
```
### 3. 安装git

[安装git方法](https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496)

## 克隆项目

### 1. 选择一个目录用于存放代码

例如: F:\code

### 2. 克隆git仓库到本地

在以上选择的目录中打开命令行工具，并输入以下命令

```
git clone https://github.com/wangjinxin613/HelloPet
```

等待命名执行完成之后，便会成功克隆项目到HelloPet文件夹

## 运行项目

### 1. 命令行进入项目目录

```
cd HelloPet
```

### 2. 安装项目依赖

```
npm install
```

### 3. 运行

```
npm run dev
```

运行成功后会出现  Your application is running here: http://localhost:8080

恭喜你，项目运行成功了，浏览器打开 http://localhost:8080 就会看到效果


## 部署

```
npm run build
```

此命令会生成编译生成一个dist文件夹，可以将其部署到服务器上。


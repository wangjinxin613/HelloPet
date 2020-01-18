<template>
    <div class="wrap">
        <div class="userInfo">
            <div class="headImg"><img src="../assets/imgs/headImg.svg" alt="" /></div>
            <div class="nick">
                {{userInfo.name}}
            </div>
            <div class="address">{{address}}</div>
        </div>
        <div class="title" style="margin-top: 30px;">
            <div>他的宠物</div>
            <div>总数：{{dataList.length}}</div>
        </div>
        <Pets :data="dataList"></Pets>
        <div class="noMore">没有更多宠物了~</div>
     </div>
</template>

<script>
import token from '../token.js';
import Pets from '../components/Pets/Pets.vue';
export default {
    data() {
        return {
            address: '',
            userInfo: {},
            dataList: []
        }
    },
    components: {
      Pets
    },
    async mounted() {
        var address = this.$route.params.address;
        this.address = address;
        var userInfo = await token.getUserInfoByAddress(address);
        this.userInfo = userInfo;
        var result = await token.getPetByAddress(address);
        this.dataList = result;
    }
}
</script>

<style lang="less" scoped>
@import  '../assets/css/global.less';
.userInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    width: 100%;
}
.headImg{
    width: 60px;
    height: 60px;


    & img{
        width: 100%;
        height: 100%;
    }
}
.nick{
    margin-top: 10px;
    font-size: 18px;
    display: inline;
}
.balance{
    right: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 16px;
    color: @text-color-info;
    margin-top: 10px;

    img{
        width: 18px;
        margin-right: 5px;
    }
}
.address {
    margin-top: 10px;
    font-size: 14px;
    color: @text-color-info;
}
</style>

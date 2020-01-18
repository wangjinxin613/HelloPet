<template>
    <div class="wrap error-view">
        <div class="error"><el-alert :title="errorText" type="error" center show-icon :closable="false"></el-alert></div>

        <div v-if="errorText == '请先安装MetaMask浏览器插件'" style="margin-bottom: 50px;width: 700px;margin:0 auto 50px ;">
            本站点为分布式虚拟宠物游戏系统，运行于区块链主网络上，是完全分布式的系统，不依赖中心服务器。需<a href="https://metamask.io/" target="_blank">安装MetaMask浏览器插件</a>，建议使用谷歌浏览器获得更好的体验。
        </div>
        <router-link to="/"><el-button type="primary" style="margin: 0 auto;display: block;">重新尝试</el-button></router-link>

    </div>
</template>

<script>
export default {
    data() {
        return {
            errorText: ''
        };
    },
    mounted() {
        this.errorText = this.$route.params.text;
    }
};
</script>

<style lang="less">
.error-view {
    .error {

        width: 450px;
        margin: 50px auto;
          margin-top: 80px;
    }

    .el-alert__title {
        font-size: 22px;
        line-height: 150%;
    }

    .el-alert--error.is-light{
        padding: 30px 20px;
    }
}
</style>

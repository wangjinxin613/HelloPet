<template>
    <div v-loading="loading">
        <div class="title wrap" style="margin-top: 30px;">
            <div>所有喂食记录</div>
            <div>总数：{{dataList.length}}</div>
        </div>
        <Feeds :list="dataList"></Feeds>
        <div class="noMore">没有更多了~</div>
    </div>
</template>

<script>
import token from '../token.js';
import { mapState } from 'vuex';
import Feeds from '../components/Feeds/Feeds.vue';
export default {
    data() {
        return {
            dataList: [],
            interval: 0,
            loading: true
        };
    },
    components: { Feeds },
    computed: {},
    mounted() {
        this.getData();
        var interval = setInterval(() => {
             this.getData();
        }, 1000)
        this.interval = interval;
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    methods: {
        async getData() {
            try {
                var dataList = await token.getAllFeeds();
                var feeds = [];
                for(let i in dataList) {
                    dataList[i].returnValues.feedTime = dataList[i].returnValues.time;
                    feeds.push(dataList[i].returnValues);
                }
                this.dataList = feeds;
                this.loading = false;
            } catch (e) {
            }
        }
    }
};
</script>

<style lang="less" scoped>


</style>

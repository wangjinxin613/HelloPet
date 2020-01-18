<template>
    <div v-loading="loading">
        <div class="title wrap" style="margin-top: 30px;">
            <div>我送出的宠物</div>
            <div>总数：{{dataList.length}}</div>
        </div>
        <Pets :data="dataList"></Pets>
           <div class="noMore">没有更多宠物了~</div>
    </div>
</template>

<script>
import token from '../token.js';
import { mapState } from 'vuex';
import Pets from '../components/Pets/Pets.vue';
export default {
    data() {
        return {
            dataList: [],
            interval: 0,
            loading: true
        };
    },
    components: { Pets },
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
                var dataList = await token.getMySendPet();
                var pets = [];
                for (let i in dataList) {
                    var id = dataList[i].returnValues._tokenId;
                    let pet = await token.getPetDetail(id);
                    pets.push(pet);
                }
                this.dataList = pets;
                this.loading = false;
            } catch (e) {

            }
        }
    }
};
</script>

<style lang="less" scoped>


</style>

<template>
    <div class="content wrap">
        <div class="list">
            <div class="single" v-for="(item, index) in list" :key="index" @click="deal(item.petId)">
                <div class="address">
                    From：
                    <span @click="$router.push({path: '/person/' + item.from})">{{ item.from }}</span>
                </div>
                <div class="message">{{ item.message }}</div>
                <div class="createTime">
                    <div>此次喂食升了 {{ item.levelCount }} 级</div>
                    <div>{{ item.feedTime | timeFormat }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array
        }
    },
    filters: {
        timeFormat(timeStamp) {
            return new Date(timeStamp * 1000).Format('yyyy-MM-dd HH:mm:ss');
        }
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        deal(petId) {
            if (typeof petId != 'undefined') {
                this.$router.push({ path: 'petDetail?id=' + petId });
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../assets/css/global.less';
@import './style.less';
</style>

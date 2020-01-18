<template>
    <div>
        <div class="pets wrap">
            <el-row :gutter="20" align="middle">
                <el-col :xs="6" :sm="6" :md="6" v-for="(item, index) in data" :key="index">
                    <div class="pet-detail" @click="$router.push({ path: '/petDetail?id=' + item.id })">
                        <div class="img-view" :style="{backgroundImage: 'url(' + petType (item.dna)  + ')'}">
                            <div class="level-view">
                                <div class="level">{{ item.level }}</div>
                                <div class="text">LVL</div>
                            </div>
                            <el-tooltip class="item" effect="dark" content="喂食后宠物可以随机升1到5级,20级以后的宠物喂食后有30%的几率诞生一只新宠物" placement="bottom">
                                <div class="feed-view" @click.stop="feed(item.id)" v-if="item.readyTime * 1000 < new Date().getTime()"><i class="iconfont icon-huluobu"></i></div>
                            </el-tooltip>
                            <div v-if="item.readyTime * 1000 >= new Date().getTime()" class="feed-cooling">
                                <i class="iconfont icon-dengdai"></i>
                                {{ item.countDown }}
                            </div>
                            <el-tooltip class="item" effect="dark" :content="'喂食技能冷却中, ' + item.countDown + '后可以喂食'" placement="bottom">
                                <div class="feed-view feed-view-cooling" v-if="item.readyTime * 1000 >= new Date().getTime()"><i class="iconfont icon-huluobu"></i></div>
                            </el-tooltip>
                            <div class="dna">
                                <i class="iconfont icon-dna"></i>
                                {{ item.dna }}
                            </div>
                        </div>
                        <div class="petName">
                            <div class="text">{{ item.name }}</div>
                            <div class="feedCount">
                                <i class="iconfont icon-huluobu"></i>
                                {{ item.feedCount }}
                            </div>
                        </div>
                        <div class="createTime">{{ item.createTime | timeToString }}出生</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import token from '../../token.js';
export default {
    props: {
        data: {
            type: Array
        }
    },
    data() {
        return {};
    },
    filters: {
        timeToString(timeStamp) {
            return new Date(timeStamp * 1000).Format('yyyy-MM-dd HH:mm');
        }
    },
    mounted() {},
    methods: {
        petType(dna) {
            let type = token.getPetType(dna);
            return require('../../assets/imgs/pet' + type + '.jpg');
        },
        feed(id) {
            this.$prompt('请输入留言', '宠物喂食', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '随便说点什么都行，留言会永久存储在区块链里哟~',
                inputType: 'textarea'
            })
                .then(({ value }) => {
                    this.$showTip();
                    token
                        .feed(parseInt(id), value == null ? '' : value)
                        .then(() => {
                            this.$notify({
                                title: '升级提醒',
                                message: '恭喜！您于' + new Date().Format('yyyy-MM-dd HH:mm:ss') + '喂食的宠物升级啦',
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            this.$notify.error({
                                title: '喂食失败',
                                message: '系统可能小差了，我也不知道发生了什么'
                            });
                        });
                })
                .catch(() => {});
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../assets/css/global.less';
@import './style.less';
</style>

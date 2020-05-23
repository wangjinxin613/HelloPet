<template>
    <div v-loading="loading">
        <div class="pets wrap" v-if="!noThisPet">
            <div class="pet-detail">
                <div class="img-view" :style="{ backgroundImage: 'url(' + petType(item) + ')' }">
                    <div class="level-view">
                        <div class="level">{{ item.level }}</div>
                        <div class="text">{{item.petName}}</div>
                    </div>
                    <el-tooltip class="item" effect="dark" content="喂食后宠物可以随机升1到5级,20级以后的宠物喂食后有30%的几率诞生一只新宠物~" placement="bottom">
                        <div class="feed-view" @click.stop="feed(item.id)" v-if="item.readyTime * 1000 < new Date().getTime()"><i class="iconfont icon-huluobu"></i></div>
                    </el-tooltip>
                    <div v-if="item.readyTime * 1000 >= new Date().getTime()" class="feed-cooling">
                        <i class="iconfont icon-dengdai"></i>
                        {{ countDown }}
                    </div>
                    <el-tooltip class="item" effect="dark" :content="'喂食技能冷却中, ' + item.countDown + '后可以喂食'" placement="bottom">
                        <div class="feed-view feed-view-cooling" v-if="item.readyTime * 1000 >= new Date().getTime()"><i class="iconfont icon-huluobu"></i></div>
                    </el-tooltip>
                    <div class="dna">
                        <i class="iconfont icon-dna"></i>
                        {{ item.dna }}
                    </div>
                </div>
                <div class="right-view">
                    <div class="petName">
                        <div class="text">{{ item.name }}</div>
                    </div>
                    <div class="createTime" style="margin-top: 20px;">DNA：{{ item.dna }}</div>
                    <div class="createTime" style="margin-top: 20px;">宠物种类：{{ item.petName }}</div>
                    <div class="createTime">等级：{{ item.level }} 级</div>
                    <div class="createTime">出生日期：{{ item.createTime | timeToString }}</div>
                    <div class="createTime">喂食次数：{{ item.feedCount }} 次</div>
                    <div class="createTime">
                        主人地址：
                        <router-link :to="'/Person/' + ownerAddress">{{ ownerAddress }}</router-link>
                    </div>
                    <div class="createTime" v-if="item.readyTime * 1000 >= new Date().getTime()">下次可喂食时间：{{ item.readyTime | timeToString }}</div>
                    <div class="btns">
                        <button @click="feed(petId)" v-if="item.readyTime * 1000 < new Date().getTime()">宠物喂食</button>
                        <button @click="$message('喂食技能冷却中,试试喂食其他宠物吧~')" style="background: #999;" v-else>宠物喂食</button>
                        <button class="transfer" v-if="address == ownerAddress" @click="transfer">转赠他人</button>
                    </div>
                </div>
            </div>

            <el-tabs v-model="activeName" style="margin-top: 40px;" type="card" >
                <el-tab-pane label="喂食记录" name="first">
                    <!-- <div class="wrap title" style="margin-top: 30px;">
                        <div>喂食记录</div>
                        <div>喂食总次数：{{ feeds.length }}</div>
                    </div> -->
                    <Feeds :list="feeds"></Feeds>
                    <div class="noMore">没有更多了~</div>
                </el-tab-pane>
                <el-tab-pane label="转移记录" name="second">
                    <!-- <div class="wrap title" style="margin-top: 30px;">
                        <div>转移记录</div>
                        <div>转移总次数：{{ feeds.length }}</div>
                    </div> -->
                    <el-table :data="transferData" style="width: 100%;margin-top: 10px;margin-bottom: 100px;" >
                        <el-table-column prop="person" label="From" width="380">
                            <template slot-scope="scope">
                                <router-link :to="'/person/' + scope.row._from">{{ scope.row._from }}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="To" width="380">
                            <template slot-scope="scope">
                                <router-link :to="'/person/' + scope.row._to">{{ scope.row._to }}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="转移时间">
                            <template slot-scope="scope">
                                {{ scope.row.time | timeToString }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-else><div class="noMore" style="margin-top: 100px;">糟糕，没有找到这个宠物</div></div>
    </div>
</template>

<script>
import token from '../token.js';
import Feeds from '../components/Feeds/Feeds.vue';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            item: {},
            countDown: '',
            feeds: [],
            ownerAddress: '',
            petId: 0,
            interval: 0,
            interval1: 0,
            loading: true,
            noThisPet: false,
            transferData: [],
            activeName: 'first'
        };
    },
    components: {
        Feeds
    },
    computed: {
        ...mapState({
            address: 'address'
        })
    },
    filters: {
        timeToString(timeStamp) {
            return new Date(timeStamp * 1000).Format('yyyy-MM-dd HH:mm');
        }
    },
    async mounted() {
        this.loadData();
        var interval = setInterval(this.loadData, 1000); // 1秒更新一次
        this.interval = interval;
        this.interval1 = setInterval(this.updateCountDown, 1000);
    },
    beforeDestroy() {
        clearInterval(this.interval); // 销毁interval，避免一直执行
        clearInterval(this.interval1); // 销毁interval，避免一直执行
    },
    methods: {
        petType(item) {
            return require('../assets/image/' + item.type + '/' + item.path);
        },
        async loadData() {
            try {
                var id = this.$route.query.id;
                this.petId = id;
                this.ownerAddress = await token.petToOwner(id);
                var result = await token.getPetDetail(id);
                let type = token.getPetType(result.dna);
                Object.assign(result, {
                    path: type.path,
                    type: type.type,
                    petName: type.name
                })
                this.item = result;

                var feeds = await token.getFeeds(id);
                this.feeds = feeds;
                this.updateCountDown();
                var transferData = [];
                var transferDataResult = await token.getTransferData(id);
                for (let i in transferDataResult) {
                    transferData.push(transferDataResult[i].returnValues);
                }
                this.transferData = transferData;
                this.noThisPet = false;
                this.loading = false;
            } catch (e) {
                //TODO handle the exception
                this.noThisPet = true;
                this.loading = false;
            }
        },
        updateCountDown() {
            this.countDown = this.$getStr(this.item.readyTime);
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
        },
        transfer() {
            this.$prompt('请输入想要转赠的地址', '宠物转赠', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '转赠后你就会永久失去我了o(╥﹏╥)o',
                inputPattern: /^(0x)?[0-9a-fA-F]{40}$/,
                inputErrorMessage: '地址的格式不对哦~'
            })
                .then(({ value }) => {
                    this.$showTip();
                    token
                        .transfer(value, this.petId)
                        .then(() => {
                            this.$notify({
                                title: '转赠成功',
                                message: '您的宠物已经成功转赠给他人',
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            this.$notify.error({
                                title: '转赠失败',
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
@import '../assets/css/global.less';
@import '../components/Pets/style.less';

.pet-detail {
    margin: 0 auto;
    height: 260px;
    display: flex;
    justify-content: flex-start;
    padding-left: 120px;
    box-sizing: border-box;

    & .img-view {
        width: 290px;
        height: 264px !important;
    }

    & .right-view {
        margin-left: 50px;
    }
}
.petName .text {
    font-size: 24px !important;
}
.pets .pet-detail .createTime {
    font-size: 14px;

    & a {
        color: @text-color-active;
    }
}
.btns {
    margin-top: 20px;

    button {
        padding: 10px 20px;
        background: @btn-color;
        border: 0;
        color: #fff;
        border-radius: 5px;
        margin-right: 10px;
        outline: none;
        cursor: pointer;

        &.transfer {
            background: @btn-color-active;
        }
    }
}

a {
    color: @text-color-active;
}
</style>

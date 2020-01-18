<template>
    <div>

        <!--  <div class="wrap balance-view">
            <div class="token-view">
                <i class="iconfont icon-chongwu"></i>
            </div>
            <div class="balance">{{balance}} PET</div>
        </div> -->
        <div :class="['capture', userInfo.readyTime * 1000 >= new Date().getTime() ? 'lengque' : '']">
            <div class="tip" v-if="userInfo.readyTime * 1000 >= new Date().getTime()">捕获技能冷却中....</div>
            <div class="tip" v-else>可捕获一只新宠物</div>
            <img src="../assets/imgs/pet1.jpg" alt="" class="img" />
            <div class="mask"></div>
            <div class="captureBtn" @click="captrue" v-if="userInfo.readyTime * 1000 < new Date()"><i class="iconfont icon-zhuaqu"></i></div>
            <div class="captureBtnNO"  v-if="userInfo.readyTime * 1000 >= new Date().getTime()">
                <i class="iconfont icon-dengdai"></i>
                <div>{{dateStr}}</div>
            </div>
        </div>
        <div class="wrap title">
            <div>我的宠物</div>
            <div>总数：{{pets.length}}</div>
        </div>
        <Pets :data="pets"></Pets>

        <div class="noMore">没有更多宠物了~</div>
    </div>
</template>

<script>
import Pets from '../components/Pets/Pets.vue';
import Header from '../components/Header.vue';
import { mapState } from 'vuex';
import token from '../token.js';
import Vue from 'vue';
export default {
    data() {
        return {
            dateStr: ''
        };
    },
    components: {
        Pets,
        Header
    },
    filters: {
        showText(timeStamp) {
            if (timeStamp * 1000 >= new Date().getTime()) {
                return this.dateStr +'后可捕获新宠物';
            } else {
                return '';
            }
        }
    },
    mounted() {
      setInterval(() => {
           if (this.userInfo.readyTime * 1000 >= new Date().getTime()) {
              this.dateStr = new Vue().$getStr(this.userInfo.readyTime);
           }
      }, 100)
    },
    computed: {
        ...mapState({
            balance: 'balance',
            userInfo: 'userInfo',
            pets: 'myPets'
        })
    },
    methods: {
        captrue() {
            this.$prompt('请填写新宠物的名字', '捕获宠物', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '给你的宠物起一个好听的名字吧'
            })
                .then(({ value }) => {
                    this.$showTip();
                    token
                        .capture(value == null ? "" : value)
                        .then(() => {
                            this.$notify({
                                title: '捕获宠物成功',
                                message: '成功于' + new Date().Format('yyyy-MM-dd HH:mm:ss') + '捕获一只新宠物',
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            this.$notify.error({
                                title: '捕获宠物失败',
                                message: '可能这只宠物跑的太快了，并没有捕获成功'
                            });
                        });
                })
                .catch(() => {

                });
        },

    }
};
</script>

<style lang="less" scoped>
@import '../assets/css/global.less';
@import '../assets/css/index.less';
</style>

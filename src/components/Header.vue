<template>
    <div class="content">
        <div class="header  wrap">
            <router-link to="/"><div class="logo">HELLO PET</div></router-link>
            <ul class="left-view menu-view">
                <router-link to="/">
                    <li :class="[path == '/' ? 'active' : '']">
                        我的宠物
                        <div></div>
                    </li>
                </router-link>
                <router-link to="/allpet">
                    <li :class="[path == '/allpet' ? 'active' : '']">
                        世界宠物
                        <div></div>
                    </li>
                </router-link>
                <router-link to="/allfeed">
                    <li :class="[path == '/allfeed' ? 'active' : '']">
                        喂食记录
                        <div></div>
                    </li>
                </router-link>
                <router-link to="/people">
                    <li :class="[path == '/people' ? 'active' : '']">
                        节点地址
                        <div></div>
                    </li>
                </router-link>
                <router-link to="/custom">
                    <li :class="[path == '/custom' ? 'active' : '']">
                        定制宠物
                        <div></div>
                    </li>
                </router-link>
            </ul>

            <div class="right-view" @click="showLayer = true">
                <div class="headImg"><img src="../assets/imgs/headImg.svg" alt="" /></div>
                <div class="account">
                    <div class="nickName">{{ userInfo.name == '' ? '未设置用户名' : userInfo.name }}</div>
                    <div class="address">
                        <div>{{ address | toAddress }}</div>
                        <div class="balance">
                            <img src="../assets/imgs/token.png" />
                            {{ balance }}
                        </div>
                    </div>
                </div>
                <div style="margin-left: 4px;"><i class="iconfont icon-xia" style="font-size: 18px;color: #fff;"></i></div>
            </div>

            <!-- <div class="menu" @click="showLayer == true ? (showLayer = false) : (showLayer = true)"><i class="iconfont icon-caidan"></i></div> -->

            <div class="layer-mask" v-show="showLayer" @click="showLayer = false"></div>
            <!-- 菜单弹起层 -->
            <div class="menu-layer" v-show="showLayer" @click="showLayer = false">
                <div class="single" @click="updateUser">修改用户名</div>
                <router-link to="mysend"><div class="single">我送出的宠物</div></router-link>
                <router-link to="myreceived"><div class="single">我收到的宠物</div></router-link>
                <router-link to="myfeed"><div class="single">我的喂食记录</div></router-link>
                <div class="single" @click="copy">复制我的地址</div>
            </div>
        </div>
    </div>
</template>

<script>
import token from '../token.js';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            showLayer: false,
            activeIndex: 1
        };
    },
    computed: {
        ...mapState({
            address: 'address',
            userInfo: 'userInfo',
            balance: 'balance'
        }),
        path() {
            return this.$route.path;
        }
    },
    filters: {
        toAddress(address) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
        }
    },
    mounted() {},
    methods: {
        updateUser() {
            this.$prompt('请输入想要更改的昵称', '修改用户昵称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '起一个霸气点的名字~'
            })
                .then(({ value }) => {
                    this.$showTip();
                    token
                        .updateUser(value == null ? '' : value)
                        .then(() => {
                            this.$notify({
                                title: '更改用户名成功',
                                message: '恭喜！您于' + new Date().Format('yyyy-MM-dd HH:mm:ss') + '成功更改用户名',
                                type: 'success'
                            });
                        })
                        .catch(() => {
                            this.$notify.error({
                                title: '更改用户名失败',
                                message: '系统可能小差了，我也不知道发生了什么'
                            });
                        });
                })
                .catch(() => {});
        },
        copy() {
            this.$copyText(this.address).then(
                res => {
                    this.$message({
                        message: '复制成功',
                        type: 'success'
                    });
                },
                err => {
                    this.$message({
                        message: '复制失败',
                        type: 'error'
                    });
                }
            );
        },
        copyError(txt) {}
    }
};
</script>

<style lang="less" scoped>
@import '../assets/css/global.less';

.content {
    background: #4b4c6e;
}
.header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    min-width: 800px;
    box-sizing: border-box;

    & .logo {
        font-size: 24px;
        color: #fff;
    }

    & .right-view {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    & .left-view {
        flex: 1;
        margin-left: 40px;

        &.menu-view {
            display: flex;
            align-items: center;

            li {
                list-style-type: none;
                padding: 0 22px;
                color: #fff;
                transition: all 0.5s;
                height: 60px;
                line-height: 60px;
            }

            a {
                color: #fff;
            }

            li:hover {
                .active;
            }

            .active {
                color: #ff64a2;
                position: relative;
                border-radius: 1px;

                div {
                    position: absolute;
                    width: 30px;
                    height: 3px;
                    background: @btn-color-active;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 8px;
                    border-radius: 5px;
                }
            }
        }
    }

    & .headImg {
        width: 40px;
        height: 40px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @btn-color;
        border-radius: 100%;
        margin-right: 10px;

        & img {
            width: 100%;
            height: 100%;
        }
    }

    & .account {
        font-size: 16px;
        color: #fff;

        & .address {
            color: #eee;
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-top: 2px;

            & .balance {
                display: flex;
                align-items: center;
                margin-left: 10px;
                color: #fff;
                font-size: 14px;
            }
            & img {
                width: 18px;
                margin-right: 5px;
            }
        }
    }

    & .menu {
        position: absolute;
        right: @paddingW;
        cursor: pointer;

        & i {
            font-size: 26px;
            color: #fff;
        }
    }
}

.layer-mask {
    background: transparent;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 9999;
    position: fixed;
}

.content {
    position: relative;
}

.menu-layer {
    z-index: 10000;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    width: 200px;
    border-radius: 3px;
    position: absolute;
    right: 0;
    transform: translateX(00%);
    top: 60px;
    box-shadow: rgba(0, 0, 0, 0.15) 0 2px 2px 2px;

    & .single {
        padding: 14px 20px;
        cursor: pointer;

        &:hover {
            background: rgba(0, 0, 0, 0.2);
        }
    }

    a {
        color: #fff;
    }
}
</style>

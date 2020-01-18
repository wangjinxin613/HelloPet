<template>
    <div class="wrap">
        <div class="title" style="margin-top: 30px;">
            <div>选择你想购买的宠物</div>
            <div>共20款宠物</div>
        </div>
        <div class="pets">
            <el-row :gutter="20" align="middle">
                <el-col :xs="6" :sm="6" :md="6" v-for="(item, index) in petNum" :key="index">
                    <div class="single" @click="buy(index + 1)">
                        <img :src="img(index + 1)" alt="" />
                        <div class="price-view">
                            <div class="price">{{ price }}</div>
                            <div class="level">{{ level }}级</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import token from '../token.js';
export default {
    data() {
        return {
            petNum: 20,
            price: '0.001 ETH',
            level: 20
        };
    },
    async mounted() {
        window.onload = async () => {
            let price = await token.getPrice();
            this.price = price / Math.pow(10, 18) + 'ETH';
        }
    },
    methods: {
        img(type) {
            return require('../assets/imgs/pet' + type + '.jpg');
        },
        randomNum(minNum,maxNum){
            switch(arguments.length){
                case 1:
                    return parseInt(Math.random()*minNum+1,10);
                break;
                case 2:
                    return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
                    default:
                        return 0;
                    break;
            }
        },
        buy(type) {
            // 计算这只宠物的dna
            let v1 = this.randomNum(50, 499) * 20 + type - 1;  // 生成前四位数
            let v2 = this.randomNum(1000000000, 9999999999); // 生成10位随机数
            let dna = v1 + '' + v2 + '' + 99;
            this.$prompt('请填写宠物的名字', '购买宠物', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '给你的宠物起一个好听的名字吧'
            })
                .then(({ value }) => {
                    this.$showTip();
                    token
                        .customPet(value == null ? "" : value, Number(dna))
                        .then(() => {
                            this.$notify({
                                title: '定制宠物成功',
                                message: '成功于' + new Date().Format('yyyy-MM-dd HH:mm:ss') + '定制了一只新宠物',
                                type: 'success'
                            });
                        })
                        .catch((e) => {
                            console.log(e);
                            this.$notify.error({
                                title: '定制宠物失败',
                                message: '系统开小差了，不知道出了什么问题'
                            });
                        });
                })
                .catch(() => {

                });
        }
    }
};
</script>

<style lang="less" scoped>
.pets {
    margin-top: 30px;
    display: flex;
    margin-bottom: 30px;

    & .single {
        margin-bottom: 30px;
        cursor: pointer;

        img {
            width: 100%;
            height: 220px;
            border-radius: 10px;
        }

        & .price-view {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            align-items: center;

            & .price {
                color: #ff64a2;
                font-size: 20px;
            }

            & .level {
                color: #acb2bf;
                font-size: 14px;
            }
        }
    }
}
</style>

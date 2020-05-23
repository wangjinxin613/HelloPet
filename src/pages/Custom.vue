<template>
    <div class="wrap">
        <div class="title" style="margin-top: 30px;">
            <div>选择你想购买的宠物</div>
            <div>共{{pets.length}}款宠物</div>
        </div>

        <div class="search">
             <el-select v-model="petType" placeholder="宠物种类" style="width: 200px;" @change="petTypeChange">
                <el-option
                  v-for="item in petTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            <el-input v-model="petName" placeholder="输入您想定制的宠物名称" style="width: 300px;margin-left: 20px;" @input="changPetName"></el-input>
            <el-button type="primary" style="margin-left: 20px;">搜 &nbsp; 索</el-button>
        </div>

        <div class="pets">
            <div class="single" @click="buy(item)" v-for="(item, index) in pets" :key="index">
                <img :src="img(item.type + '/' + item.path)" alt="" />
                <div class="name">
                    {{item.name}}
                </div>
                <div class="price-view">
                    <div class="price">{{ price }}</div>
                    <div class="level">{{ level }}级</div>
                </div>
            </div>
        </div>

        <div class="nodata" v-if="pets == false">
            无结果
        </div>
    </div>
</template>

<script>
import petJson from '../pet.js';
import token from '../token.js';

export default {
    data() {
        return {
            petNum: 20,
            price: '0.001 ETH',
            level: 20,
            pets: [],
            petName: "",
            petTypes: [],
            petType: ''
        };
    },
    async mounted() {
        window.onload = async () => {
            let price = await token.getPrice();
            this.price = price / Math.pow(10, 18) + 'ETH';
        }
        this.pets = Object.assign({}, petJson.pets);
        var petType = [];
        for(let i in petJson.types) {
            petType.push({
                label: petJson.types[i].name,
                value: petJson.types[i].type
            })
        }
        this.petTypes = petType;
    },
    methods: {
        img(type) {
            return require('../assets/image/' + type);
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
        buy(item) {
            // 计算这只宠物的dna
            var index = 0;
            var length = petJson.pets.length;
            for(let i in petJson.pets) {
                if(petJson.pets[i].name == item.name) {
                    index = parseInt(i);
                }
            }
            let v1 = this.randomNum(parseInt(1000 / length) + 1, parseInt(9990 / length) ) * length + index;
            let v2 = this.randomNum(1000000000, 9999999999); // 生成10位随机数
            let dna = v1 + '' + v2 + '' + 99;
            console.log(dna);
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
        },
        petTypeChange(type) {
            var result = [];
            var pets = Object.assign({}, petJson.pets);
            for(let i in pets) {
                if(pets[i].type == type) {
                    result.push(pets[i]);
                }
            }
            this.pets = result;
        },
        changPetName(name) {
            var result = [];
            var pets = Object.assign({}, petJson.pets);
            for(let i in pets) {
                if(pets[i].name.indexOf(name) != -1) {
                    result.push(pets[i]);
                }
            }
            this.pets = result;
        }
    }
};
</script>

<style lang="less" scoped>
.pets {
    margin-top: 30px;
    display: flex;
    margin-bottom: 30px;
    flex-wrap: wrap;

    & .single {
        margin-bottom: 30px;
        cursor: pointer;
        flex: 0 0 25%;
        padding-right: 10px;
        padding-left: 10px;
        box-sizing: border-box;

        img {
            width: 100%;
            height: 220px;
            border-radius: 10px;
        }

        .name{
            font-size: 20px;
            padding-top: 10px;
        }

        & .price-view {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            align-items: center;

            & .price {
                color: #ff64a2;
                font-size: 18px;
            }

            & .level {
                color: #acb2bf;
                font-size: 14px;
            }
        }
    }

}

.search{
    margin-top: 25px;
    padding: 5px 0;
    display: flex;
    justify-content: flex-start;
    padding: 0 10px;
}

.nodata{
    text-align: center;
}
</style>

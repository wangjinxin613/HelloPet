<template>
    <div>
        <div class="wrap title" style="margin-top:30px;">
            <div>所有节点地址</div>
            <div>地址总数：{{ dataList.length }}</div>
        </div>
        <div class="wrap">
            <el-table :data="dataList" style="width: 100%;margin-top: 30px;" v-loading="loading">
                <el-table-column prop="person" label="地址" width="500">
                    <template slot-scope="scope">
                        <router-link :to="'/person/' + scope.row.person">{{ scope.row.person }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="用户昵称"></el-table-column>
                <el-table-column prop="balance" label="拥有宠物数量"></el-table-column>
                <el-table-column prop="time" label="接入时间">
                    <template slot-scope="scope">
                        {{ scope.row.time | timeFormat }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import token from '../token.js';
export default {
    data() {
        return {
            dataList: [],
            loading: true
        };
    },
    mounted() {
        this.loadData();
    },
    filters: {
        timeFormat(timeStamp) {
            return new Date(timeStamp * 1000).Format('yyyy-MM-dd HH:mm:ss');
        }
    },
    methods: {
        async loadData() {
            var result = await token.getAllPerson();
            var dataList = [];
            for (let i in result) {
                let person = result[i].returnValues;
                let info = await token.getUserInfoByAddress(person.person);
                person.name = info.name;
                let balance = await token.getBalanceByAddress(person.person)
                person.balance = balance;
                dataList.push(person);
            }
            this.dataList = dataList;
            this.loading = false;
        }
    }
};
</script>

<style lang="less" scoped>
@import '../assets/css/global.less';
a {
    color: @text-color-active;
}
</style>

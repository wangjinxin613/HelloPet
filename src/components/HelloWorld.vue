<template>
    <div class="hello">
        <button @click="login">登录</button>
        {{ address }}
        <button @click="setNickName">设置用户名</button>
        <p>用户名：{{ userInfo.name }}</p>
        <p>余额：{{ balance }}</p>
        <button @click="capture">捕获一只宠物</button>
        <button @click="feed">喂食宠物</button>
        {{myPets}}
    </div>
</template>

<script>
import token from '../token.js';
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'HelloWorld',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        };
    },
    computed: {
        ...mapState({
            address: 'address',
            userInfo: 'userInfo',
            balance: 'balance',
            myPets: 'myPets'
        })
    },
    mounted() {

    },
    methods: {
        login() {
            token.login();
        },
        setNickName() {
            token.setNickName('小王');
        },
        capture() {
            token.capture('小懒猫');
        },
        feed() {

        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    address: "",
    userInfo: {
        name: "",
        readyTime: (new Date().getTime() / 1000) + 3600 * 24
    },
    balance: 0,
    myPets: []
}

const mutations = {
    updateAddress(state, value) {
        return (state.address = value);
    },
    updateUserInfo(state, value) {
        return (state.userInfo = value);
    },
    updateBalance(state, value) {
        return (state.balance = value);
    },
    updateMyPets(state, value) {
        return (state.myPets = value);
    }
}

export default new Vuex.Store({
    state,
    mutations
})

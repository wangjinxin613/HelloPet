// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store' // 引入store
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.less';
import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)
Vue.config.productionTip = false

Vue.use(ElementUI);


Date.prototype.Format = function(fmt) {
    if (this.getTime() == 0) {
        return '';
    }
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
            "00" + o[
                k]).substr(("" + o[k]).length)));
    return fmt;
}

// get Week
Vue.prototype.$getStr = function(dateStr) {
    var publishTime = dateStr;
    var timeNow = parseInt(new Date().getTime() / 1000);

    var d =  publishTime - timeNow;
    var d_days = parseInt(d / 86400);
    var d_hours = parseInt((d - 8600 * d_days)/ 3600);
    var d_minutes = parseInt((d - 8600 * d_days - 3600 * d_hours ) / 60);
    var d_seconds = parseInt((d - 8600 * d_days - 3600 * d_hours - d_minutes * 60));
    if(d_hours <= 9) d_hours = '0' + d_hours;
    if(d_minutes <= 9) d_minutes = '0' + d_minutes;
    if(d_seconds <= 9) d_seconds = '0' + d_seconds;
    return d_hours + ':' + d_minutes + ':' + d_seconds;
}

Vue.prototype.$showTip = function() {
    new Vue().$message('交易执行可能需要一段时间，交易执行过程中请勿再进行相同的操作，避免财产损失');
}

/* eslint-disable no-new */
let vum = new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})


export default vum;
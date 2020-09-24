import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import moment from 'moment'

import './assets/css/golbal.css'
import './assets/font/iconfont.css'

//引入编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8510/'
    //通过axios请求拦截器添加token，
    //为每一个发起请求添加一个字段验证
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = "Bearer " +
        window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    NProgress.done()

    return config
})

Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', (dateStr, pattern = 'YYYY-MM-DD') => {
    return moment(dateStr).format(pattern)
})

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
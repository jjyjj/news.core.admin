import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'

import User from '../components/user/User'


import Articles from '../components/articles/Articles'
import Categories from '../components/articles/Categories'

import UsersReport from '../components/report/UsersReport'

import Imgs from '../components/imgs/img'
import Comments from '../components/comments/comments'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: User },

            { path: '/articles', component: Articles },
            { path: '/categories', component: Categories },

            { path: '/usersReport', component: UsersReport },

            { path: '/imgs', component: Imgs },
            { path: '/comments', component: Comments },

        ]
    }
]

const router = new VueRouter({
        routes
    })
    //挂在路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
        //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()


})

export default router
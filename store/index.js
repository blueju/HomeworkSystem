import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// window.fetch() 的 Polyfill
// require('whatwg-fetch')

const store = () => new Vuex.Store({

  /** 存储数据，类似于data里的数据，只不过这是全局 */
  state: {
    userId: null,
    userName: null,
    type: null,
    userClass: null
  },

  /** 改变数据的方法（同步），类似于methods里的方法 */
  mutations: {
    /** 设置用户 */
    SET_USER: function (state, data) {
      state.userId = data.userId
      state.userName = data.userName
      state.type = data.type
      state.userClass = data.userClass
      state.email = data.email
      state.phone = data.phone
      sessionStorage.setItem('userInfo', JSON.stringify(data))
    },
    /** 从Vuex中删除用户信息 */
    DELETE_USER: function (state) {
      state.userId = null
      state.userName = null
      state.type = null
      state.userClass = null
      sessionStorage.removeItem('userInfo')
    }
  },

  /** 调用改变数据的方法的方法（异步），类似于@click等点击事件 */
  actions: {
    /** 设置用户 */
    setUserInfo({
      commit
    }, data) {
      commit('SET_USER', data)
    },
    /** 删除用户 */
    deleteUserInfo({
      commit
    }) {
      commit('DELETE_USER')
    }
  }

})

export default store

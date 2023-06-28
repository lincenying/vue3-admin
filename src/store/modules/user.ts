import type { ActionContext } from 'vuex'
import { getInfoApi, loginApi, loginOutApi } from '@/api/user'

export interface userState {
    token: string
    info: object
}
function state(): userState {
    return {
        token: '', // 登录token
        info: {}, // 用户信息
    }
}

// getters
const getters = {
    token(state: userState) {
        return state.token
    },
}

// mutations
const mutations = {
    tokenChange(state: userState, token: string) {
        state.token = token
    },
    infoChange(state: userState, info: object) {
        state.info = info
    },
}

// actions
const actions = {
    // login by login.vue
    login({ commit, dispatch }: ActionContext<userState, userState>, params: any) {
        return new Promise((resolve, reject) => {
            loginApi(params)
                .then((res) => {
                    commit('tokenChange', res.data.token)
                    dispatch('getInfo', { token: res.data.token })
                        .then(() => {
                            resolve(res.data.token)
                        })
                }).catch((err) => {
                    reject(err)
                })
        })
    },
    // get user info after user logined
    getInfo({ commit }: ActionContext<userState, userState>, params: any) {
        return new Promise((resolve) => {
            getInfoApi(params)
                .then((res) => {
                    commit('infoChange', res.data.info)
                    resolve(res.data.info)
                })
        })
    },

    // login out the system after user click the loginOut button
    loginOut() {
        loginOutApi()
            .then(() => {

            })
            .catch(() => {

            })
            .finally(() => {
                localStorage.removeItem('tabs')
                localStorage.removeItem('vuex')
                sessionStorage.removeItem('vuex')
                location.reload()
            })
    },
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
}

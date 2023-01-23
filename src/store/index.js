import Vue from "vue"
import Vuex from "vuex"
// カスタムしたaxiosをインポート
import axios from '../baseurl/auth'
import router from '../router'

// Vuexをこのプロジェクト全体で使用する宣言
Vue.use(Vuex)

// vuex.storeインスタンスを生成したものを外で使用できるようにし、main.jsで呼ぶ
export default new Vuex.Store({
    // stateでは全てのファイルで使用できるグローバル変数を定義できる
    // ただし、グローバル変数はどこでも使用できてしまうため、いろんな箇所で値を変更するとバグが生まれやすい
    // そこで値変更の際はmutationsを使う
    state: {
        idToken: null,
        isAuthLoading: false
    },
    // storeから値を取得する時に使用する(gettersを使用しなくてもできるが、使った方がわかりやすい)
    getters: {
        // idTokenはrouterで使用している
        idToken: state => state.idToken,
        // isAuthLoadingはログインページで使用している
        isAuthLoading: state => state.isAuthLoading,
    },
    // stateの値をいじる時は必ずmutationsの中でいじるようにする(値の追跡がしやすい)
    // mutationsで定義した関数は外で使用可能で、外で呼ぶ時は→this.$store.commit(upDateIdtoken, 2) 
    // 補足として、mutationsは同期処理しか書けない(非同期まで書けてしまうとコードが読みにくくなるため)
    // 非同期を使用する場合は、actionsを使用する
    mutations: {
        upDateIdtoken(state, idToken){
            state.idToken = idToken
        },
        upDateIsAuthLoading(state){
            state.isAuthLoading = !state.isAuthLoading
        }
    },
    actions: {
    // thenではなくasync/awaitを使用
    // 参考 https://qiita.com/shisama/items/61cdcc09dc69fd8d3127
    // {commit}はcontextの中で使用したいものだけを記載するやり方(contextと記載するのではなくオブジェクトとしてcommitを記載できる)
    // この関数では、メアド、パスワードからidトークン値を呼び出して、mutationにコミットする
    async login({commit}, authData){
        // firebaseの認証機構を使用している(事前にユーザを登録しておいた)
        try{
        // ロード中画面表示をtrue
          commit("upDateIsAuthLoading")
          // postの第二引数の値は以下公式ドキュメントを参考
          // https://firebase.google.com/docs/reference/rest/auth
        //  TODO: apiを叩くのは別ファイルにする
          const response = await axios.post('/accounts:signInWithPassword?key=AIzaSyDgzqZut4dul-eVpjWdNSCeBntGScPVlnM',
        {
         email: authData.email,
         password: authData.password,
         returnSecureToken: true
        })
        // デバッグ表示
        console.log(response)
        // レスポンスのidトークン値をmutationsにコミットする
        commit("upDateIdtoken", response.data.idToken)
        // ログインに成功したら打刻画面に遷移
        router.push('/stamp')
        alert("ログインに成功しました")
        }
        // リクエスト失敗した際のエラーをキャッチ
        catch(error){
            // デバッグ表示
            console.log(error)
            alert("ログインに失敗しました")
            }
        // ロード中画面表示をfalseに戻す
        commit("upDateIsAuthLoading")
        }
    }
})

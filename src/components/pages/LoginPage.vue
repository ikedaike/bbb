<template>
<div class="login">
  <div v-show="!isAuthLoading">
    <h2>ログイン</h2>
    <label for="email">アカウント</label>
    <input
    id="email"
    type="email"
    v-model="email">
    {{email}}
    <br>
    <label for="password">パスワード</label>
    <input
    id="password"
    type="password"
    v-model="password">
    {{password}}
    <br>
    <!-- なぜかenterが反応しない -->
    <button @click.enter="login">ログイン</button>
  </div>
  <!-- 認証リクエストをしている時のみ表示 -->
  <div v-show="isAuthLoading">
    <p>now loading...</p>
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</div>
</template>

<script>
export default{
  data() {
    return{
      email: "",
      password: "",
    }
  },
/*vuexのstateは基本computedを使用する
  該当する変数の値が変わった時のみ更新すれば良いから*/
  computed: {
    isAuthLoading() { 
      /* this.$storeは、main.jsのnew vueにstoreを定義していることで、どのコンポーネントからも
      storeが利用できるため$でアクセスしている($はvueインスタンスの値を使用する時に使う) */
      return this.$store.getters.isAuthLoading
    }
  },
  methods: {
    isCheckEmptyInputField(){
      if(this.email == "" || this.password == ""){
        return false
      }
      return true
    },
    login(){
      if (this.isCheckEmptyInputField()){
        // storeのactionを呼び出すときはdispatch(非同期処理はactionを使用する)
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        })
      }else{
        /* 入力欄が空の場合はアラートを表示 */
        alert("メールアドレスとパスワードを入力してください")
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

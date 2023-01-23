<template>
  <div id="app">
    <!-- routerのコンポーネント(ここでコンポーネントの中身が表示される) -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // トークンidが付与されているか
    isAuthenticated() {
    return this.$store.getters.idToken !== null
    }
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header-item {
  padding: 10px
}
</style>

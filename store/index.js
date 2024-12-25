const store = new Vuex.Store({
  state: { // 全局变量
    timeDataLimit = 0.5,
  },
  mutations: { // 全局方法
    setSharedData(state, payload) {
      state.sharedData = payload;
    }
  },
  actions: {
    // 定义异步操作
  },
  getters: {
    // 定义获取状态的方法
    getSharedData: state => state.sharedData
  }
});

export default store;
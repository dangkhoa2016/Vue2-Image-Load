(function () {
  const state = {
    imageUrl: '',
  };

  const mutations = {
    SET_IMAGE_URL(state, payload) {
      state.imageUrl = payload;
    },
  };

  const actions = {
    setImageUrl({ commit }, payload) {
      commit("SET_IMAGE_URL", payload);
    },
  };

  const getters = {
    getImageUrl: (state) => state.imageUrl,
  };

  if (!window['store'])
    window['store'] = {};
  window['store']['appStore'] = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };
})();

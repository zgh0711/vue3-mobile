import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'store',
  state: () => ({
    launched: false,
    authed: false,
    identity: {},
  }),
  getters: {
    owner: (state) => {
      return state.identity.owner || {};
    },
    user: (state) => {
      return state.identity.user || {};
    },
    staff: (state) => {
      return state.identity.staff || {};
    },
  },
  actions: {
    updateIdentity(identity) {
      if (identity) {
        this.authed = true;
        for (let k in identity) {
          this.identity[k] = identity[k];
        }
      } else {
        this.authed = false;
        this.identity = {};
      }
    },
    launch(data) {
      if (data) {
        if (data.token) {
          this.setToken(data.token);
        }
        if (data.identity) {
          this.updateIdentity(data.identity);
        }
      }

      this.launched = true;
    },
    logout() {
      this.updateIdentity(null)
    },
    getToken() {
      return localStorage.getItem('token');
    },
    setToken(token) {
      localStorage.setItem('token', token);
    },
    setSignId(id) {
      localStorage.setItem('sign_id', id);
    },
  }
})

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="updateUser">
            <fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control"
                    type="text" 
                    placeholder="URL of profile picture"
                    v-model="curUser.image"
                  >
                </fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="curUser.username"
                  >
                </fieldset>
                <fieldset class="form-group">
                  <textarea 
                    class="form-control form-control-lg" 
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="curUser.bio"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="curUser.email"
                  >
                </fieldset>
                <!-- <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    v-model="curUser.email"
                  >
                </fieldset> -->
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>

          <!-- <hr>
          <button 
            class="btn btn-outline-danger"
            @click="logout"
          >
            Or click here to logout.
          </button> -->
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { updateUser } from '@/api/user'
import { deepClone } from '@/utils/tool'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'settings',
  middleware: 'authenticated',
  data() {
    return {
      curUser: {},
    }
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    user: {
      handler() {
        this.curUser = deepClone(this.user)
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    ...mapMutations(['setUser']),

    async updateUser() {
      const data = {
        user: this.curUser,
      }
      const res = await updateUser(data)
      if (res.status === 200) {
        this.setUser(res.data.user)
        Cookie.set('user', res.data.user)
        this.$router.push({
          name: 'profile',
          params: {
            username: res.data.user.username,
          }
        })
      }
    }
  }
}
</script>
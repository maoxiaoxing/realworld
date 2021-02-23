<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ signMap.get(isLogin) }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLogin">Need an account?</nuxt-link>
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template
              v-for="(messages, field) in errors"
            >
              <li>{{ field }} {{ messages }}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input 
                class="form-control form-control-lg" 
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
              >
            </fieldset>
            <fieldset class="form-group">
              <input 
                class="form-control form-control-lg"
                type="email" 
                placeholder="Email"
                v-model="user.email"
                required
              >
            </fieldset>
            <fieldset class="form-group">
              <input 
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
                minlength="3"
              >
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ signMap.get(isLogin) }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, regist } from '@/api/user'
import { mapMutations } from 'vuex'
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

const signMap = new Map([
  [true, 'Sign in'],
  [false, 'Sign up'],
])

export default {
  name: 'login',
  middleware: 'notAuthenticated',
  data() {
    return {
      signMap,
      user: {
        email: '',
        password: '',
        username: '',
      },
      errors: {},
    }
  },
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    }
  },
  methods: {
    ...mapMutations(['setUser']),

    async onSubmit() {
      try {
        const res = this.isLogin 
        ? await login({
            user: this.user
          })
        : await regist({
            user: this.user
          })
        
        this.setUser(res.data.user)
        Cookie.set('user', res.data.user)

        this.$router.push('/')
      } catch(err) {
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>
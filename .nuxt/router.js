import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1362e2dc = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _25932111 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _e5ed6d12 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _49039837 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _68af7f55 = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _0794091f = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _2fcddb84 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _1362e2dc,
    children: [{
      path: "",
      component: _25932111,
      name: "home"
    }, {
      path: "/login",
      component: _e5ed6d12,
      name: "login"
    }, {
      path: "/register",
      component: _e5ed6d12,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _49039837,
      name: "profile"
    }, {
      path: "/settings",
      component: _68af7f55,
      name: "settings"
    }, {
      path: "/editor",
      component: _0794091f,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _2fcddb84,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}

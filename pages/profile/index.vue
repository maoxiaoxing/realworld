<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button 
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="profile.username === user.username"
              @click="toSettings"
            >
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary action-btn"
              v-else
              @click="toggleFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{followMap.get(profile.following)}} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <!-- <a class="nav-link active" href="">My Articles</a> -->
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_article'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <!-- <a class="nav-link" href="">Favorited Articles</a> -->
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorite'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorite'
                    }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div 
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li 
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                >tag</li>
              </ul>
            </nuxt-link>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { 
  getProfile,
  followUser,
  unfollowUser,
} from '@/api/user'
import {
  getArticles,
  addFavorite,
  deleteFavorite,
} from '@/api/article'
import { mapState } from 'vuex'

const followMap = new Map([
  [true, 'Unfollow'],
  [false, 'Follow'],
])

export default {
  name: 'profile',
  middleware: 'authenticated',
  async asyncData(context) {
    const page = Number.parseInt(context.query.page|| 1)
    const limit = 10
    const tab = context.query.tab || 'my_article'

    const { username } = context.params
    const tabMap = new Map([
      ['my_article', {
        limit,
        offset: (page - 1) * limit,
        author: username,
      }],
      ['favorite', {
        limit,
        offset: (page - 1) * limit,
        favorited: username,
      }],
    ])
    const articleParams = tabMap.get(tab)
    // const { data } = await getProfile(username)
    const [ articleRes, profileData ] = await Promise.all([
      getArticles(articleParams),
      getProfile(username)
    ])
    const { profile } = profileData.data
    const { articles, articlesCount } = articleRes.data
    return {
      profile,
      articles,
      articlesCount,
      tab,
    }
  },
  data() {
    return {
      followMap,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  watchQuery: ['tab'],
  methods: {
    toggleFollow() {
      const type = followMap.get(this.profile.following)
      this[type]()
    },
    async Unfollow() {
      const res = await unfollowUser(this.profile.username)
      this.profile = res.data.profile
    },
    async Follow() {
      const res = await followUser(this.profile.username)
      this.profile = res.data.profile
    },
    toSettings() {
      this.$router.push({
        name: 'settings',
      })
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

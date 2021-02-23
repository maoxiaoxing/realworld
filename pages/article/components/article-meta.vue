<template>
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

    <span v-if="isCurUser">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        @click="editArtile"
      >
        <i class="ion-edit"></i>
        &nbsp;
        Edit Article
      </button>
      &nbsp;&nbsp;
      <el-popconfirm
        title="确定删除此篇文章吗"
        @confirm="delConfirm"
        @cancel="delCancel"
      >
        <button
          class="btn btn-sm btn-outline-primary"
          :class="{
            active: article.favorited
          }"
          slot="reference"
          @click="deleteArticle"
        >
          <i class="ion-trash-a"></i>
          &nbsp;
          Delete Article
        </button>
      </el-popconfirm>
    </span>

    <span v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        :disabled="followDisabled"
        @click="toggleFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following | textMap(followMap)}} {{ article.author.username }} 
        <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        :disabled="favoriteDisabled"
        @click="toggleFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited | textMap(favoriteMap)}}
        <span class="counter">{{ article.favoritesCount }}</span>
      </button>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { 
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle,
} from '@/api/article'
import {
  followUser,
  unfollowUser,
} from '@/api/user'

const followMap = new Map([
  [false, 'Follow'],
  [true, 'Unfollow'],
])

const favoriteMap = new Map([
  [false, 'Favorite Article'],
  [true, 'Unfavorite Article'],
])

export default {
  name: 'ArticleMeta',
  filters: {
    textMap(bool, map) {
      return map.get(bool)
    }
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      delVisible: false,
      followMap,
      favoriteMap,
      followDisabled: false,
      favoriteDisabled: false,
    }
  },
  computed: {
    ...mapState(['user']),
    isCurUser() {
      return this.article && this.article.author.username === this.user.username
    }
  },
  methods: {
    editArtile() {
      this.$router.push({
        name: 'editor',
        params: {
          slug: this.article.slug,
        }
      })
    },

    deleteArticle() {
      this.delVisible = true
    },

    async delConfirm() {
      try {
        const res = await deleteArticle(this.article.slug)
        this.delVisible = false
        this.$router.push({
          name: 'home',
        })
      } catch(err) {
        this.delVisible = false
      }
    },

    delCancel() {
      this.delVisible = false
    },

    async toggleFavorite() {
      this.favoriteDisabled = true

      if (this.article.favorited) {
        await unfavoriteArticle(this.article.slug)
        this.article.favorited = false
        this.article.favoritesCount += -1
      } else {
        await favoriteArticle(this.article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
      this.favoriteDisabled = false
    },

    async toggleFollow() {
      this.followDisabled = true

      if (this.article.author.following) {
        await unfollowUser(this.article.author.username)
        this.article.author.following = false
        // this.article.favoritesCount += -1
      } else {
        await followUser(this.article.author.username)
        this.article.author.following = true
        // this.article.favoritesCount += 1
      }
      this.followDisabled = false
    }
  }
}
</script>

<style>

</style>

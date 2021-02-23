<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <!-- <form @submit.prevent="createArticle">
            <fieldset>
              <fieldset class="form-group">
                  <input 
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Article Title"
                    v-model="articleForm.title"
                  >
              </fieldset>
              <fieldset class="form-group">
                  <input 
                    type="text"
                    class="form-control" 
                    placeholder="What's this article about?"
                    v-model="articleForm.description"
                  >
              </fieldset>
              <fieldset class="form-group">
                  <textarea 
                    class="form-control" 
                    rows="8" 
                    placeholder="Write your article (in markdown)"
                    v-model="articleForm.body"
                  ></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                  <el-select
                    v-model="articleForm.tagList"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择文章标签">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="createArticle">
                  Publish Article
              </button>
            </fieldset>
          </form> -->

          <el-form
            :model="articleForm"
            :rules="rules"
            ref="articleForm"
          >
            <el-form-item prop="title" label="文章标题">
              <el-input 
                v-model="articleForm.title"
              ></el-input>
            </el-form-item>
            <el-form-item prop="description" label="文章描述">
              <el-input 
                v-model="articleForm.description"
              ></el-input>
            </el-form-item>
            <el-form-item prop="body" label="文章内容">
              <el-input 
                v-model="articleForm.body"
              ></el-input>
            </el-form-item>
            <el-form-item prop="tagList" label="文章标签">
              <el-select
                v-model="articleForm.tagList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择文章标签">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publishArticle">
            发布文章
          </button>
          <button class="btn btn-lg pull-xs-right" type="button" @click="cancel">
            取消
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { 
  createArticle,
  updateArticle,
  getArticle,
} from '@/api/article'

export default {
  name: 'editor',
  middleware: 'authenticated',
  data() {
    return {
      articleForm: {
        title: '', // 文章标题
        description: '', // 文章描述
        body: '', // 文章内容
        tagList: [], // 文章tags
      },
      options: [],
      rules: {
        title: [ { required: true, message: '请输入文章标题', trigger: 'change' }, ],
        description: [ { required: true, message: '请输入文章描述', trigger: 'change' }, ],
        body: [ { required: true, message: '请输入文章内容', trigger: 'change' }, ],
        tagList: [ { required: true, message: '请输入文章标签', trigger: 'change' }, ],
      }
    }
  },
  computed: {
    slug() {
      return this.$route.params.slug
    }
  },
  methods: {
    createArticle() {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              article: this.articleForm,
            }
            const res = await createArticle(data)
            if (res.status === 200) {
              this.$message({
                message: '新建成功！',
                type: 'success'
              })
              this.$router.push({
                name: 'article',
                params: {
                  slug: res.data.article.slug,
                }
              })
            }
          } catch(err) {
            this.$message({
              message: err.response.data.errors.message,
              type: 'error'
            })
          }
        }
      })
    },

    updateArticle() {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              article: this.articleForm,
            }
            const res = await updateArticle(this.slug, data)
            if (res.status === 200) {
              this.$message({
                message: '编辑成功！',
                type: 'success'
              })
              this.$router.push({
                name: 'article',
                params: {
                  slug: res.data.article.slug,
                }
              })
            }
          } catch(err) {
            this.$message({
              message: err.response.data.errors.message,
              type: 'error'
            })
          }
        }
      })
    },

    publishArticle() {
      if(this.slug) {
        this.updateArticle()
      } else {
        this.createArticle()
      }
    },

    async getArticle() {
      const me = this
      const { data } = await getArticle(this.slug)
      const { article } = data
      Object.keys(this.articleForm).forEach((key) => {
        me.articleForm[key] = article[key]
      })
    },

    cancel() {
      this.$router.go(-1)
    }
  },
  mounted() {
    if (this.slug) {
      this.getArticle()
    }
  }
}
</script>
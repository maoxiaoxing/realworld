/**
 * 已经登录后重定向当前页面
 */
export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (store.state.user) {
    return redirect('/')
  }
}

import { request } from '@/plugins/request'

export const login = function(data) {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data,
  })
}

export const regist = function(data) {
  return request({
    method: 'POST',
    url: '/api/users',
    data,
  })
}

export const updateUser = function(data) {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  })
}

export const getUser = function() {
  return request({
    method: 'GET',
    url: '/api/user',
  })
}

export const getProfile = function(username) {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}

export const followUser = function(username) {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`,
  })
}

export const unfollowUser = function(username) {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}

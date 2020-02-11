import request from '../utils/request'

export function authUserToken (data) {
  return request({
    url: '/sys/userworklog/authUserToken',
    method: 'get',
    params: data
  })
}

export function queryOneDayUserHealthCount (data) {
  return request({
    url: '/sys/userhealth/queryOneDayUserHealthCount',
    method: 'post',
    data: data
  })
}

export function saveUserHealth (data) {
  return request({
    url: '/sys/userhealth/saveUserHealth',
    method: 'post',
    data: data
  })
}

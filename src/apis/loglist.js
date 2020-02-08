import request from '../utils/request'

export function queryUserWorkLogSum (data) {
  return request({
    url: '/sys/userworklog/queryUserWorkLogSum',
    method: 'post',
    data
  })
}

export function authUserToken (data) {
  return request({
    url: '/sys/userworklog/authUserToken',
    method: 'get',
    params: data
  })
}

export function saveOrUpdateUserWorkLog (data) {
  return request({
    url: '/sys/userworklog/saveOrUpdateUserWorkLog',
    method: 'post',
    data
  })
}

export function queryOneDayWorkLogList (data) {
  return request({
    url: '/sys/userworklog/queryOneDayWorkLogList',
    method: 'post',
    data
  })
}

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

export function getUserWorkLogInitData (data) {
  return request({
    url: '/sys/userworklog/getUserWorkLogInitData',
    method: 'get',
    params: data
  })
}

export function saveOrUpdateUserWorkLogIt (data) {
  return request({
    url: '/sys/userworklog/saveOrUpdateUserWorkLogIt',
    method: 'post',
    data
  })
}

export function queryUserWorkLogItByUuid (data) {
  return request({
    url: '/sys/userworklog/queryUserWorkLogItByUuid',
    method: 'get',
    params: data
  })
}

export function getLastWorkLogIt (data) {
  return request({
    url: '/sys/userworklog/getLastWorkLogIt',
    method: 'get',
    params: data
  })
}

export function getUserWorkLogTemplateList (data) {
  return request({
    url: '/sys/userworklog/getUserWorkLogTemplateList',
    method: 'get',
    params: data
  })
}

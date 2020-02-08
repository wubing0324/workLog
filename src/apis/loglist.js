import request from '../utils/request'

export function queryUserWorkLogSum (data) {
  return request({
    url: '/sys/userworklog/queryUserWorkLogSum?',
    method: 'post',
    data
  })
}

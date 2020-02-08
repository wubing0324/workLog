import request from '../utils/request'

export function queryUserWorkLogSum () {
  return request({
    url: '/sys/userworklog/queryUserWorkLogSum',
    method: 'post'
  })
}

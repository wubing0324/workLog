import request from '../utils/request'

export function queryUserWorkLogSum (data) {
  return request({
    url: '/sys/userworklog/queryUserWorkLogSum',
<<<<<<< HEAD
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
=======
>>>>>>> b43141f87cdec48d33c89e95f7dbaea81a443440
    method: 'post',
    data
  })
}

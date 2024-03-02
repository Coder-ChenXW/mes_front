import request from '@/utils/request'

const logBase = '/base/log'

export default {
  getAllLogs(pageIndex, pageSize) {
    return request({
      url: `${logBase}`,
      method: 'get',
      params: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    })
  },
  queryLogsByUsername(username) {
    return request({
      url: `${logBase}/query/${username}`,
      method: 'get'
    })
  }
}

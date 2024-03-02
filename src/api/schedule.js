import request from '@/utils/request'

const schedule_base = '/base/schedule'

export default {
  createSchedule(data) {
    return request({
      url: `${schedule_base}`,
      method: 'post',
      data
    })
  },
  deleteSchedule(id) {
    return request({
      url: `${schedule_base}/${id}`,
      method: 'delete'
    })
  },
  updateSchedule(id, data) {
    return request({
      url: `${schedule_base}/${id}`,
      method: 'put',
      data
    })
  },
  schedulePage(params) {
    return request({
      url: `${schedule_base}/page`,
      method: 'get',
      params
    })
  },
  getListByOrderId(params) {
    return request({
      url: `${schedule_base}/all`,
      method: 'get',
      params
    })
  }
}

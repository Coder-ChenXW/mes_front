import request from '@/utils/request'

const report_base = '/base/report'

export default {

  employeeReport(employeeId, startTime, endTime) {
    return request({
      url: `${report_base}/employee/${employeeId}?startTime=${startTime}&endTime=${endTime}`,
      method: 'get'
    })
  },
  orderReport(orderId) {
    return request({
      url: `${report_base}/order/${orderId}`,
      method: 'get'
    })
  },
  orderReportBlob(orderId) {
    return request({
      url: `${report_base}/order/${orderId}/excel`,
      method: 'get',
      responseType: 'blob'
    })
  },
  employeeReportBlob(employeeId, startTime, endTime) {
    return request({
      url: `${report_base}/employee/${employeeId}/excel?startTime=${startTime}&endTime=${endTime}`,
      method: 'get',
      responseType: 'blob'
    })
  },
  getOrderReportAll(orderId) {
    return request({
      url: `${report_base}/craftAll`,
      method: 'get'
    })
  },

  exportOrderReport(orderId) {
    return request({
      url: `${report_base}/craft/excel`,
      method: 'get',
      responseType: 'blob'
    })
  }
}

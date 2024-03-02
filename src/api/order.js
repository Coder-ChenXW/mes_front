import request from '@/utils/request'

const order_base = '/base/order'

export default {
  createOrder(data) {
    return request({
      url: `${order_base}`,
      method: 'post',
      data
    })
  },
  finishOrder(id, data) {
    return request({
      url: `${order_base}/${id}:finish`,
      method: 'patch',
      data
    })
  },
  cuttingOrder(id, data) {
    return request({
      url: `${order_base}/${id}:cutting`,
      method: 'patch',
      data
    })
  },
  deleteOrder(id) {
    return request({
      url: `${order_base}/${id}`,
      method: 'delete'
    })
  },
  updateOrder(id, data) {
    return request({
      url: `${order_base}/${id}`,
      method: 'put',
      data
    })
  },
  getCreatedOrders() {
    return request({
      url: `${order_base}/created`,
      method: 'get'
    })
  },
  getCuttingOrders() {
    return request({
      url: `${order_base}/cutting`,
      method: 'get'
    })
  },
  getProcessingOrders() {
    return request({
      url: `${order_base}/processing`,
      method: 'get'
    })
  },
  getWaitProcessQty(orderId, craftId) {
    return request({
      url: `${order_base}/${orderId}/${craftId}/waitProcessQty`,
      method: 'get'
    })
  },
  orderPage(params) {
    return request({
      url: `${order_base}/page`,
      method: 'get',
      params
    })
  }
}

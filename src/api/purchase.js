import request from '@/utils/request'

const purchaseBase = '/base/purchase'

export default {
  getPurchaseRecords(params) {
    return request({
      url: `${purchaseBase}/page`,
      method: 'get',
      params
    })
  },
  createPurchase(data) {
    return request({
      url: `${purchaseBase}`,
      method: 'post',
      data
    })
  },
  updatePurchase(id, data) {
    return request({
      url: `${purchaseBase}/${id}`,
      method: 'put',
      data
    })
  },
  deletePurchase(id) {
    return request({
      url: `${purchaseBase}/${id}`,
      method: 'delete'
    })
  },
  getPurchaseById(id) {
    return request({
      url: `${purchaseBase}/${id}`,
      method: 'get'
    })
  }
}

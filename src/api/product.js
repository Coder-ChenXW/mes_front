import request from '@/utils/request'

const product_base = '/base/product'

export default {
  createProduct(data) {
    return request({
      url: `${product_base}`,
      method: 'post',
      data
    })
  },
  deleteProduct(id) {
    return request({
      url: `${product_base}/${id}`,
      method: 'delete'
    })
  },
  updateProduct(id, data) {
    return request({
      url: `${product_base}/${id}`,
      method: 'put',
      data
    })
  },
  inactiveProduct(id) {
    return request({
      url: `${product_base}/${id}:inactive`,
      method: 'patch'
    })
  },
  activeProduct(id) {
    return request({
      url: `${product_base}/${id}:active`,
      method: 'patch'
    })
  },
  getActivatedProduct() {
    return request({
      url: `${product_base}/activated`,
      method: 'get'
    })
  },
  productPage(params) {
    return request({
      url: `${product_base}/page`,
      method: 'get',
      params
    })
  },
  getInfoById(id) {
    return request({
      url: `${product_base}/${id}`,
      method: 'get'
    })
  }
}

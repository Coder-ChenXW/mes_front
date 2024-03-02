<template>
  <div class="app-container">
    <el-button v-if="hasPerm('product.header.add')" type="primary" style="margin-left: 45px" @click="openAddDialog">创建产品</el-button>
    <el-button style="margin-left: 45px" icon="el-icon-search" @click="searchPane = searchPane!==true">搜索</el-button>
    <el-divider />
    <div v-if="searchPane" style="margin-left: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input v-model="searchForm.productNo" />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="searchForm.productName" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status">
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="clearSearchForm">清空</el-button>
          <el-button type="primary" @click="searchFormCommit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="#" width="45">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.productNo }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status|statusTagFilter ">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTs" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTs }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTs" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('product.content.detail')" type="primary" size="small" @click="handleDetail(scope.row)">明细</el-button>
          <el-button v-if="hasPerm('product.content.update')" type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <div v-if="hasPerm('product.content.delete')" style="display: inline; margin-left: 8px">
            <el-button v-if="scope.row.status===1" type="text" size="small" @click="handleInactive(scope.row)">停用</el-button>
            <el-button v-else type="text" size="small" @click="handleActive(scope.row)">启用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="paginationData.size"
      :pager-count="11"
      layout="prev, pager, next"
      :total="paginationData.totalCount"
      @current-change="handleCurrentPageChange"
    />
    <el-dialog title="创建产品" :visible.sync="addDialog">
      <el-tabs>
        <el-tab-pane label="基本信息">
          <el-form ref="addForm" :model="addForm" :rules="addProductRules">
            <el-form-item prop="productNo" label="产品款号" :label-width="formLabelWidth">
              <el-input v-model="addForm.productNo" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="productName" label="产品名称" :label-width="formLabelWidth">
              <el-input v-model="addForm.productName" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="colorLabels" label="颜色分类" :label-width="formLabelWidth">
              <el-tag
                v-for="tag in addForm.colorLabels"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="saveTagInput"
                v-model="inputValue"
                class="input-new-tag"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="工序管理">

          <el-button type="primary" style="margin-left: 5px" @click="addCraftRowV = addCraftRowV !== true">添加行</el-button>
          <div v-if="addCraftRowV" style="margin-left: 15px; margin-top: 15px">
            <el-form ref="addCraftForm" :model="addCraftForm" :inline="true" :rules="addCraftRules">
              <el-form-item prop="name">
                <el-input v-model="addCraftForm.name" placeholder="请输入工序名称" clearable />
              </el-form-item>
              <el-form-item prop="price">
                <el-input v-model="addCraftForm.price" placeholder="请输入单价" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="warning" style="margin-left: 5px" @click="addCraftRowCancel">取消</el-button>
                <el-button type="primary" style="margin-left: 5px" @click="addCraftRowConfirm">添加</el-button>
              </el-form-item>

            </el-form>
          </div>

          <el-divider />
          <el-table
            :data="addForm.craftList"
            stripe
            style="width: 100%"
          >
            <el-table-column label="序号" width="65">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="单价 (元)">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="removeCraftRow(scope.$index, addForm.craftList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>

      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改产品" :visible.sync="updateDialog">
      <el-tabs>
        <el-tab-pane label="基本信息">
          <el-form ref="updateForm" :model="updateForm" :rules="addProductRules">
            <el-form-item prop="productName" label="款号" :label-width="formLabelWidth">
              <el-input v-model="updateForm.productNo" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="productName" label="名称" :label-width="formLabelWidth">
              <el-input v-model="updateForm.productName" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="colorLabels" label="颜色分类" :label-width="formLabelWidth">
              <el-tag
                v-for="tag in updateForm.colorLabels"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="saveTagInput"
                v-model="inputValue"
                class="input-new-tag"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="工序管理">
          <el-button type="primary" style="margin-left: 5px" @click="addCraftRowV = addCraftRowV !== true">添加行</el-button>
          <div v-if="addCraftRowV" style="margin-left: 15px; margin-top: 15px">
            <el-form ref="addCraftForm" :model="addCraftForm" :inline="true" :rules="addCraftRules">
              <el-form-item prop="name">
                <el-input v-model="addCraftForm.name" placeholder="请输入工序名称" clearable />
              </el-form-item>
              <el-form-item prop="price">
                <el-input v-model="addCraftForm.price" placeholder="请输入单价" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="warning" style="margin-left: 5px" @click="addCraftRowCancel">取消</el-button>
                <el-button type="primary" style="margin-left: 5px" @click="addCraftRowConfirm">添加</el-button>
              </el-form-item>

            </el-form>
          </div>

          <el-divider />
          <el-table
            :data="updateForm.craftList"
            stripe
            style="width: 100%"
          >
            <el-table-column label="序号" width="65">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="单价 (元)">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="removeCraftRow(scope.$index, updateForm.craftList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogCancel">取消</el-button>
        <el-button type="primary" @click="updateDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="产品明细" :visible.sync="viewDialog">
      <el-descriptions class="margin-top" title="基本信息" :column="3">
        <el-descriptions-item label="产品编号">{{ viewDetail.productNo }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ viewDetail.productName }}</el-descriptions-item>
        <el-descriptions-item label="颜色分类">{{ viewDetail.labels | labelsJoiner }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewDetail.status|statusFilter }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewDetail.createByName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewDetail.createTs }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ viewDetail.updateTs }}</el-descriptions-item>
      </el-descriptions>

      <span class="el-descriptions__title" style="color: #303133">加工工序</span>
      <el-table
        :data="viewDetail.crafts"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="price"
          label="单价"
        />

      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import product from '@/api/product'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '停用',
        1: '启用'
      }
      return statusMap[status]
    },
    labelsJoiner(labels) {
      const list = []
      if (labels !== undefined && labels !== null && labels.length !== 0) {
        labels.forEach((label) => {
          list.push(label.description)
        })
        return list.join(',')
      }
      return '空'
    },
    statusTagFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateProductNo = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z\-]{4,23}$/
      if (value === undefined || value.length === 0 || !reg.test(value)) {
        callback(new Error('请输入正确的产品编号'))
      } else {
        callback()
      }
    }
    const validateProductName = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请输入正常的产品名称'))
      } else {
        callback()
      }
    }
    const validateColorLabels = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请添加颜色分类'))
      } else {
        callback()
      }
    }
    const validateCraftName = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请输入工序名称'))
      } else {
        callback()
      }
    }
    const validateCraftPrice = (rule, value, callback) => {
      const reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,4}))$/
      if (value === undefined || value.length === 0 || !reg.test(value)) {
        callback(new Error('请输入工序单价'))
      } else {
        callback()
      }
    }
    return {
      input: '',
      list: null,
      listLoading: true,
      searchPane: false,
      formLabelWidth: '120px',
      inputVisible: false,
      inputValue: '',
      searchForm: { productNo: '', productName: '', status: '' },
      paginationData: { size: 15, totalCount: 0 },

      addDialog: false,
      viewDialog: false,
      updateDialog: false,
      addCraftRowV: false,

      addProductRules: {
        productNo: [{ required: true, trigger: 'blur', validator: validateProductNo }],
        productName: [{ required: true, trigger: 'blur', validator: validateProductName }],
        colorLabels: [{ required: true, trigger: 'blur', validator: validateColorLabels }]
      },
      addCraftRules: {
        name: [{ required: true, trigger: 'blur', validator: validateCraftName }],
        price: [{ required: true, trigger: 'blur', validator: validateCraftPrice }]
      },
      updateForm: {
        id: '',
        productNo: '',
        productName: '',
        colorLabels: [],
        craftList: []
      },
      viewDetail: {
        productNo: '',
        productName: '',
        colorLabels: [],
        status: '',
        create_by: '',
        create_ts: '',
        update_ts: ''
      },
      addForm: {
        productNo: '',
        productName: '',
        colorLabels: [],
        craftList: []
      },
      addCraftForm: {
        name: '',
        price: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    clearSearchForm() {
      this.searchForm = { productNo: '', productName: '' }
      this.searchFormCommit()
    },
    searchFormCommit() {
      const params = {
        pageIndex: 1,
        pageSize: 15,
        productNo: this.searchForm.productNo,
        productName: this.searchForm.productName,
        status: this.searchForm.status
      }
      product.productPage(params).then(response => {
        this.listLoading = true
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },
    handleInactive(row) {
      product.inactiveProduct(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.searchForm = { productNo: '', productName: '' }
          this.fetchData()
        }
      })
    },
    handleActive(row) {
      product.activeProduct(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.searchForm = { productNo: '', productName: '' }
          this.fetchData()
        }
      })
    },
    handleEdit(row) {
      this.updateDialog = true
      this.updateForm = row

      const labels = []
      const crafts = []
      row.labels.forEach(l => {
        labels.push(l.description)
      })

      row.crafts.forEach(c => {
        crafts.push(c)
      })

      this.updateForm.colorLabels = labels
      this.updateForm.craftList = crafts
    },
    handleDetail(row) {
      this.viewDialog = true
      this.viewDetail = row
    },
    openAddDialog() {
      this.addDialog = true
      this.resetAddDialog()
    },
    addDialogCancel() {
      this.addDialog = false
      this.resetAddDialog()
    },
    addDialogConfirm() {
      this.$refs.addForm.validate(valid0 => {
        if (valid0) {
          if (this.addForm.craftList === undefined || this.addForm.craftList === null || this.addForm.craftList.length === 0) {
            return false
          } else {
            const labels = []
            this.addForm.colorLabels.forEach((label) => {
              labels.push({ code: label, description: label })
            })
            const data = {
              'product': {
                'productNo': this.addForm.productNo,
                'productName': this.addForm.productName
              },
              'labels': labels,
              'crafts': this.addForm.craftList
            }
            product.createProduct(data).then(response => {
              const { code } = response
              if (code === 20000) {
                this.resetAddDialog()
                this.addDialog = false
                this.fetchData()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    resetAddDialog() {
      this.addForm = {
        productNo: '',
        productName: '',
        colorLabels: [],
        craftList: []
      }
    },
    resetUpdateDialog() {
      this.updateForm = {
        productNo: '',
        productName: '',
        colorLabels: [],
        craftList: []
      }
    },
    updateDialogCancel() {
      this.updateDialog = false
      this.resetUpdateDialog()
    },
    updateDialogConfirm() {
      this.$refs.updateForm.validate(valid0 => {
        if (valid0) {
          if (this.updateForm.craftList === undefined || this.updateForm.craftList === null || this.updateForm.craftList.length === 0) {
            return false
          } else {
            const labels = []
            this.updateForm.colorLabels.forEach((label) => {
              labels.push({ code: label, description: label })
            })
            const data = {
              'product': {
                'productNo': this.updateForm.productNo,
                'productName': this.updateForm.productName
              },
              'labels': labels,
              'crafts': this.updateForm.craftList
            }
            product.updateProduct(this.updateForm.id, data).then(response => {
              const { code } = response
              if (code === 20000) {
                this.resetUpdateDialog()
                this.updateDialog = false
                this.fetchData()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    fetchData() {
      this.listLoading = true
      const params = {
        pageIndex: 1,
        pageSize: 15
      }
      product.productPage(params).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },

    handleClose(tag) {
      this.addForm.colorLabels.splice(this.addForm.colorLabels.indexOf(tag), 1)
      this.updateForm.colorLabels.splice(this.updateForm.colorLabels.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue && !this.addForm.colorLabels.includes(inputValue)) {
        this.addForm.colorLabels.push(inputValue)
      }
      if (inputValue && !this.updateForm.colorLabels.includes(inputValue)) {
        this.updateForm.colorLabels.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCurrentPageChange(pageIndex) {
      this.listLoading = true
      const params = {
        pageIndex: pageIndex,
        pageSize: 15
      }
      product.productPage(params).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },
    addCraftRowConfirm() {
      this.$refs.addCraftForm.validate(valid => {
        if (valid) {
          this.addForm.craftList.push(this.addCraftForm)
          this.updateForm.craftList.push(this.addCraftForm)
          this.addCraftForm = {
            name: '',
            price: ''
          }
          this.addCraftRowV = false
        }
      })
    },
    addCraftRowCancel() {
      this.addCraftRowV = false
    },
    removeCraftRow(index, data) {
      data.splice(index, 1)
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

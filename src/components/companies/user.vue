<template>
  <div class="compaines" >
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item class="two">用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="queryForm" class="clearfix demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_user_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="用户名" class="userName">
        <el-input size="mini" v-model="queryForm.loginName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="状态" class="state">
        <el-select v-model="queryForm.queryState" placeholder="请选择" size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" class="role">
        <el-input size="mini" v-model="queryForm.roleName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" class="top-button"  @click="addClick" v-if="coList.indexOf('permission_user_add')>-1"><img src="../../assets/images/role-icon.png"  class="fl"><span class="btn-text fr">新增用户</span></el-button>
     <el-table
      :data="tableData"
      :height= 'tableHeight'
      style="width: 100%">
      <el-table-column
        prop="loginName"
        label="用户名"
        align="center"
        width="140">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="真实姓名"
        width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.roleList.length > 0 && scope.row.roleList[0].roleName === 'super_admin'">---</span>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="130"
        align="center"
        label="角色">
          <template slot-scope="scope">
            <div class="elli" :title="scope.row.newRoleList">{{ scope.row.newRoleList}}</div>
          </template>
      </el-table-column>
      <el-table-column
        label="电话/电子邮箱"
        align="center"
        width="130">
        <template slot-scope="scope">
          <div class="elli" :title="[scope.row.phone+'/'+scope.row.email]">{{scope.row.phone}}/{{scope.row.email}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.enable == 1" style="color:red;">开启</span>
          <span v-else-if="scope.row.enable == 0">关闭</span>
          <span v-else-if="scope.row.enable == 2">锁定</span>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        align="center"
        label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
        width="160"
        align="center"
        label="创建最后登录时间">
          <template slot-scope="scope">
            <span v-if="scope.row.lastLoginDate !== undefined">{{ scope.row.lastLoginDate | time}}</span>
            <span v-else></span>
          </template>
      </el-table-column>
      <el-table-column
       align="center"
       width="250"
        label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.roleList.length > 0 && scope.row.roleList[0].roleName === 'super_admin'">---</span>
            <span v-else>
              <el-button class="operation" v-if="coList.indexOf('permission_user_edit')>-1" plain @click="editAdmin(scope.row)">编辑</el-button>
              <el-button class="operation last" v-if="coList.indexOf('permission_user_auth')>-1" plain @click="warrant(scope.row)">授权管理</el-button>
              <el-button class="operation last" v-if="coList.indexOf('permission_user_reset')>-1" plain @click="resetPsd(scope.row)">重置密码</el-button>
            </span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      id="add"
      title="新建用户"
      :visible.sync="addDalogVisible"
      :before-close="addHandleClose"
      :close-on-click-modal=false>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="loginName">
          <el-input  :disabled="disabled" v-model="addForm.loginName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input  v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleList">
          <el-select v-model="addForm.roleList" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in addOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户"
      :visible.sync="editDalogVisible"
      :before-close="editHandleClose"
      :close-on-click-modal=false>
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="loginName">
          <el-input  :disabled="true" v-model="editForm.loginName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="editPassword">
          <el-input :disabled="true" v-model="editForm.editPassword"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input  v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleList">
          <el-select v-model="editForm.roleList" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in addOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="enable" class="dRadio">
          <el-radio v-model="editForm.enable" :label="1">开启</el-radio>
          <el-radio v-model="editForm.enable" :label="0">关闭</el-radio>
          <el-radio v-model="editForm.enable" :label="2">锁定</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户可查看公司"
      :visible.sync="wrtDialogVisible"
      :before-close="wrtHandleClose"
      :close-on-click-modal=false>
      <h2 class="dDransferHeader">请选择【{{loginName}}】拥有查看权限的公司</h2>
        <el-transfer
          ref="transfer"
          filterable
          :filter-method="filterMethod"
          v-model="value2"
          :titles="['平台公司', '可查看公司']"
          @left-check-change="leftHhandleChange"
          @right-check-change="rightHandleChange"
          :data="data2">
        </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wrtCancel">取 消</el-button>
        <el-button type="primary" @click="stateTrue">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置用户密码"
      :before-close="retHandleClose"
      :close-on-click-modal=false
      :visible.sync="resetDialogVisible">
      <el-form :model="retForm" :rules="rules" ref="retForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="retForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password"  v-model="retForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="retCancel('retForm')">取 消</el-button>
        <el-button type="primary" @click="reset('retForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.retForm.checkPass !== '') {
          this.$refs.retForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.retForm.pass) {
        callback(new Error('亲，两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      leftList: [],
      rightList: [],
      tableHeight: '',
      data2: [],
      value2: [],
      query: '',
      filterMethod(query, item) {
        this.query = query
        return item.cities.indexOf(query) > -1
      },
      tableData: [],
      addDalogVisible: false,
      resetDialogVisible: false,
      wrtDialogVisible: false,
      editDalogVisible: false,
      disabled: false,
      addForm: {
        loginName: '',
        name: '',
        password: '',
        phone: '',
        email: '',
        roleList: [],
        enable: 1
      },
      editForm: {
        loginName: '',
        name: '',
        editPassword: '',
        phone: '',
        email: '',
        roleList: [],
        enable: 0,
        employeeId: ''
      },
      retForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]*$/,
            message:
              '仅限中英文字符及英文下划线”_”、中划线”-“。最长50个中文字符',
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字。6-16位，至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'blur'
          }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      companyName: '',
      pageIndex: 1,
      pageSize: 10,
      total: 1,
      loginName: '',
      coList: [],
      options: [
        {
          value: '-99',
          label: '全部'
        },
        {
          value: '1',
          label: '开启'
        },
        {
          value: '2',
          label: '锁定'
        },
        {
          value: '0',
          label: '关闭'
        }
      ],
      addOptions: [],
      companyId: '',
      roleId: '',
      enable: '',
      employeeId: '',
      retLoginName: '',
      queryForm: {
        loginName: '',
        queryState: '-99',
        roleName: ''
      },
      userQuery: ''
    }
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1
      this.getList()
    },
    resetForm(formName) {
      this.queryForm.loginName = ''
      this.queryForm.roleName = ''
      this.queryForm.queryState = '-99'
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getList()
    },
    async getList() {
      this.coList = JSON.parse(localStorage.getItem('points'))
      this.companyId = localStorage.getItem('companyId')
      this.userQuery = localStorage
        .getItem('points')
        .includes('permission_user_query')
      let getUrl
      if (
        this.queryForm.loginName.length === 0 &&
        this.queryForm.roleName.length === 0 &&
        this.queryForm.queryState.length !== 0
      ) {
        getUrl = `/employee/${this.companyId}/{loginName}/${
          this.queryForm.queryState
        }/{role}/${this.pageIndex}/${this.pageSize}`
      } else if (
        this.queryForm.loginName.length === 0 &&
        this.queryForm.roleName.length !== 0 &&
        this.queryForm.queryState.length !== 0
      ) {
        getUrl = `/employee/${this.companyId}/{loginName}/${
          this.queryForm.queryState
        }/${this.queryForm.roleName}/${this.pageIndex}/${this.pageSize}`
      } else if (
        this.queryForm.loginName.length !== 0 &&
        this.queryForm.roleName.length === 0 &&
        this.queryForm.queryState.length !== 0
      ) {
        getUrl = `/employee/${this.companyId}/${this.queryForm.loginName}/${
          this.queryForm.queryState
        }/{role}/${this.pageIndex}/${this.pageSize}`
      } else {
        getUrl = `/employee/${this.companyId}/${this.queryForm.loginName}/${
          this.queryForm.queryState
        }/${this.queryForm.roleName}/${this.pageIndex}/${this.pageSize}`
      }
      let res = await this.axios.get(getUrl)
      let {
        code,
        data: { list, total }
      } = res.data.content
      if (code === 0) {
        this.total = total
        list.forEach(function(item) {
          let roleList = item.roleList
          if (roleList.length === 0) return '暂无数据'
          let newData = roleList.map(function(sub) {
            return sub.roleName
          })
          return (item.newRoleList = newData.join(','))
        })
        this.tableData = list
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
      if (code === -3005) {
        this.$message.error(`执行权限异常`)
      }
    },
    add(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.post(`/employee`, this.addForm)
          let { code } = res.data.content
          if (code === +-3012) {
            this.$message.error(`用户名已存在`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.$message.success(`新增用户成功`)
            this.getList()
            this.addDalogVisible = false
            this.disabled = false
            this.$refs[formName].resetFields()
          }
        } else {
          return false
        }
      })
    },
    async send() {
      let res = await this.axios.put(
        `/employee/company/${this.employeeId}`,
        this.value2
      )
      let { code } = res.data.content
      if (code === 0) {
        this.getList()
        this.wrtDialogVisible = false
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    async stateTrue() {
      if (this.value2.length === 0) {
        this.$confirm('尚未设置该用户可查看的公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.send()
            this.$message.success(`设置成功`)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.send()
        this.$message.success(`授权成功`)
      }
    },
    editAdmin(row) {
      this.editDalogVisible = true
      this.render()
      let { loginName, name, phone, email, enable, roleList, employeeId } = row
      this.editForm.loginName = loginName
      this.editForm.name = name
      this.editForm.phone = phone
      this.editForm.email = email
      this.editForm.enable = enable
      this.editForm.password = '.....'
      this.editForm.employeeId = employeeId
      this.editForm.roleList = roleList.map(item => {
        return item.roleId
      })
    },
    editCancel(formName) {
      this.editDalogVisible = false
      this.$refs[formName].resetFields()
    },
    addCancel(formName) {
      this.addDalogVisible = false
      this.disabled = false
      this.$refs[formName].resetFields()
    },
    edit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let newForm = {
            email: this.editForm.email,
            name: this.editForm.name,
            phone: this.editForm.phone,
            roleList: this.editForm.roleList,
            enable: this.editForm.enable
          }
          let res = await this.axios.put(
            `/employee/${this.editForm.employeeId}`,
            newForm
          )
          let { code } = res.data.content
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.$message.success(`编辑用户成功`)
            this.getList()
            this.editDalogVisible = false
          }
        } else {
          return false
        }
      })
    },
    async render() {
      let res = await this.axios.get(
        `/role/${localStorage.getItem('companyId')}/{roleName}/2/1/100`
      )
      let { list } = res.data.content.data
      this.addOptions = list.map(function(item, index) {
        return { value: item.roleId, label: item.roleName }
      })
      let index = ''
      this.addOptions.forEach((item, i) => {
        if (item.label === 'super_admin') {
          index += i
        }
      })
      this.addOptions.splice(index, 1)
    },
    addClick() {
      this.addDalogVisible = true
      this.render()
    },
    async warrant(row) {
      this.loginName = row.loginName
      this.employeeId = row.employeeId
      this.wrtDialogVisible = true
      let res1 = await this.axios.get(`/company/{companyName}/1/100`)
      let platformList = res1.data.content.data.list
      let newPlatForm = platformList.map((item, index) => {
        return {
          label: item.companyName + '(' + item.companyCode + ')',
          key: item.companyId,
          cities: item.companyName + '(' + item.companyCode + ')'
        }
      })
      this.data2 = newPlatForm
      let res2 = await this.axios.get(`/employee/company/${row.employeeId}`)
      let { code, data } = res2.data.content
      if (code === 0) {
        this.value2 = data.map(item => {
          return item.companyId
        })
      }
      if (code === -9999) {
        this.$message.error('Exception Message')
      }
    },
    resetPsd(row) {
      this.resetDialogVisible = true
      this.retLoginName = row.loginName
    },
    retCancel(formName) {
      this.resetDialogVisible = false
      this.$refs[formName].resetFields()
    },
    reset(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`/employee/password/adminReset`, {
            password: this.retForm.checkPass,
            loginName: this.retLoginName
          })
          let { code } = res.data.content
          if (code === +0) {
            this.$message.success('密码已修改')
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +-3014) {
            this.$message.error(`用户无法重置自身账号密码`)
          }
          if (code === +-3007) {
            this.$message.error(`重置密码与原密码一样`)
          }
          this.resetDialogVisible = false
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    addHandleClose(done) {
      done()
      this.$refs.addForm.resetFields()
    },
    editHandleClose(done) {
      done()
      this.$refs.editForm.resetFields()
    },
    wrtHandleClose(done) {
      done()
      this.leftList.splice(0, this.leftList.length)
      this.rightList.splice(0, this.rightList.length)
      this.$refs.transfer.$children[0].query = ''
      this.$refs.transfer.$children[3].query = ''
    },
    retHandleClose(done) {
      done()
      this.$refs.retForm.resetFields()
    },
    wrtCancel() {
      this.wrtDialogVisible = false
      this.leftList.splice(0, this.leftList.length)
      this.rightList.splice(0, this.rightList.length)
      this.$refs.transfer.$children[0].query = ''
      this.$refs.transfer.$children[3].query = ''
    },
    leftHhandleChange(value) {
      this.leftList = value
    },
    rightHandleChange(value) {
      this.rightList = value
    },
    flexTableHeight() {
      this.tableHeight =
        document.documentElement.clientHeight -
        (this.$refs.ruleForm.$el.offsetHeight + 245)
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 420
    }
  },
  created() {
    this.getList()
    if (this.userQuery) {
      this.$nextTick(() => {
        this.flexTableHeight()
      })
      this.fixedTableHeight()
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.fixedTableHeight()
      })()
    }
  },
  beforeDestroy() {
    window.onresize = () => {
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-breadcrumb__item {
  height: 58px;
  line-height: 58px;
  /deep/ .el-breadcrumb__inner {
    font-size: 16px;
  }
  &.first {
    /deep/ .el-breadcrumb__inner,
    /deep/ .el-breadcrumb__separator {
      color: #3e3f42;
      font-weight: 700;
    }
  }
  &.two {
    /deep/ .el-breadcrumb__inner {
      color: #9ea0a5;
    }
  }
}
.demo-form-inline {
  border: 1px solid #ebeef5;
  min-height: 60px;
  .el-form-item {
    margin-bottom: 0;
    height: 64px;
    line-height: 64px;
    padding-left: 30px;
    /deep/ .el-form-item__label {
      padding-right: 20px;
      font-size: 16px;
    }
    /deep/ .el-form-item__content {
      height: 64px;
      line-height: 64px;
      width: 150px;
      margin-right: 20px;
      .filter-ipt .el-input__inner {
        height: 36px;
        width: 150px;
      }
      .el-button {
        height: 36px;
        width: 105px;
        letter-spacing: 20px;
        text-indent: 15px;
        font-size: 14px;
      }
      .el-button--default span {
        color: #606266;
      }
      .el-button--primary {
        background-color: #1989fa;
      }
    }
  }
  .el-form-item.userName {
    margin-right: 0px;
  }
  .el-form-item.state {
    padding-left: 0px;
    margin-right: 27px;
    /deep/ .el-form-item__content {
      margin-right: 0px;
      .el-select .el-input .el-input__inner {
        height: 36px;
      }
    }
  }
  .el-form-item.role {
    padding-left: 0px;
  }
  .el-form-item.fr {
    padding-left: 0px;
    /deep/ .el-form-item__content {
      width: 225px;
    }
  }
  .filter {
    font-size: 16px;
    font-weight: bold;
    height: 41px;
    line-height: 41px;
    padding-left: 58px;
    position: relative;
    border-bottom: 1px solid #ebeef5;
    &::before {
      content: '';
      height: 16px;
      width: 16px;
      background: url(../../assets/images/icon_筛选.png) no-repeat center center;
      position: absolute;
      top: 13px;
      left: 30px;
    }
  }
}
.el-table {
  border: 1px solid #999;
}
.el-pagination {
  float: right;
  margin-top: 10px;
}
// .el-input {
//   /deep/ .el-input__inner {
//     width: 70%;
//   }
// }
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
  }
}
.el-table {
  border: 1px solid #ebeef5;
  /deep/ .cell .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 10em;
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .el-table__row {
    height: 25px;
    line-height: 25px;
  }
  /deep/ .cell {
    height: 23px;
    line-height: 23px;
  }
}

.top-button {
  width: 140px;
}
</style>

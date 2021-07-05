<template>
  <div class="modal">
    <div class="modal-dialog">
      <template v-if= true>
        <div class="modal-content">
          <header class="container">
            <div class="container">
                <div class="col-75">
                  <label>ID Khuôn Mặt </label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.id
                  />
                </div>

              <div class="col-75">
                  <label>Tên Khuôn Mặt </label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.ten
                  />
                </div>
                <div class="col-75">
                  <label>Lớp Học </label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.lop
                  />
                </div>

              <div class="col-75">
                <label>Giới Tính</label>
                <select class="create" v-model="Type">
                  <option disabled value="">Giới Tính</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>

              <div class="col-75">
                  <label>Khoa</label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.khoa
                  />
                </div>
              <div class="col-75">
                  <label>Ngày Sinh </label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.ngaysinh
                  />
                </div>
              <div class="col-75">
                  <label>Ngày Nhập Học </label
                  ><input
                    type="text"
                    class="create"
                    v-model= datatrunggian.ngaynhaphoc
                  />
                </div>
              </div>
          </header>
          <footer class="container1">
            <a href="javascript:;" v-on:click="editInforFaces" class="closebtn" id="cancel"
              >Xác Nhận</a
            >
            &nbsp; &nbsp;
            <a href="javascript:;" v-on:click="cancelCreteTem" class="closebtn" id="cancel"
              >Trở Lại</a
            >
            &nbsp; &nbsp;

          </footer>

        </div>
      </template>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:3000/'
})
// alert(e.id+e.Temlate+e.Type+e.Company+e.VersionDate+e.ExpirationDate+e.Active)
export default {
  name: 'ds',
  props: {
    datatrunggian: Object
  },
  data () {
    return {
      confirmBoolean: '',
      confirmCan: false,
      confirmCamcell: {Temlate: '', Type: '', Company: '', VersionDate: '', ExpirationDate: '', Active: ''},
      mess: '',
      Temlate: '',
      Type: '',
      Company: '',
      VersionDate: '',
      ExpirationDate: '',
      Active: '',
      loginType: '',
      msg: ''
    }
  },
  computed: {
  },
  methods: {
    createTem (e) {
      if (this.Temlate === '' || this.Type === '' || this.Company === '' || this.VersionDate === '' || this.ExpirationDate === '' || this.Active === '') {
        this.mess = 'Trường chưa được nhập'
      } else {
        this.mess = ''
        var form = {
          idfrom: '',
          Temlate: this.Temlate,
          Type: this.Type,
          Company: this.Company,
          VersionDate: this.VersionDate,
          ExpirationDate: this.ExpirationDate,
          Active: this.Active,
          node1: 'Remove',
          node2: 'Edit',
          return_confirmBoolean: ''
        }

        this.$emit('createTem', form)
        this.Temlate = ''
        this.Type = ''
        this.Company = ''
        this.VersionDate = ''
        this.ExpirationDate = ''
        this.Active = ''
      }
    },
    cancelCreteTem (e) {
        this.$emit('confirmCancel', true)

    },
    confirmCancel (e) {
      this.mess = ''
      this.confirmCan = false
      this.$emit('confirmCancel', true)
    },
    cancelCancel (e) {
      this.confirmCan = false
    },
    editInforFaces (e) {
      let tam= document.getElementsByClassName('create')
      var gioitinh= false;
          if (tam[3].value === "Nam") {
            gioitinh = true
          }
          else {
            gioitinh = false
          }
      if(this.datatrunggian.check === true){
        api.get('http://localhost:3000/tasks', {
            id: tam[0].value,
            ten:  tam[1].value,
            lop:  tam[2].value,
            gioitinh:  gioitinh,
            khoa:  tam[4].value,
            ngaysinh: tam[5].value,
            ngaynhaphoc: tam[6].value,
          })
          .then(response => {})
          .catch(e => {
            this.errors.push(e)
          })
          this.datatrunggian.check = false
      }
      else {
        var c = this.datatrunggian._id
        api.post('/tasks/update/' + c, {
            id: tam[0].value,
            ten:  tam[1].value,
            lop:  tam[2].value,
            gioitinh:  gioitinh,
            khoa:  tam[4].value,
            ngaysinh: tam[5].value,
            ngaynhaphoc: tam[6].value,
          })          

          
          var data= {
            e: this.datatrunggian.e,
            checkUpdate: true,
            id: tam[0].value,
            ten:  tam[1].value,
            lop:  tam[2].value,
            gioitinh:  gioitinh,
            khoa:  tam[4].value,
            ngaysinh: tam[5].value,
            ngaynhaphoc: tam[6].value,
          }
        this.$emit('confirmCancel', data)
        }
    },
    cancelRemove (e) {
      let t = false
      this.$emit('cancelRemove', t)
    },
    convertDate: function (date, tt, type) {
      let ngay
      let thang
      let nam
      if (type === 'dd_mm_yyyy') {
        ngay = date.slice(0, 2)
        thang = date.slice(3, 5)
        nam = date.slice(6, 10)
        return nam + tt + thang + tt + ngay
      }
      if (type === 'yyyy_mm_dd') {
        nam = date.slice(0, 4)
        thang = date.slice(5, 7)
        ngay = date.slice(8, 10)
        return ngay + tt + thang + tt + nam
      }
    }
  }
}
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
}
.overlay {
  background-color: 1px solid red;
}

.dielog:target {
  visibility: visible;
  opacity: 1;
}

.dialog-body {
  max-width: 400px;
  position: relative;
  padding: 15px;
  background-color: #d0cfcf;
}

@-webkit-keyframes example {
  from {
    top: -100px;
    opacity: 0;
  }
  to {
    top: 0px;
    opacity: 1;
  }
}

/* Add animation (Standard syntax) */
@keyframes example {
  from {
    top: -100px;
    opacity: 0;
  }
  to {
    top: 0px;
    opacity: 1;
  }
}

/* The modal's background */
.modal {
  z-index: 15;
  position: fixed;
  left: 0;
  top: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Display the modal when targeted */
.modal:target {
  display: table;
  position: absolute;
}

/* The modal box */
.modal-dialog {
  vertical-align: middle;
}

/* The modal's content */
.modal-dialog .modal-content {
  margin: auto;
  background-color: #f3f3f3;
  position: relative;
  padding: 0;
  outline: 0;
  border: 1px #777 solid;
  text-align: justify;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  /* Add animation */
  -webkit-animation-name: example; /* Chrome, Safari, Opera */
  -webkit-animation-duration: 0.5s; /* Chrome, Safari, Opera */
  animation-name: example;
  animation-duration: 0.5s;
}

.container1 {
  padding: 2px 16px;
  display: flex;
  justify-content: center;
  background-color: #a5acb1;
}
.closebtn {
  text-decoration: none;
  float: right;
  font-size: 35px;
  background-color: red;
  font-weight: bold;
  border: red 1px solid;
  color: #fff;
}
.container {
  padding: 10px 16px;
  background-color: #a5acb1;
}
.container1 {
  padding: 2px 16px;
  display: flex;
      justify-content: center;
}
.create {
  margin-top: 10px;
}
</style>

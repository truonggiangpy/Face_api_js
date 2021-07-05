<template>
  <div id="containerCenter">
    <div id="menu">
      <div class="upload-btn-wrapper">
        <button class="btn">Chọn Ảnh</button>
        <input id="up" type="file" name="myfile" @change="onFileChange" />
      </div>
        <button class="btn" v-on:click="defaultt" >Mặc Định</button>
      <div id="detect">
        <button v-on:click="nhandienanhs" class="btn">Nhận Diện Ảnh</button>
        <button v-on:click="nhandienchungs" class="btn">Nhận Diện Tuổi, Cảm Xúc và Giới Tính</button>
      </div>
    </div>
      <div class="upload-btn-wrapper" id="containerRender"> 
        <div class="items" id="itemsLeft">
         <div id="logoTop"><img id="clickme" v-show="showClick" src="../image/clickme.png">
         <h2>Nhận dạng gương mặt trên browser.</h2>
         <ul>
           <li>Phát hiện khuôn mặt và nhận diện khuôn mặt</li>
           <li>Xác thực gương mặt</li>
           <li>Nhận diện cảm xúc của gương mặt</li>
           <li>Dự đoán tuổi và nhận diện giới tính</li>
         </ul>
         </div>
        <div class="fixImageCanvas" id="imageDao">  <img id="imageupload" v-if="url" :src="url" /></div>
  
      </div> 
        <div class="items" id="itemsRight">
          <div id="nhandienanh" v-show="nhandienanh" >
            <div id="logoTop"><img id="beforeReco" v-show="showClick" src="../image/beforeReco.png"></div>
            <div id="preview" v-show="showImageRight">
              <div class="fixImageCanvas" id="imageDao">  <img id="imageupload" v-if="url" :src="url" /></div>
              <div class="fixImageCanvas" id="imageCanvas">  </div>
            </div>  
          </div>
          <div id="nhandienchung" v-show="nhandienchung">
            <ul>
              <li>Dự Đoán Giới Tính <h3>{{gender}}</h3></li>
              <li>Dự Đoán Tuổi <h3>{{age}}</h3></li>
              <li>Dự Đoán Cảm Xúc <h3>{{FaceExpressions}}</h3></li>
            </ul>
          </div>
        </div>
    </div> 
      <div id="container">
      <div class="container2">
        <div id='control'>
          <div style="color:blue">
            <a @click="addTableLine" href="javascript:;" id="Filter" style="color: blue;"
              >Add Data &nbsp; &nbsp;</a>
          </div>
        </div>
        <div class="search-wrapper">
           <input id="hahaserch" type="text"  placeholder="Search Face"/>
        </div>
      </div>
      <div class="flex-container">
        <div  class="style col1" style="border-top-left-radius: 10px">ID# </div>
        <div class="style col2" >Tên Gương Mặt </div>
        <div class="style col3" >Lớp </div>
        <div class="style col4" >Giới Tính </div>
        <div class="style col5" >Khoa </div>
        <div class="style col6" >Ngày Sinh</div>
        <div class="style col7" >Ngày Nhập Học</div>
        <div class="style col8" style="border-top-right-radius: 10px">Xử Lý</div>
      </div>
      <div id="tablefull">
        <div class="tdata">
          <div
            class="flex-container"
            v-for="(user,idx) in arrayTemtam"
            :key="idx"
            @dblclick="editLine">
          <div class="col1">{{ user.id.toString() }}</div>
          <div class="col2" v-if="tinhTrang === 'defaule'">{{ user.ten }}</div>
          <div class="col3" v-if="tinhTrang === 'defaule' ">{{ user.lop }}</div>
          <div class="col4" v-if="user.gioitinh === true">Nam</div>
          <div class="col5" v-if="tinhTrang === 'defaule'">
            {{ user.khoa }}
          </div>
          <div class="col6" v-if="tinhTrang === 'defaule'">
            {{ user.ngaysinh }}
          </div>
          <div class="col7" v-if="tinhTrang === 'defaule'">  {{ user.ngaynhaphoc }}</div>
          <div
            id="dd"
            class="col8"
            v-if="tinhTrang === 'defaule'"
            style="text-align: center"
          >
            <button @click="editInfoFace">Edit</button>
            <button @click="confirmRemove">Remove</button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <createInforFace
     @confirmCancel="confirmCancel"
     :datatrunggian="datatrunggian"
     v-show="showModel"
    />
  </div>
</template>
<script>
import createInforFace from './createInforFace.vue'
import axios from 'axios'
import * as faceapi from 'face-api.js'
import "regenerator-runtime"

const api = axios.create({
  baseURL: 'http://localhost:3000/'
})

export default {
  name: 'Face-api-js',
  components: {
    createInforFace,
  },

  created () {
    api
      .get('/tasks')
      .then(response => (this.arrayTem = response.data))
    // api
    //   .get('/tasks')
    //   .then(response => (this.arrayTemtam = response.data))
  },

    mounted () {
    Promise.all([
    faceapi.loadFaceRecognitionModel('./models'),
    faceapi.loadFaceLandmarkModel('./models'),
    faceapi.loadSsdMobilenetv1Model('./models'),
    faceapi.loadFaceExpressionModel('./models'),
    faceapi.loadAgeGenderModel('./models')
    ])
    this.imgEl = document.getElementById("targetImg");
  },
  data () {
    return {
      showModel : false,
      msg: 'Nguyễn Trường Giang',
      url: null,
      imgEl: null,
      search: '',
      showImageRight: false,
      showClick: true,
      nhandienanh: true,
      nhandienchung: false,
      gender: null,
      age: null,
      FaceExpressions: null,
      arrayTemtam: [],
      arrayTem: [],
      tinhTrang: 'defaule',
      datatrunggian: {}
    }
  },

  computed: {
  },
  watch: {
    search () {
    },

    FaceExpressions () {
       var Expressq
      try{
         Expressq = this.FaceExpressions.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      }
      catch(e){
      }
      switch(Expressq){
        case 'angry':  this.FaceExpressions = 'Tức Giận'
          break;
        case 'disgusted':  this.FaceExpressions = 'Chán Ghét'
          break;
        case 'fearful':  this.FaceExpressions = 'Sợ Hãi'
          break;
        case 'happy':  this.FaceExpressions = 'Vui Vẻ Hạnh Phúc'
          break;
        case 'neutral':  this.FaceExpressions = 'Bình Thường'
          break;
        case 'sad':  this.FaceExpressions = 'Buồn'
          break;
        case 'surprised':  this.FaceExpressions = 'Ngạc Nhiên'
          break;
      }
    }
  },

  methods: {
    nhandienanhs (e) {
      try{document.getElementById("div1").remove()}
      catch(exeption){}
      if(this.showClick ===false)
      {
        this.nhandienanh = true
        this.nhandienchung = false
        this.faceRecognition(e)
      }
    },
    nhandienchungs(e) {
      this.faceDetect(e)
    },

  async faceRecognition(e) {
    this.showImageRight=true
    const canvass = document.getElementById("imageCanvas");
    console.log(this.loadLabeledImages())
    const labeledFaceDescriptors = await this.loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
    const image = await  faceapi.bufferToImage(e.target.parentNode.parentNode.childNodes[0].childNodes[2].files[0])
    const canvas = faceapi.createCanvasFromMedia(image)
    canvas.setAttribute("id", "div1")
    canvass.append(canvas)
    const displaySize = { width: image.width,  height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
      console.log(detections[0].age)
      console.log(detections[0].gender)
       console.log(detections)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    
    this.getdata(results)
    results.forEach((result,i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box,  { label: result.toString() })
      drawBox.draw(canvas)
        
    })
      document.getElementById("div1").style="width: 40rem;  "
  },

  getdata (results){
    // console.log(results)
    this.arrayTemtam = []
    for(let i = 0; i < results.length; i++)
    {
      for(let j = 0; j < this.arrayTem.length; j++){
        if(results[i]._label === this.arrayTem[j].ten){
          this.arrayTem[j].ngaysinh=this.arrayTem[j].ngaysinh.slice(0,10)
          this.arrayTem[j].ngaynhaphoc=this.arrayTem[j].ngaynhaphoc.slice(0,10)
          this.arrayTemtam.push(this.arrayTem[j])
        }
      }
    }

      // api
      // .get('/tasks')
      // .then(response => (this.arrayTemtam = response.data))

  },

  
  async faceDetect(e) {
    this.nhandienanh = false
    this.nhandienchung = true
    const image = await  faceapi.bufferToImage(e.target.parentNode.parentNode.childNodes[0].childNodes[2].files[0])
    const detections = await  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender()

    if(this.showClick ===false)
      {
        var gioitinh= null
        if (detections[0].gender === 'male'){
          gioitinh = 'Nam'
        }
        else {
          gioitinh = 'Nữ'
        }
        this.gender = gioitinh
        this.age= Math.round(detections[0].age)
        const maxValue = await Math.max(...Object.values(detections[0].expressions));
        this.FaceExpressions = await Object.keys(detections[0].expressions).filter(
        item => detections[0].expressions[item] === maxValue
       
      );
        if(this.FaceExpressions === "[ 'neutral' ]")
        {
        }
      }
  },


  loadLabeledImages()  {
    const labels = ['khang','Giang', 'ha', 'nguyen', 'van', 'huy', 'Ala' ]
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for(let i=1; i<=2;i++) {
          const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  },

  onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file)
      try{document.getElementById("div1").remove()}
      catch(exeption){}
       this.showImageRight=false
       this.showClick=false
      
    },
    defaultt(e) {
      this.nhandienanh = true
      this.nhandienchung = false
      this.showClick=true
      this.url= null
      this.gender= null
      this.age= null
      this.FaceExpressions= null
      try{document.getElementById("div1").remove()}
      catch(exeption){}
    },

    confirmRemove (e) {
      let index = 0
      let etarget = e.target.parentNode.parentNode.childNodes[0].innerHTML
      console.log(etarget)
      // let check = true
      for (let [i] of this.arrayTemtam.entries()) {
        if (String(etarget) === String(this.arrayTemtam[i].id)) {
          index = i
        }
      }
      api.get('/task/delete/' + this.arrayTemtam[index]._id)
        .then(response => {
        })
      axios
        .get('http://localhost:3000/tasks')
        .then(response => (this.arrayTemtam = response.data))
    },

    editInfoFace(e){
      var index = 1
       var etarget = e.target.parentNode.parentNode

      for (let [i] of this.arrayTemtam.entries()) {
          if (etarget.childNodes[0].innerHTML.toString() === this.arrayTemtam[i].id.toString()) {
            index = i
          }
        }
     
      let data = {
        e: e,
        id: etarget.childNodes[0].innerHTML,
        ten: etarget.childNodes[2].innerHTML,
        lop: etarget.childNodes[4].innerHTML,
        gioitinh: etarget.childNodes[6].innerHTML,
        khoa: etarget.childNodes[8].innerHTML,
        ngaysinh: etarget.childNodes[10].innerHTML,
        ngaynhaphoc: etarget.childNodes[12].innerHTML,
        _id: this.arrayTemtam[index]._id
      }

       this.showModel = true
       this.datatrunggian= data
    },

    confirmCancel (e) { // dùng để xác nhận cancel khi đang tạo teamplate
      this.showModel = false
      if(e.checkUpdate === true) {
        let etarget = e.e.target.parentNode.parentNode
        etarget.childNodes[0].innerHTML = e.id
        etarget.childNodes[2].innerHTML =  e.ten
        etarget.childNodes[4].innerHTML = e.lop
        if (e.gioitinh === true) {
          etarget.childNodes[6].innerHTML = "Nam"
        }
        else {
          etarget.childNodes[6].innerHTML = "Nu"
        }
        etarget.childNodes[8].innerHTML = e.khoa
        etarget.childNodes[10].innerHTML = e.ngaysinh
        etarget.childNodes[12].innerHTML = e.ngaynhaphoc
      }
    },

    addTableLine(e) {
      let data = {
        check: true
      }
       this.showModel = true
       this.datatrunggian= data
    },

    filterData(e) {

    },
    
    
    click(e) {

    },
    editLine(e){

    }
  }
}
</script>
<style scoped>


.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  border: 2px solid blue;

  color: blue;
  background-color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
    img,canvas{
      width:40rem
    }
    #preview{
      position: relative;
     
    }
    #imageDao{
      position: absolute;
      
    }
    #imageCanvas{
     
      position:absolute;
    }
    .fixImageCanvas{
      width: 40rem;
    }
        #div1{
          width:40rem
        }

#menu{
  display: flex; 
  justify-content: space-around;
  margin-top: 25px;

}
  #containerCenter{
    width: 80%;
    margin: 50px auto;
    height: 100%;
    position: relative;
  }
   #containerRender{
    display: flex;
    width: 100%;
    margin: 30px auto;
    height: 650px;
    position: relative;
  }
  .items {
      order: 2;
       flex-grow: 2;
       width: 50%;
       position: relative;
    } 
    #div1{
      border: red solid  1px;
    }
#clickme{
  width: 17rem
}
#beforeReco{
  width: 35rem
}
h3,ul,li{
    font-family: "Comic Sans MS", cursive, sans-serif;
}
#nhandienchung > *{
  font-size: 30px;
  line-height: 70px;
   text-align: center;
   list-style-type: none;
}
li> h3{
  color:blue;
 
}


.container2 {
  margin: 5px;
}
#control{
  display: flex;
  line-height: 30px;
}
#hahaserch {
  width: 600px;
  height: 30px;
  border: 2px solid blue;
  border-radius: 5px;

}
.nextpage:hover {
  background: red;
  color: white;
}

#container_child {
  margin-left: 10px;
  margin-right: 10px;
}

#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.container2 {
  display: flex;
}

#content {
  margin: 20px;
  color: white;
}
table {
  border-collapse: collapse;
  height: 100%;
  background-color: rgb(167, 190, 119);
}

table tr:first-child th:first-child {
  border-top-left-radius: 15px;
  border: none;
}

table tr:first-child th:last-child {
  border-top-right-radius: 15px;
  border: none;
  background-attachment: fixed;
}

th {
  font-size: large;
  background-color: red;
  color: white;
}
td,
th {
  border: 1px solid #000000;
  text-align: left;
  padding: 15px;
}

a {
  text-decoration: none;
  color: white;
}

.tron {
  border-radius: 50%;
}
#content > div {
  padding: 5px;
}
.flex-container {
  z-index: 5;
  min-width: 1100px;
  padding: 0px;
  margin: 0px;
  color: rgb(4, 0, 255);
  display: -webkit-box;
  /* background-color: rgb(255, 0, 0); */
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
 
}
.flex-container > .style {
  background-color: rgb(1 127 255);
  font-size: 20px;
  /* flex:1; */
  border: 1px solid rgb(0, 0, 0);
  color: white;
   text-align: center;
}
.flex-container > .style:hover {
    background-color: rgb(247, 173, 173);
    cursor: ns-resize;
    color: black
}
.flex-container > div {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border: 1px solid  rgb(0, 0, 0);
  font-size: 15px;
  padding: 10px 0px;
  text-align: center;
  /* display: -webkit-box; */
  justify-content: center;
  /* flex:1; */
}
.flex-container:first-child div:last-child {
  background-attachment: fixed;
  background-color: D0CFCF;
}
#container {
   flex: 1;
   display: flex;
   flex-direction: column;
}
#bang {
  flex: 1;
  position: relative;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
}
#tablefull {
  position: relative;
  height: 100%;
  width: 100%;
  flex: 1;
}
.tdata {
  position: absolute;
  /* overflow-y: overlay; */
  height: 100%;
  width: 100%;
}
#Cancel_edit {
  font-size: 20px;
  color: red;
  margin-right: 5px;
  padding-right: 5px;
}
.nextpage {
  padding: 0px;
}
#nextpage {
  display: flex;
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 25px;
  background-color: none;
  width: 40px;
  margin-left: 50%;
}
.next {
  color: black;
  background-color: rgb(255, 56, 56);
}

#container_child {
  display: flex;
  flex-direction: column;

  padding-bottom: 0;
}

.add {
  font-size: 20px;
  color: red;
  border-right: 1px solid black;
  margin-right: 5px;
  padding-right: 5px;
}
.add:hover {
  color: blue;
}
#Cancel_edit:hover {
  color: blue;
}
.remove {
  font-size: 20px;
  color: red;
  border-right: 1px solid black;
  margin-right: 5px;
  padding-right: 5px;
  border-right: none;
}
.remove:hover {
  color: blue;
}

.container {
  padding: 2px 16px;
}
.container1 {
  padding: 2px 16px;
  display: flex;
  justify-content: center;
}
.col1 {
  width: 10%;
}
.col2 {
  width: 13%;
}
.col3 {
  width: 10%;
}
.col4 {
  width: 10%;
}
.col5 {
  width: 13%;
}
.col6 {
  width: 13%;
}
.col7 {
  width: 13%;
}
.col8 {
  width: 20%;
}
/* .dropbtn {
  font-size: 20px;
  height: 5px;
  background-color: rgb(255, 255, 255);
  border: 0px;
  outline:#ffffff
} */

.dropup {
  position: relative;
  display: inline-block;
}

.dropup-content {
  border: 1px solid blue;
  display: none;
  position: absolute;
  background-color: #ffffff;
  min-width: 60px;
  bottom: -20px;
  right: 30px;
  z-index: 1;
}

.dropup-content>button {
 background-color: #ffffff;
  color: black;
  padding: 4px;
  border: none;
  outline: none;
  text-decoration: none;
  width: 100%;
  display: inline-block;
}

.dropup-content>button:hover {background-color: rgb(204, 204, 204)}

/* .dropup:hover .dropup-content {
  display: block;
} */
</style>

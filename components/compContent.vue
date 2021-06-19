<template>
  <div id="container">
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
  </div>
</template>
<script>
import * as faceapi from 'face-api.js'
import "regenerator-runtime"
export default {
  name: 'Face-api-js',
  components: {

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
      msg: 'Nguyễn Trường Giang',
       url: null,
       imgEl: null,
       showImageRight: false,
       showClick: true,
       nhandienanh: true,
       nhandienchung: false,
       gender: null,
       age: null,
       FaceExpressions: null,

       
    }
  },

  computed: {
  },
  watch: {
    FaceExpressions () {
       var Expressq
      try{
        //this.FaceExpressions = this.FaceExpressions.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
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
    const labeledFaceDescriptors = await this.loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4)
    const image = await  faceapi.bufferToImage(e.target.parentNode.parentNode.childNodes[0].childNodes[2].files[0])
    const canvas = faceapi.createCanvasFromMedia(image)
    canvas.setAttribute("id", "div1")
    canvass.append(canvas)
    const displaySize = { width: image.width,  height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result,i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box,  { label: result.toString() })
      drawBox.draw(canvas)
    })
      document.getElementById("div1").style="width: 40rem;  "
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
      if(this.FaceExpressions === "[ 'neutral' ]"){
        console.log('dsf')
      }
      }
  },



  loadLabeledImages()  {
    const labels = ['khang','Giang', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor' ]
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
  #container{
    width: 80%;
    margin: 50px auto;
    height: 100%;
    position: relative;
  }
   #containerRender{
    display: flex;
    width: 100%;
    margin: 30px auto;
    height: 1000px;
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
    
</style>

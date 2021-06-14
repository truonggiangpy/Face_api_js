<template>
  <div id="container">
    <div id="menu">
      <div class="upload-btn-wrapper">
        <button class="btn">Chọn Ảnh</button>
        <input id="up" type="file" name="myfile" @change="onFileChange" />
      </div>
      <button v-on:click="start" class="btn">Nhận Diện Ảnh</button>
    </div>
      <div class="upload-btn-wrapper" id="containerRender"> 
        <div class="items" id="itemsLeft">
         <div class="fixImageCanvas" id="imageDao">  <img id="imageupload" v-if="url" :src="url" /></div>
  
      </div> 
        <div class="items" id="itemsRight">
           <div id="preview" v-show="showImageRight">
            <div class="fixImageCanvas" id="imageDao">  <img id="imageupload" v-if="url" :src="url" /></div>
            <div class="fixImageCanvas" id="imageCanvas">  </div>
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
    faceapi.loadSsdMobilenetv1Model('./models')
    ])
    this.imgEl = document.getElementById("targetImg");
  },
  data () {
    return {
      msg: 'Nguyễn Trường Giang',
       url: null,
       imgEl: null,
       showImageRight: false
    }
  },

  computed: {
  },

  methods: {
    async  start (e) {
       this.call(e)
  },

  async call(e) {
    this.showImageRight=true
    const canvass = document.getElementById("imageCanvas");
    const labeledFaceDescriptors = await this.loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4)
    const image = await  faceapi.bufferToImage(e.target.parentNode.childNodes[0].childNodes[2].files[0])
    const canvas = faceapi.createCanvasFromMedia(image)
    canvas.setAttribute("id", "div1")
    canvass.append(canvas)
    const displaySize = { width: image.width,  height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result,i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box,  { label: result.toString() })
      drawBox.draw(canvas)
    })
      document.getElementById("div1").style="width: 40rem;  "
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
      
    },

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
    margin: 30px auto;
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


    
</style>

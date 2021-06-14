import * as faceapi from 'face-api.js'

const imageUpload = document.getElementById('imageUpload')

Promise.all([
 faceapi.loadFaceRecognitionModel('./models'),
 faceapi.loadFaceLandmarkModel('./models'),
 faceapi.loadSsdMobilenetv1Model('./models')
]).then(start)

function start() {
  //const imageUpload = document.getElementById('imageUpload')
document.body.append('loaded')
// // imageUpload.addEventListener('change', async() =>{
// alert('giang')
// const image =  faceapi.bufferToImage(imageUpload.files[0])
// const detections =  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
// document.body.append(detections.length)
// // })
}
//  function start() {
//   console.log(Object.values(loadLabeledImages()));
//     const container = document.createElement('div')
//     container.style.position = 'relative'
//     document.getElementById('box').appendChild(container)
//     const labeledFaceDescriptors =  loadLabeledImages()
//     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
//     imageUpload.addEventListener('change', async() =>{
//       image =  faceapi.bufferToImage(imageUpload.files[0])
//       document.getElementById('box').appendChild(image)
//       const canvas = faceapi.createCanvasFromMedia(image)
//        document.getElementById('box').appendChild(canvas)
//       const displaySize = { width: image.width, height: image.height }
//       faceapi.matchDimensions(canvas, displaySize)
//       const detections =  faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
//       const resizedDetections = faceapi.resizeResults(detections, displaySize)
//       const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
//       // document.body.append(detections.length)
//     results.forEach((result, i) => {
//       const box = resizedDetections[i].detection.box
//       const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//       drawBox.draw(canvas)
//     })
//     })
//   }

  function loadLabeledImages() {
    const labels = ['khang','Giang', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor' ]
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for(let i=1; i<=2;i++) {
          const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
        //var t =new faceapi.LabeledFaceDescriptors(label, descriptions)

        // alert(Object.values(t))
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }

// async function start() {
//   const container = document.createElement('div')
//   container.style.position = 'relative'
//   document.body.append(container)
//   const labeledFaceDescriptors = await loadLabeledImages()
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
//   let image
//   let canvas
//   document.body.append('Loaded')
//   imageUpload.addEventListener('change', async () => {
//     if (image) image.remove()
//     if (canvas) canvas.remove()
//     image = await faceapi.bufferToImage(imageUpload.files[0])
//     container.append(image)
//     canvas = faceapi.createCanvasFromMedia(image)
//     container.append(canvas)
//     const displaySize = { width: image.width, height: image.height }
//     faceapi.matchDimensions(canvas, displaySize)
//     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
//     const resizedDetections = faceapi.resizeResults(detections, displaySize)
//     const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
//     results.forEach((result, i) => {
//       const box = resizedDetections[i].detection.box
//       const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//       drawBox.draw(canvas)
//     })
//   })
// }

// function loadLabeledImages() {
//   const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
//   return Promise.all(
//     labels.map(async label => {
//       const descriptions = []
//       for (let i = 1; i <= 2; i++) {
//         const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         descriptions.push(detections.descriptor)
//       }

//       return new faceapi.LabeledFaceDescriptors(label, descriptions)
//     })
//   )
// }

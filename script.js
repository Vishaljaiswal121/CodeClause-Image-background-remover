const fileInput = document.getElementById('fileInput');
const outputCanvas = document.getElementById('outputCanvas');
const outputContext = outputCanvas.getContext('2d');
let model;

async function loadModel() {
  model = await bodyPix.load();
  fileInput.addEventListener('change', handleFileSelect);
}

async function handleFileSelect(evt) {
  const file = evt.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = async function () {
    const segmentation = await model.segmentPerson(img, {
      flipHorizontal: false,
      internalResolution: 'medium',
      segmentationThreshold: 0.7
    });

    // Create a binary mask based on the segmentation result
    const mask = new ImageData(segmentation.data, segmentation.width, segmentation.height);

    // Set the canvas size to match the image
    outputCanvas.width = img.width;
    outputCanvas.height = img.height;

    // Draw the original image on the canvas
    outputContext.drawImage(img, 0, 0);

    // Apply the mask to the canvas to remove the background
    outputContext.putImageData(mask, 0, 0);
  };
  img.src = URL.createObjectURL(file);
}

loadModel();

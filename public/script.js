const form = document.getElementById('resize-form');
const result = document.getElementById('result');
const resizedImage = document.getElementById('resized-image');
const downloadButton = document.getElementById('download-button');
const imageInput = document.getElementById('image');
const fileSizeContainer = document.getElementById('file-size-container');
const fileSizeLabel = document.getElementById('file-size');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

// Automatically update the width, height, and file size fields based on the uploaded image
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        widthInput.value = img.width;
        heightInput.value = img.height;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Display file size
    const fileSizeInKB = (file.size / 1024).toFixed(2); // Convert size to KB
    fileSizeLabel.textContent = fileSizeInKB;
    fileSizeContainer.style.display = 'block';
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  
  const response = await fetch('/api/resize', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    resizedImage.src = url;
    downloadButton.href = url;

    result.style.display = 'block';
  } else {
    alert('Failed to resize the image. Please try again.');
  }
});

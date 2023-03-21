const fileInput = document.getElementById('audio');
const fileList = document.getElementById('selected-files');
const addMoreButton = document.getElementById('add-more');

let filesArray = [];

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  fileList.innerHTML = '';
  for (const file of files) {
    if (!filesArray.includes(file)) {
      filesArray.push(file);
      const listItem = document.createElement('li');
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        const index = filesArray.indexOf(file);
        if (index > -1) {
          filesArray.splice(index, 1);
        }
        listItem.remove();
      });
      listItem.textContent = `${file.name} (${formatSizeUnits(file.size)})`;
      listItem.appendChild(removeButton);
      fileList.appendChild(listItem);
    }
  }
});

addMoreButton.addEventListener('click', () => {
  const newInput = document.createElement('input');
  newInput.type = 'file';
  newInput.accept = 'audio/*';
  newInput.multiple = true;
  newInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
      if (!filesArray.includes(file)) {
        filesArray.push(file);
        const listItem = document.createElement('li');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
          const index = filesArray.indexOf(file);
          if (index > -1) {
            filesArray.splice(index, 1);
          }
          listItem.remove();
        });
        listItem.textContent = `${file.name} (${formatSizeUnits(file.size)})`;
        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
      }
    }
  });
  fileInput.parentNode.insertBefore(newInput, fileInput.nextSibling);
});

const uploadForm = document.getElementById('file-upload-form');
uploadForm.addEventListener('submit', (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  // Create a FormData object to store the files
  const formData = new FormData();
  for (const file of filesArray) {
    formData.append('audio', file);
  }

  // Send a POST request to the server
  fetch('/audioFiles/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

document.getElementById('uploadBtn').addEventListener('click', function() {
    let files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select some files to upload!');
        return;
    }

    // Prepare form data to send to the backend
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    // Send files to the backend
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Files uploaded successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('organizeBtn').addEventListener('click', function() {
    // Get the file types to organize
    let selectedFileTypes = [];
    if (document.getElementById('txtFiles').checked) selectedFileTypes.push('.txt');
    if (document.getElementById('jpgFiles').checked) selectedFileTypes.push('.jpg');
    if (document.getElementById('pngFiles').checked) selectedFileTypes.push('.png');
    if (document.getElementById('pdfFiles').checked) selectedFileTypes.push('.pdf');

    // Send request to organize files
    fetch('/organize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileTypes: selectedFileTypes })
    })
    .then(response => response.json())
    .then(data => {
        // Update UI with results
        let fileList = document.getElementById('fileList');
        fileList.innerHTML = '';  // Clear existing list
        data.organizedFiles.forEach(file => {
            let li = document.createElement('li');
            li.textContent = file;
            fileList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
    
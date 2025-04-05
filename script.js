document.getElementById('organizeBtn').addEventListener('click', function() {
    let selectedFileTypes = [];
    if (document.getElementById('txtFiles').checked) selectedFileTypes.push('txt');
    if (document.getElementById('jpgFiles').checked) selectedFileTypes.push('jpg');
    if (document.getElementById('pngFiles').checked) selectedFileTypes.push('png');
    if (document.getElementById('pdfFiles').checked) selectedFileTypes.push('pdf');

    fetch('/organize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileTypes: selectedFileTypes })
    })
    .then(response => response.json())
    .then(data => {
        let fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
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
                              

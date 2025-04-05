
      import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'jpg', 'jpeg', 'png', 'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files selected'}), 400

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    uploaded_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            uploaded_files.append(filename)

    return jsonify({'message': 'Files uploaded successfully!', 'files': uploaded_files}), 200

@app.route('/organize', methods=['POST'])
def organize_files():
    data = request.get_json()
    file_types = [ext.lower().lstrip('.') for ext in data.get('fileTypes', [])]

    organized_files = []

    # Create folders based on file types
    for file_type in file_types:
        folder = os.path.join(UPLOAD_FOLDER, file_type.upper())
        if not os.path.exists(folder):
            os.makedirs(folder)

    # Move files into folders
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(file_path) and '.' in filename:
            ext = filename.rsplit('.', 1)[1].lower()
            if ext in file_types:
                target_folder = os.path.join(UPLOAD_FOLDER, ext.upper())
                os.rename(file_path, os.path.join(target_folder, filename))
                organized_files.append(filename)

    return jsonify({'organizedFiles': organized_files}), 200

if __name__ == '__main__':
    app.run(debug=True)
  

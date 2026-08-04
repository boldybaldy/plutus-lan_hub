import os
import socket
import time
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

shared_data = {
    'text': '',
    'version': time.time(),
}


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


@app.route('/')
def index():
    files = sorted(os.listdir(app.config['UPLOAD_FOLDER']))
    return render_template(
        'index.html',
        shared_text=shared_data['text'],
        files=files,
        version=shared_data['version'],
        host_ip=get_local_ip(),
        port=PORT,
    )


@app.route('/status')
def status():
    return jsonify({'version': shared_data['version']})


@app.route('/update-text', methods=['POST'])
def update_text():
    shared_data['text'] = request.form.get('text', '')
    shared_data['version'] = time.time()
    return redirect(url_for('index'))


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file and file.filename:
        safe_name = secure_filename(file.filename)
        if safe_name:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], safe_name))
            shared_data['version'] = time.time()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'ok': True, 'filename': safe_name})

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'ok': False, 'message': 'No file uploaded'}), 400

    return redirect(url_for('index'))


@app.route('/files/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


if __name__ == '__main__':
    local_ip = get_local_ip()
    print('\n' + '=' * 50)
    print(' App running! Access it on any LAN device at:')
    print(f' http://{local_ip}:{PORT}')
    print('=' * 50 + '\n')
    app.run(host='0.0.0.0', port=PORT)

from flask import Flask, send_file, Response, request, jsonify
from flask_cors import CORS
from google.cloud import storage
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
import requests
import time
import os
from flask import send_from_directory

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

class Photo:
    GCS_BUCKET = "raspberrypi4"
    GOOGLE_CLOUD_PROJECT = "pullupnyc"
    PHOTOS_DIR = "photos"
    FACES_DIR = "faces"  # add this line

VIDEOS_DIR = "videos" # Directory to store videos

@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return 'No video part in the request', 400
    file = request.files['video']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
        bucket = gcs.get_bucket(Photo.GCS_BUCKET)
        filename = '{}.mp4'.format(int(time.time()))
        blob = bucket.blob(os.path.join(VIDEOS_DIR, filename))
        blob.upload_from_file(file)
        return blob.public_url

@app.route('/upload_video_local', methods=['POST'])
def upload_video_local():
    if 'video' not in request.files:
        return 'No video part in the request', 400
    file = request.files['video']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filename = '{}.mp4'.format(int(time.time()))
        folder_path = "/Users/mattmacfarlane/Development/code/projects/esp32/server/local_videos"
        if not os.path.exists(folder_path):    # Check if folder exists
            os.makedirs(folder_path)           # Create folder if it doesn't
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)
        return file_path

@app.route('/upload_video_cloud', methods=['POST'])
def upload_video_cloud():
    if 'video' not in request.files:
        return 'No video part in the request', 400
    file = request.files['video']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
        bucket = gcs.get_bucket(Photo.GCS_BUCKET)
        filename = '{}.mp4'.format(int(time.time()))
        blob = bucket.blob(os.path.join(VIDEOS_DIR, filename))
        blob.upload_from_file(file)
        return blob.public_url


@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return 'No image part in the request', 400
    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
        bucket = gcs.get_bucket(Photo.GCS_BUCKET)
        filename = '{}.jpg'.format(int(time.time()))
        blob = bucket.blob(os.path.join(Photo.PHOTOS_DIR, filename))
        blob.upload_from_file(file)
        return blob.public_url

@app.route('/upload_image_local', methods=['POST'])
def upload_image_local():
    if 'image' not in request.files:
        return 'No image part in the request', 400
    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filename = '{}.jpg'.format(int(time.time()))
        folder_path = "/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos"
        if not os.path.exists(folder_path):    # Check if folder exists
            os.makedirs(folder_path)           # Create folder if it doesn't
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)
        return file_path

@app.route('/photos', methods=['GET'])
def get_photos():
    gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
    bucket = gcs.get_bucket(Photo.GCS_BUCKET)
    blobs = gcs.list_blobs(bucket, prefix=Photo.PHOTOS_DIR)
    photo_urls = ["https://storage.googleapis.com/{}/{}".format(bucket.name, blob.name) for blob in blobs]
    return jsonify(photo_urls)

@app.route('/photos/faces', methods=['GET'])  # new endpoint
def get_faces_photos():
    gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
    bucket = gcs.get_bucket(Photo.GCS_BUCKET)
    blobs = gcs.list_blobs(bucket, prefix=os.path.join(Photo.PHOTOS_DIR, Photo.FACES_DIR))
    photo_urls = ["https://storage.googleapis.com/{}/{}".format(bucket.name, blob.name) for blob in blobs]
    return jsonify(photo_urls)

@app.route('/local_photos', methods=['GET'])
def get_local_photos():
    photos_dir = "/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos"
    photos = os.listdir(photos_dir)
    photo_paths = [f"/photo?filename={photo}" for photo in photos]
    return jsonify(photo_paths)

@app.route('/photo', methods=['GET'])
def serve_photo():
    filename = request.args.get('filename')
    return send_from_directory('/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos', filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def proxy(path):
    # Forward all requests to ESP32 camera server
    response = requests.get(f'http://192.168.1.180/{path}')
    
    # Send response back to client
    return Response(response.content, mimetype=response.headers['Content-Type'])

if __name__ == '__main__':
    app.run(port=3001)

# from flask import Flask, send_file, Response, request, jsonify
# from flask_cors import CORS
# from google.cloud import storage
# import requests
# import time
# import os
# from flask import send_from_directory

# app = Flask(__name__)
# CORS(app) # This will enable CORS for all routes

# class Photo:
#     GCS_BUCKET = "raspberrypi4"
#     GOOGLE_CLOUD_PROJECT = "pullupnyc"
#     PHOTOS_DIR = "photos"


# @app.route('/upload_image', methods=['POST'])
# def upload_image():
#     if 'image' not in request.files:
#         return 'No image part in the request', 400
#     file = request.files['image']
#     if file.filename == '':
#         return 'No selected file', 400
#     if file:
#         gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
#         bucket = gcs.get_bucket(Photo.GCS_BUCKET)
#         filename = '{}.jpg'.format(int(time.time()))
#         blob = bucket.blob(os.path.join(Photo.PHOTOS_DIR, filename))
#         blob.upload_from_file(file)
#         return blob.public_url

# @app.route('/upload_image_local', methods=['POST'])
# def upload_image_local():
#     if 'image' not in request.files:
#         return 'No image part in the request', 400
#     file = request.files['image']
#     if file.filename == '':
#         return 'No selected file', 400
#     if file:
#         filename = '{}.jpg'.format(int(time.time()))
#         folder_path = "/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos"
#         if not os.path.exists(folder_path):    # Check if folder exists
#             os.makedirs(folder_path)           # Create folder if it doesn't
#         file_path = os.path.join(folder_path, filename)
#         file.save(file_path)
#         return file_path

# @app.route('/photos', methods=['GET'])
# def get_photos():
#     gcs = storage.Client(Photo.GOOGLE_CLOUD_PROJECT)
#     bucket = gcs.get_bucket(Photo.GCS_BUCKET)
#     blobs = gcs.list_blobs(bucket, prefix=Photo.PHOTOS_DIR)
#     photo_urls = ["https://storage.googleapis.com/{}/{}".format(bucket.name, blob.name) for blob in blobs]
#     return jsonify(photo_urls)


# @app.route('/local_photos', methods=['GET'])
# def get_local_photos():
#     photos_dir = "/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos"
#     photos = os.listdir(photos_dir)
#     photo_paths = [f"/photo?filename={photo}" for photo in photos]
#     return jsonify(photo_paths)

# @app.route('/photo', methods=['GET'])
# def serve_photo():
#     filename = request.args.get('filename')
#     return send_from_directory('/Users/mattmacfarlane/Development/code/projects/esp32/server/local_photos', filename)

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def proxy(path):
#     # Forward all requests to ESP32 camera server
#     response = requests.get(f'http://192.168.1.180/{path}')
    
#     # Send response back to client
#     return Response(response.content, mimetype=response.headers['Content-Type'])

# if __name__ == '__main__':
#     app.run(port=3001)

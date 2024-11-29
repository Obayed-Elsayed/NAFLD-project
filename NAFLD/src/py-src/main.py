# pip freeze the erqs from the backend and just integrate it here
# add new gitignores here as well from the other project
# 


# python -m pip install -r ./setup.txt
# flask --app .\NAFLD\src\py-src\main.py run
import os
from flask import Flask,jsonify,send_file, request
from datetime import datetime
from flask_cors import CORS
import sys
import zipfile

# sys.path.append("C:\\Projects\\Machine Learning\\NAFLD\\NAFLD-project\\NAFLD\\src\\py-src\\nafld.py")
from nafld import process_all_images
app = Flask(__name__)
CORS(app, expose_headers=['Content-Disposition'])
# 'C:\\Projects\\NAFLD\\NAFLD-project\\NAFLD\\Images'
# C:\Projects\Machine Learning\NAFLD\NAFLD-project\NAFLD\Images
UPLOAD_FOLDER = 'C:\\Projects\\Machine Learning\\NAFLD\\NAFLD-project\\NAFLD\\Images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

upload_file_dict = {}
# upload_file_list = []

# Look into restricting access from other endpoints than arent localhost?
# CORS(app, resources={r"/home": {"origins": "localhost:3000"}})

@app.route("/home")
def home():
    return {
  "blogs": [
    {
      "title": "My First Blog",
      "body": "Why do we use it?\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n\nWhere does it come from?\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\n\nWhere can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      "author": "mario",
      "id": 1
    },
    {
      "title": "Opening Party!",
      "body": "Why do we use it?\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n\nWhere does it come from?\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\n\nWhere can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      "author": "yoshi",
      "id": 2
    }
  ]
}


@app.route("/upload", methods =['POST'])
def upload_file():
    file = request.files['file']
    print(f'received: {file}')
    if file:
        print(f'{file.filename}_{datetime.now().minute}:{datetime.now().second}')
        file.save(os.path.join(UPLOAD_FOLDER, f'{file.filename}_{datetime.now().minute}_{datetime.now().second}'))
        return jsonify({'message': 'File successfully uploaded'}), 200

    return jsonify({'error': 'WHY NO WORK :( '}), 400

@app.route("/largefile", methods =['POST'])
def upload_largefile():
    # print(f"\n \n \n \n   STARTING UPLOAD \n \n \n \n")
    # Get the file chunk from the request
    chunk = request.files['file']  # 'file' is the field name used by Resumable.js
    resumable_filename = request.form['resumableFilename']  # Original file name
    resumable_chunk_number = request.form['resumableChunkNumber']  # Chunk index (1-based)
    total_chunks = int(request.form['resumableTotalChunks'])
    full_file_path = os.path.join(UPLOAD_FOLDER, f'{resumable_filename}')

    print(full_file_path)
    try:
        with open(full_file_path,'ab') as chunked_file:
            chunked_file.write(chunk.read())
    except:
        jsonify({"status": "Error writing chunk to file"}), 400
    
    if(resumable_chunk_number == total_chunks):
        return jsonify({"status": "File upload complete"}), 200

    #                 final_file.write(chunk_file.read())
    # # Create the file path for the chunks
    # chunk_folder = os.path.join(UPLOAD_FOLDER, resumable_filename)
    # os.makedirs(chunk_folder, exist_ok=True)
    
    # # Save the chunk to the folder
    # chunk_filename = f"{resumable_filename}.part{resumable_chunk_number}"
    # chunk.save(os.path.join(chunk_folder, chunk_filename))
    
    # # Check if all chunks have been uploaded
    # total_chunks = int(request.form['resumableTotalChunks'])
    # if len(os.listdir(chunk_folder)) == total_chunks:
    #     # Assemble all chunks into the final file
    #     with open(os.path.join(UPLOAD_FOLDER, resumable_filename), 'wb') as final_file:
    #         for i in range(1, total_chunks + 1):
    #             chunk_path = os.path.join(chunk_folder, f"{resumable_filename}.part{i}")
    #             with open(chunk_path, 'rb') as chunk_file:
    #                 final_file.write(chunk_file.read())
        
    #     # Optionally, remove the chunk files after assembling
    #     for filename in os.listdir(chunk_folder):
    #         os.remove(os.path.join(chunk_folder, filename))
    #     os.rmdir(chunk_folder)

    #     return jsonify({"status": "File upload complete"}), 200

    return jsonify({"status": "Chunk upload successful"}), 200



@app.route("/fake", methods = ['POST'])
def upload_json():
    data = request.get_json()
    print(data)  # Process your data here
    return jsonify({"message": "Data received!", "data": data}), 200
    


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_file(folder_path):
    #check if zip & extract
    df = process_all_images(folder_path)

    # send back as csv?

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    if(filename not in upload_file_dict):
        return jsonify({'error': 'File not found'}), 404
    
    # Extract Any zip files
    folder_path = upload_file_dict[filename]
    for filename in os.listdir(folder_path):
      if filename.endswith('.zip'):  # Check if the file has a .zip extension
          zip_file_path = os.path.join(folder_path, filename)
          
          # Check if the file is a valid zip file
          if zipfile.is_zipfile(zip_file_path):
              print(f"Found ZIP file: {filename}")
              
              # Extract the zip file in the same directory
              with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                  zip_ref.extractall(folder_path)
              print(f"Extracted {filename} to {folder_path}")
          else:
              print(f"{filename} is not a valid zip file.")

    csv_file_name = 'output.csv'
    csv_path = os.path.join(folder_path,csv_file_name)
    df = process_all_images(folder_path)
    df.to_csv(csv_path, index=False)

    try:
        response = send_file(csv_path, as_attachment=True)
        response.headers["Content-Disposition"] = f"attachment; filename={csv_file_name}"
        return send_file(csv_path, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404


    

@app.route("/fullFileUpload", methods =['POST'])
def full_file_upload():
    chunk = request.files['file'] 
    resumable_filename = request.form['resumableFilename']  

    if resumable_filename not in upload_file_dict:
      
      current_time = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
      new_folder_path = os.path.join(UPLOAD_FOLDER, current_time)
      upload_file_dict[resumable_filename] = new_folder_path
      os.makedirs(new_folder_path, exist_ok=True)



    resumable_chunk_number = request.form['resumableChunkNumber']  # Chunk index (1-based)
    total_chunks = int(request.form['resumableTotalChunks'])
    full_file_path = os.path.join(upload_file_dict[resumable_filename], resumable_filename)

    print(full_file_path)
    try:
        with open(full_file_path,'ab') as chunked_file:
            chunked_file.write(chunk.read())
    except:
        jsonify({"status": "Error writing chunk to file"}), 400
    
    if(int(resumable_chunk_number) == total_chunks):
        print("Returned file")
        # return jsonify({"status": {'file_status':"file upload complete","fileName":f"{resumable_filename}"}}), 200
        return jsonify({"status": "file upload complete","fileName":f"{resumable_filename}"}), 200
    
    # print(f"res num: {resumable_chunk_number} total: {total_chunks}")
    return jsonify({"status": "Chunk upload successful"}), 200
    


if __name__ == "__main__":
    app.run(debug=True)


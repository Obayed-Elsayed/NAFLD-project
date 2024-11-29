import React, { useEffect, useRef, useState } from 'react';
import Resumable from 'resumablejs';
import ProgressBar from './progressBar';

const FileUploader = () => {
  const resumableRef = useRef(null);
  const [filesSelected, setFilesSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [image, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // Initialize Resumable.js
    resumableRef.current = new Resumable({

      target: 'http://localhost:5000/fullFileUpload',
      // target: 'http://localhost:5000/largefile', 
      chunkSize: 3 * 1024 * 1024, // 1 MB per chunk
      simultaneousUploads: 1,
      testChunks: false, // Disable testing chunks before upload
      throttleProgressCallbacks: 1, // Progress updates
    });

    // Resumable.js event listeners
    resumableRef.current.on('fileAdded', (file) => {
      console.log("File added:", file);
      setFilesSelected(true);
    });

    resumableRef.current.on('fileSuccess', (file, message) => {
      setFileUploaded(true);
      let message_json = JSON.parse(message)
      console.log(message_json.fileName);
      setFileName(message_json.fileName)
      console.log("File upload successful:", file);
    });

    resumableRef.current.on('fileError', (file, error) => {
      console.error("File upload error:", error);
    });

    resumableRef.current.on('progress', () => {
      setProgress((resumableRef.current.progress() * 100).toFixed(2));
      console.log(`Progress: ${(resumableRef.current.progress() * 100).toFixed(2)}%`);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedImage(files[0])
    resumableRef.current.addFiles(files); // Add files to Resumable.js
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission and page refresh
    setFileUploaded(false);
    if (filesSelected) {
      resumableRef.current.upload();
    }
  };

  const downloadFile = async (filename) => {
    try {
      // Make a GET request to the backend with fetch
      setLoading(true);
      const response = await fetch(`http://localhost:5000/download/${filename}`, {
        method: 'GET',
      });

      // Check if the response is successful
      if (response.ok) {
        setLoading(false);

        const blob = await response.blob();

        const disposition = response.headers.get('Content-Disposition');
        console.log(response.headers)
        let downloadfilename = '_result.csv'; // Default filename
        if (disposition) {
          console.log(disposition);
          downloadfilename = disposition
            .split('filename=')[1]
            .replace(/"/g, ''); // Extract filename and remove quotes
        }
        // Create a temporary link element to trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadfilename);  // Set the downloaded file name

        // Append the link to the body (necessary for some browsers)
        document.body.appendChild(link);
        link.click();  // Programmatically click the link to trigger the download
        document.body.removeChild(link);  // Clean up the DOM after the download
      } else {
        throw new Error('Failed to fetch file');
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file');
    }
  };


  return (

    <div className="ImageSubmission">

      {image && <div className="ImageSelection">
        <img
          alt="not found"
          src={URL.createObjectURL(image)}
          style={{
            display: "block",          // Makes the image behave as a block-level element
            margin: "0 auto",          // Centers the image horizontally
            width: "500px",            // Adjusts the displayed width
            height: "auto",            // Maintains the aspect ratio
          }}
        />
      </div>}

      {fileUploaded && (
        <div className="csv-container">
          <div className="csvDownload">
            Download Result File for: {fileName}
            <button onClick={() => downloadFile(fileName)}>Download</button>
            {loading && <div> Processing Input... </div>}
          </div>
        </div>
      )}


      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileSelect} multiple />
          <button type="submit" disabled={!filesSelected}>
            Upload Files
          </button>
        </form>
      </div>
      {progress &&
        <div style={{ padding: '20px 0' }}>
          <ProgressBar progress={progress}> </ProgressBar>
        </div>
      }
    </div>


  );
}

export default FileUploader;


import React, { useEffect, useRef, useState } from 'react';
import Resumable from 'resumablejs';

const FileUploader = () => {
  const resumableRef = useRef(null);
  const [filesSelected, setFilesSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Initialize Resumable.js
    resumableRef.current = new Resumable({
      target: 'http://localhost:5000/largefile', // Flask endpoint
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
      setFileName(message.get('fileName'))
      console.log("File upload successful:", file);
    });

    resumableRef.current.on('fileError', (file, error) => {
      console.error("File upload error:", error);
    });

    resumableRef.current.on('progress', () => {
      console.log(`Progress: ${(resumableRef.current.progress() * 100).toFixed(2)}%`);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = event.target.files;
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
      const response = await fetch(`http://localhost:5000/download/${filename}`, {
        method: 'GET',
      });

      // Check if the response is successful
      if (response.ok) {
        // Convert the response to a Blob (binary large object)
        const blob = await response.blob();

        // Create a temporary link element to trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);  // Set the downloaded file name

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
      {fileUploaded && <div className="csvDownload"> Download Result File: {fileName}

        <button onClick={() => downloadFile(fileName)}>
          Download
        </button>

      </div>}


      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileSelect} multiple />
        <button type="submit" disabled={!filesSelected}>
          Upload Files
        </button>

      </form>
    </div>


  );
}

export default FileUploader;


import React, { useEffect, useRef, useState } from 'react';
import Resumable from 'resumablejs';

const FileUploader = () => {
  const resumableRef = useRef(null);
  const [filesSelected, setFilesSelected] = useState(false);

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
      setFilesSelected(true); // Enable submit button when a file is selected
    });

    resumableRef.current.on('fileSuccess', (file, message) => {
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
    event.preventDefault(); // Prevent default form submission
    if (filesSelected) {
      resumableRef.current.upload(); // Start upload when form is submitted
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect} multiple />
      <button type="submit" disabled={!filesSelected}>
        Upload Files
      </button>
    </form>
  );
}
 
export default FileUploader;


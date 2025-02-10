import { useEffect, useState } from "react";
import ImageSubmission from "./ImageSubmission";
import FileUploader from "./FileUploader";
// TODO:
// Test when file upload fails what happens
// Test when result file download fails what happens
// Refactor css file into multiple files depending on what class is using them
function App() {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch("http://127.0.0.1:5000/home").then(
      res => {
        console.log(res)
        return res.json()
      }
    )
      .then(
        data => {
          setData(data)
          console.log(data)
        }
      ).catch(err => console.log(err))
  }, []);

  return (
    <div className="App">
      <header className="centered-header">
        <img src="/Images/McMaster.png" alt="Logo Left" className="logo" />
        <img src="/Images/ICELAB.png" alt="Logo middle" className="logo" />
        <img src="/Images/Heersink.png" alt="Logo Right" className="logo" />
        {/* <ImageSubmission /> */}
      </header>
        <h1 className="centered-header">
          FibroAi
        </h1>
      <div>
        <FileUploader />
      </div>
    </div>
  );
}

export default App;

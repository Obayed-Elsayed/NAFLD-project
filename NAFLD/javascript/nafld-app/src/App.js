import { useEffect, useState } from "react";
import ImageSubmission from "./ImageSubmission";

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
      <header className="App-header">
        <h1> NAFLD prototype</h1>
        <ImageSubmission />
      </header>
    </div>
  );
}

export default App;

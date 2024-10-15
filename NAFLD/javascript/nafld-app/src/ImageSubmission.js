import { useState } from "react";
const ImageSubmission = () => {
    const [image, setSelectedImage] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("SUBMITTED")
        if (!image) {
            alert("Please select an image to upload.");
            return;
        }
        console.log(image)
        const formData = new FormData();
        formData.append('file', image);
        // formData.append('upload_preset', "default-preset");

        try {
            console.log(formData);
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log(result)
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    /*  THIS IS a FAKE DATA PING*/
    // const fakeData = {
    //     "userId": 1,
    //     "id": 1,
    //     "title": "delectus aut autem",
    //     "completed": false
    //   }

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log("SUBMITTED")
    //     if (!image) {
    //         alert("Please select an image to upload.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', image);

    //     try {
    //         const response = await fetch('http://127.0.0.1:5000/fake', {
    //             method: 'POST',
    //             headers:{"Content-Type":"application/json"},
    //             body: JSON.stringify(fakeData),
    //         });

    //         const result = await response.json();
    //         console.log(result)
    //     } catch (error) {
    //         console.error('Error during upload:', error);
    //     }
    // };

    return ( 

        <div className="ImageSubmission">
            {image && <div className="ImageSelection"> Image Selection
                <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(image)}
                />
            </div>}
            
            
            <form  onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="file"
                    name="myImage"
                    // Event handler to capture file selection and update the state
                    onChange={(event) => {
                        console.log("file changed");
                        // only hook the first image for now
                        setSelectedImage(event.target.files[0]) 
                    }}
                    />

                {/* <input type="submit" onSubmit={(e) =>handleSubmit(e)} /> */}
                <input type="submit"/>
            </form >
        </div>

    );
}
 
export default ImageSubmission;
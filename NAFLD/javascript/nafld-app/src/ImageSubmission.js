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

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };
    return ( 

        <div className="ImageSubmission">
            {image && <div className="ImageSelection"> Image Selection
                <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(image[0])}
                />
            </div>}
            
            
            <form  onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="file"
                    name="myImage"
                    // Event handler to capture file selection and update the state
                    onChange={(event) => {
                        console.log(event.target.files);
                        // only hook the first image for now
                        setSelectedImage(event.target.files) 
                    }}
                    />

                {/* <input type="submit" onSubmit={(e) =>handleSubmit(e)} /> */}
                <input type="submit"/>
            </form >
        </div>

    );
}
 
export default ImageSubmission;
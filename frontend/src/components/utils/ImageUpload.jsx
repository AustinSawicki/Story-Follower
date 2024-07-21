import api from "../../api";

const ImageUpload = async ({url, name, image, onUpdate = null}) => {
    const formData = new FormData();
    formData.append(`${name}`, image);
    
    return api.patch(`${url}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
        if(res.status === 200 && onUpdate){
            if(onUpdate){
                onUpdate()
            }  
        }
        else {
            console.log("Failed to update image.");
        }
    })
    .catch((err) => console.log(err));
}

export default ImageUpload;
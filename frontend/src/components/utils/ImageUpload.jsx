import api from "../../api";

const ImageUpload = async ({url, name, image}) => {
    const formData = new FormData();
    formData.append(`${name}`, image);
    
    return api.patch(`${url}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
        if (res.status !== 200) {
            console.log("Failed to update image.");
        }
    })
    .catch((err) => alert(err));
}

export default ImageUpload;
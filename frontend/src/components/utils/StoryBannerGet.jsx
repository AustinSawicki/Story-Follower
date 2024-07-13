import api from "../../api"

function StoryBannerGet({id, setBannerImage}){
    api.get(`/api/stories/${id}`)
            .then((res) => res.data)
            .then((data) => {
                if(data.banner) {
                    setBannerImage(data.banner);
                }
                else {
                    setBannerImage(`{VITE_API_URL}/media/placeholder/placehold-banner.jpg`)
                }
                
            })
            .catch((err) => alert(err));
}

export default StoryBannerGet
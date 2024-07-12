import { useState } from 'react';
import ImageUpload from './utils/ImageUpload';

function Popup({ ids, name, config, onClose, onUpdate, onDelete, imageChange = false, bannerChange = false}) {
    const [inputs, setInputs] = useState(config);
    const [image, setImage] = useState(null);
    const [banner, setBanner] = useState(null);

    const handleInputChange = (key, value) => {
        const newInputs = inputs.map(input => 
            input.hasOwnProperty(key) ? { [key]: value } : input
        );
        setInputs(newInputs);
    };

    const handleImageChange = (image) => {
        setImage(image);
    };
    const handleBannerChange = (banner) => {
        setBanner(banner);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lowerInputs = inputs.map(input => {
            const key = Object.keys(input)[0].toLowerCase();
            const value = Object.values(input)[0];
            return { [key]: value }
        });

        const updateData = lowerInputs.reduce((acc, curr) => {
            const key = Object.keys(curr)[0];
            acc[key] = curr[key];
            return acc;
        }, {});
        

        if (image) {
            await ImageUpload({ url: `/api/stories/${ids[0]}/update/`, name: 'image', image });
        }
        if (banner) {
            await ImageUpload({ url: `/api/stories/${ids[0]}/update/`, name: 'banner', image: banner });
        }

        onUpdate({ids, onClose, updateData})

    }

    const handleDelete = () => {
        onDelete()
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark_beige p-4 rounded shadow-lg w-1/3">
                <div className="flex justify-between items-center mb-4"> 
                    <h2 className="flex text-xl font-bold text-center">{`${name} Settings`}</h2>
                    <button onClick={onClose} className="text-gray-700 hover:text-gray-900">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    { bannerChange && (
                        <div className="mb-4">
                            <label className="font-semibold w-1/4 mr-10">Banner: </label>
                            <input type="file" onChange={(e) => handleBannerChange(e.target.files[0])} />
                        </div>
                    )}
                    { imageChange && (
                        <div className="mb-4">
                            <label className="font-semibold w-1/4 mr-12 ">Image: </label>
                            <input type="file" onChange={(e) => handleImageChange(e.target.files[0])} />
                        </div>
                    )}
                    {inputs.map((input, index) => {
                        const key = Object.keys(input)[0];
                        const value = Object.values(input)[0];
                        return (
                            <div key={index} className="mb-4 flex items-center">
                                 <label className={`font-semibold mr-2 ${key.toLowerCase() === "description" ? "block" : "inline-block"} min-w-[100px]`}>
                                    {key}
                                </label>
                                {key.toLowerCase() === "description" ? (
                                    <textarea
                                        className="rounded-md bg-transparent text-sm w-3/4 focus:ring-0 focus:outline-none focus:border-oak focus:border-2"
                                        value={value}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        rows="4"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="rounded-md bg-transparent w-3/4 focus:ring-0 focus:outline-none focus:border-oak focus:border-2"
                                        value={value}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Save Settings</button>
                        <button type="button" onClick={handleDelete} className="bg-red-500 text-white p-2 rounded mt-4">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Popup;
import { IoSettingsSharp } from "react-icons/io5";

function Settings({openPopup, size}) {
    return(
        <button
                onClick={openPopup}
                className={`absolute font-bold text-${size} top-2 right-2 text-gray-600 rounded-full hover:text-gray-700 cursor-pointer`}
        >
            <IoSettingsSharp />
        </button>
    )
}

export default Settings
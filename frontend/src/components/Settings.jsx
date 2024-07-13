import { RiFileSettingsFill } from "react-icons/ri";

function Settings({openPopup, size}) {
    return(
        <button
                onClick={openPopup}
                className={`absolute  font-bold text-${size} top-2 right-2 text-gray-400 rounded-full hover:text-gray-500 cursor-pointer`}
        >
            <RiFileSettingsFill />
        </button>
    )
}

export default Settings
import { RiFileSettingsFill } from "react-icons/ri";

function Settings({openPopup, size}) {
    return(
        <button
                onClick={openPopup}
                className={`absolute font-bold text-${size} top-2 right-2 text-button rounded-full hover:text-button-dark cursor-pointer`}
        >
            <RiFileSettingsFill />
        </button>
    )
}

export default Settings
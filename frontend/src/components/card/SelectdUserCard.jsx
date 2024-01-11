import {IoIosClose} from "react-icons/io";

function SelectdUserCard(props) {
    return (
        <div className='flex bg-[#E9EDEF] w-fit items-center space-x-2 text-sm rounded-xl my-4 mx-1'>
            <div className='h-7 w-7 rounded-full overflow-hidden'>
                <img src={props.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt=''/>
            </div>
            <div>
                {props.name}
            </div>
            <div onClick={props.remove} className='rounded-full hover:bg-white text-xl cursor-pointer text-[#667781] m-1'>
                <IoIosClose />
            </div>
        </div>)
}

export default SelectdUserCard
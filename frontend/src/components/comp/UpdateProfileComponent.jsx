import {FaArrowLeft} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import userSlice from "../../redux/slice/UserSlice";
import {updateUser} from "../../api/UserApi";
import {HiMiniCamera} from "react-icons/hi2";
import {uploadToCloudinary} from "../../api/ApiUtils";
import {useState} from "react";
import {HiPencil} from "react-icons/hi";
import {IoCheckmarkSharp} from "react-icons/io5";



function UpdateProfileComponent(props) {

    const dispatch = useDispatch();
    let userData = useSelector(state => {
        return state.user
    })
    const [fullName, setFullName] = useState(userData.fullName);
    const [profilePic, setProfilePic] = useState(userData.image);
    const [statusText, setStatusText] = useState(userData.statusText);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingStatus, setIsEditingStatus] = useState(false);

    const updateProfilePic = (img) => {
        console.log(img)
        uploadToCloudinary(img).then(url => {
            updateUser('IMAGE', url).then(res => {
                dispatch(userSlice.actions.updateUser({image: url}))
                setProfilePic(url)
            })
        }).catch(err => {
            //TODO: Open snackbar
        })
    }
    const updateFullName = () => {
        updateUser('FULL_NAME', fullName).then(res => {
            dispatch(userSlice.actions.updateUser({fullName: fullName}))
            setIsEditingName(false)
        })
    }
    const updateStatusText = () => {
        updateUser('STATUS_TEXT', statusText).then(res => {
            dispatch(userSlice.actions.updateUser({statusText: statusText}))
            setIsEditingStatus(false)
        })
    }

    return (
        <div className='flex flex-col'>
            <div className='h-[14.5%] bg-[#008069] flex items-end space-x-8 text-[1.1875rem] px-8 py-5 text-white'>
                <FaArrowLeft className='mb-1 cursor-pointer' onClick={props.close}/>
                <div>Profile</div>
            </div>
            <div className='flex flex-col w-full items-center bg-[#F0F2F5] h-full'>
                <label htmlFor='profile-pic' className='py-7 w-full flex justify-center cursor-pointer'>
                    <img
                        src={profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt=''
                        className='h-52 w-52 rounded-full flex flex-col justify-center items-center text-white overflow-hidden bg-[#707E87]'/>
                </label>
                <input id='profile-pic' type='file' className='hidden' onChange={(e) => {
                    console.log("onchange pic", e)
                    updateProfilePic(e.target.files[0])}}/>
                <div className='flex flex-col w-full bg-white py-4 px-7 space-y-3 shadow-sm'>
                    <div className='text-[#008069] font-medium text-[0.875rem]'>Your name</div>
                    <div>
                        {!isEditingName && <div className='flex justify-between py-1'>
                            <div>{fullName}</div>
                            <div onClick={() => setIsEditingName(true)}
                                 className='cursor-pointer text-[#8697A0] text-2xl'
                            ><HiPencil/></div>
                        </div>}
                        {isEditingName && <div className='flex justify-between border-b-2 border-b-[#05A884] py-1'>
                            <div className='w-full'>
                                <input value={fullName}
                                       className='focus-visible:outline-none w-full'
                                       onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div onClick={updateFullName}
                                 className='cursor-pointer text-[#8697A0] text-2xl'
                            ><IoCheckmarkSharp/></div>
                        </div>}
                    </div>
                </div>
                <div className='text-[0.875rem] text-[#667781] py-6 px-8'>
                    This is not your username or pin. This name will be visible to your WhatsApp contacts.
                </div>
                <div className='flex flex-col w-full bg-white py-4 px-7 space-y-3 shadow-sm'>
                    <div className='text-[#008069] font-medium text-[0.875rem]'>About</div>
                    <div>
                        {!isEditingStatus && <div className='flex justify-between py-1'>
                            <div>{statusText}</div>
                            <div onClick={() => setIsEditingStatus(true)}
                                 className='cursor-pointer text-[#8697A0] text-2xl'
                            ><HiPencil/></div>
                        </div>}
                        {isEditingStatus && <div className='flex justify-between border-b-2 border-b-[#05A884] py-1'>
                            <div className='w-full'>
                                <input value={statusText}
                                       className='focus-visible:outline-none w-full'
                                       onChange={(e) => setStatusText(e.target.value)}
                                />
                            </div>
                            <div onClick={updateStatusText}
                                 className='cursor-pointer text-[#8697A0] text-2xl'
                            ><IoCheckmarkSharp/></div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>)
}

export default UpdateProfileComponent;
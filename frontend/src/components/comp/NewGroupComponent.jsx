import {FaArrowLeft, FaArrowRight, FaCheck} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import userSlice from "../../redux/slice/UserSlice";
import {getAllUsersInfoApi, updateUser} from "../../api/UserApi";
import {useEffect, useState} from "react";
import ChatCard from "../card/ChatCard";
import SelectdUserCard from "../card/SelectdUserCard";
import {HiMiniCamera} from "react-icons/hi2";
import {IoIosArrowForward, IoMdCheckmark} from "react-icons/io";
import {createChatApi} from "../../api/ChatApi";
import chatSlice from "../../redux/slice/ChatSlice";
import {uploadToCloudinary} from "../../api/ApiUtils";



function NewGroupComponent(props) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isShowingCreateGroupInfo, setIsShowingCreateGroupInfo] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState(undefined);
    const [selectedUsers, setSelectedUsers] = useState({users: new Set()});
    const [groupName, setGroupName] = useState(undefined);
    const [groupImage, setGroupImage] = useState(undefined);
    let allUsers = useSelector(state => {
        return state.user.otherUsersData
    })
    if(!allUsers) {
        getAllUsersInfoApi().then(data => {
            console.log(data)
            allUsers = data
            dispatch(userSlice.actions.updateUser({otherUsersData: data}))
            setIsLoading(false)
            setSearchedUsers({users: new Set(data)})
        })
    } else if(!searchedUsers) {
        setSearchedUsers({users: new Set(allUsers)})
        setIsLoading(false)
    }

    const handleSearch = (query) => {
        let newSearchedUsers = new Set()
        allUsers.map(user => {
            if (!selectedUsers.users.has(user) && user.fullName?.indexOf(query) > -1) {
                newSearchedUsers.add(user)
            }
        })
        setSearchedUsers({...searchedUsers, users: newSearchedUsers})
    }
    const addUser = (user) => {
        console.log(selectedUsers)
        selectedUsers.users.add(user)
        setSelectedUsers({...selectedUsers, users: selectedUsers.users})
        searchedUsers.users.delete(user)
        setSearchedUsers({...searchedUsers, users: searchedUsers.users})
    }
    const removeUser = (user) => {
        console.log(selectedUsers)
        selectedUsers.users.delete(user)
        setSelectedUsers({...selectedUsers, users: selectedUsers.users})
        searchedUsers.users.add(user)
        setSearchedUsers({...searchedUsers, users: searchedUsers.users})
    }
    const showCreateGroupInfo = () => {
        setIsShowingCreateGroupInfo(true)
    }

    const createGroup = () => {
        let memberIds = Array.from(selectedUsers.users.values()).map(value => value.id)
        console.log("creating group",groupName, "with members", selectedUsers, memberIds)
        createChatApi('GROUP_CHAT', memberIds, groupName, groupImage).then(data => {
            console.log(data)
            dispatch(chatSlice.actions.addChat(data))
            props.addNewGroup({
                chatName: data.groupName,
                image: data.groupImage,
                id: data.chatId,
                chatType: data.type
            })
            props.close()
        })
    }
    const addgroupIcon = (img) => {
        uploadToCloudinary(img).then(url => {
            setGroupImage(url)
        }).catch(err => {
            //TODO: Open snackbar
        })
    }

    return (
        <div className='flex flex-col'>
            <div className='h-[14.5%] bg-[#008069] flex items-end space-x-8 text-[1.1875rem] px-8 py-5 text-white'>
                {!isShowingCreateGroupInfo && <FaArrowLeft className='mb-1 cursor-pointer' onClick={props.close}/>}
                {isShowingCreateGroupInfo && <FaArrowLeft className='mb-1 cursor-pointer'
                                                          onClick={() => setIsShowingCreateGroupInfo(false)}/>}
                <div>{isShowingCreateGroupInfo?'New group':'Add group members'}</div>
            </div>
            {isLoading && <div>Loading . . .</div>}
            {!isLoading &&
                <div className='h-full flex'>
                    {!isShowingCreateGroupInfo && <div className='h-full flex flex-col w-full'>
                        <div className='flex flex-wrap'>
                            {Array.from(selectedUsers.users).map(user => {
                                return <div>
                                    <SelectdUserCard image={user.image} name={user.fullName} remove={() => removeUser(user)}/>
                                </div>
                            })}
                        </div>
                        <div className='flex items-end h-[60px] border-b-[1px] mx-7 mb-4 text-md'>
                            <input placeholder='Search name or number'
                                   className='placeholder:text-[#667781] focus-visible:outline-none'
                                   onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            {Array.from(searchedUsers.users).map(user => {
                                return <div onClick={() => addUser(user)}
                                            className='cursor-pointer'>
                                    <ChatCard statusText={user.statusText || "Hey there! I'm using whatsapp"}
                                              name={user.fullName}
                                              image={user.image}
                                    /></div>
                            })}
                        </div>
                        {selectedUsers.users.size > 0 &&
                            <div className='w-full h-full min-h-32 bg-[#F0F2F5] flex items-center justify-center'>
                                <div className='bg-[#05A884] h-12 w-12 rounded-full flex items-center justify-center text-white text-xl shadow-md cursor-pointer'
                                     onClick={showCreateGroupInfo}>
                                    <FaArrowRight />
                                </div>
                            </div>}
                    </div>}
                    {isShowingCreateGroupInfo && <div className='flex flex-col w-full space-y-3 items-center bg-[#F0F2F5]'>
                        <div className='flex flex-col w-full items-center bg-white'>
                            <label htmlFor='group-icon' className='py-7 w-full flex justify-center cursor-pointer'>
                                <div className='h-52 w-52 rounded-full flex flex-col justify-center items-center text-white overflow-hidden bg-[#707E87]'>
                                    {!groupImage && <div className='w-full flex flex-col items-center'>
                                    <HiMiniCamera className=' text-3xl'/>
                                    <div className='text-[0.8rem] w-[40%] text-center pt-2'>ADD GROUP ICON</div>
                                    </div>}
                                    {groupImage && <div>
                                        <img src={groupImage} alt=''/>
                                    </div>}
                                </div>
                                    </label>
                                    <input id='group-icon' type='file' className='hidden' onChange={(e)=> {addgroupIcon(e.target.files[0])}}/>
                            <input type='text' placeholder='Group Subject (Optional)'
                                   onChange={(e) => setGroupName(e.target.value)}
                                   className='focus-visible:outline-none border-b-2 placeholder:text-[#888C8F]
                               border-[#667781] w-[80%] py-2 mt-6 mb-12'
                            />
                        </div>
                        <div className='bg-white w-full py-4 px-7 flex items-center shadow-sm text-[#8697A0]'>
                            <div className='w-full'>
                                <div className='text-black'>Disappearing messages</div>
                                <div>Off</div>
                            </div>
                            <IoIosArrowForward />
                        </div>
                        <div className='w-full h-full min-h-32 bg-[#F0F2F5] flex items-center justify-center'>
                                <div className='bg-[#05A884] h-12 w-12 rounded-full flex items-center justify-center text-white text-3xl shadow-md cursor-pointer'
                                     onClick={createGroup}>
                                    <IoMdCheckmark />
                                </div>
                        </div>
                    </div>}
                </div>}
        </div>)
}

export default NewGroupComponent;
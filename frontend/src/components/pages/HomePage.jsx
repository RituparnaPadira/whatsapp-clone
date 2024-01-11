import {MdFilterList, MdOutlineGroups, MdOutlineSearch} from "react-icons/md";
import {TbPlaystationCircle} from "react-icons/tb";
import {IoChatbubbleEllipsesOutline} from "react-icons/io5";
import {LuMessageSquarePlus} from "react-icons/lu";
import {HiMiniEllipsisVertical} from "react-icons/hi2";
import ChatCard from "../card/ChatCard";
import {useEffect, useState} from "react";
import ChatComponent from "../comp/ChatComponent";
import SnackBar from "../card/SnackBar";
import {useDispatch, useSelector} from "react-redux";
import {getUserDetailsApi, searchUsersApi} from "../../api/UserApi";
import userSlice from "../../redux/slice/UserSlice";
import {getAllChatsInfoApi, getOrCreateChatApi} from "../../api/ChatApi";
import chatSlice from "../../redux/slice/ChatSlice";
import NewGroupComponent from "../comp/NewGroupComponent";
import UpdateProfileComponent from "../comp/UpdateProfileComponent";
import Stomp from "stompjs";
import SockJs from 'sockjs-client/dist/sockjs';

function HomePage() {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({})
    const [chats, setChats] = useState(undefined);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [searchUsersList, setSearchUsersList] = useState([]);
    const [curChat, setCurChat] = useState(undefined);
    const [showMainMenuPopup, setShowMainMenuPopup] = useState(false);
    const [showLeftSideDefault, setShowLeftSideDefault] = useState(true);
    const [isCreatingingNewGroup, setIsCreatingingNewGroup] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [snackBar, setSnackBar] = useState({message: 'Logged in successfully', open: true});
    const [newMessagesCount, setNewMessagesCount] = useState({});
    const [lastMessageMap, setLastMessageMap] = useState({});
    const [subscriptions, setSubscriptions] = useState([]);
    const userData = useSelector(state => {
        return state.user
    })
    const chatsData = useSelector(state => {
        return state.chats
    })
    const initializeNewMessages = (data) =>{
        data?.forEach(oneChat => {
            let obj = {}
            let last = {}
            obj[oneChat.id] = 0
            last[oneChat.id] = oneChat.lastMessage
            setLastMessageMap(prevState => {return {...prevState, ...last}})
            setNewMessagesCount(prevState => {return {...prevState, ...obj}})
            console.log(last, obj, lastMessageMap, newMessagesCount)
        })
        let socket = new SockJs('http://localhost:8080/ws')
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame){
            data?.forEach(oneChat => {
                const subscription = stompClient.subscribe("/group/"+oneChat.id, (result) => {
                    setNotifications(oneChat, result)
                })
                setSubscriptions(prevState => {
                    return [...prevState, subscription]
                })
            })
        })
    }
    useEffect(() => {
        return () => {
            subscriptions.forEach(subscription => subscription.unsubscribe());
        };
    }, [subscriptions]);


    useEffect(() => {if(userData.id && !user.id) {
        setUser({
            id: userData.id,
            fullName: userData.fullName,
            image: userData.image,
            statusText: userData.statusText
        })
    } else if(!user.id) {
        getUserDetailsApi().then(data => {
            console.log("userData", data)
            let updatedUser = {
                id: data.id,
                fullName: data.fullName,
                image: data.image,
                statusText: data.statusText
            }
            setUser(updatedUser)
            dispatch(userSlice.actions.updateUser(updatedUser))
        }).catch(err => {
            window.location.href='/auth'
        })
    }
        if(!chats && chatsData.length>0) {
            console.log("Chats info", chatsData)
            setChats(chatsData)
            initializeNewMessages(chatsData)
            setIsLoading(false)
        } else if(!chats) {
            getAllChatsInfoApi().then(data => {
                console.log("Chats info", data)
                setChats(data)
                dispatch(chatSlice.actions.setAllChats(data))
                initializeNewMessages(data)
                setIsLoading(false)
            }).catch(err => {
                window.location.href='/auth'
            })
        }

    }, [chats, chatsData, dispatch, initializeNewMessages, user.id, userData.fullName, userData.id, userData.image, userData.statusText]);


    const setNotifications = (oneChat, result) => {
        setCurChat((curChatprevState) => {
            if(curChatprevState?.id!==oneChat.id) {
                setNewMessagesCount(prevState => {
                    console.log(prevState)
                    let newCountVal = {}
                    newCountVal[oneChat.id] = Number(prevState[oneChat.id]) + 1
                    return {...prevState, ...newCountVal}
                })
            }
            return curChatprevState
        })
        let newMessageVal = {}
        newMessageVal[oneChat.id] = JSON.parse(result.body)
        setLastMessageMap(prevState => {
            return {...prevState, ...newMessageVal}
        })
    }

    const handleUsersSearchQuery = (query) => {
        if(query && query.length>0) {
            searchUsersApi(query).then(data => {
                console.log("querydata", data)
                setSearchUsersList(data)
                setIsSearchingUsers(true)
            })
        } else {
            setIsSearchingUsers(false)
        }
    }

    const handleUserCardClick = (clickedUser, evt) => {
        console.log("clicked user", clickedUser)
        getOrCreateChatApi(clickedUser.id).then(res => {
            console.log(res)
            if(res.status === 201) {
                dispatch(chatSlice.actions.addChat(res.data))
                setChats([...chats, res.data])
            }
            handleChatCardClick(res.data, evt)
            setIsSearchingUsers(false)
        })
    }
    const handleChatCardClick = (clickedChat, evt) => {
        console.log("clicked chat", clickedChat, evt.target.parentNode.parentNode.parentNode)
        document.getElementsByClassName('current-chat')[0]?.classList.remove('current-chat')
        evt.target.parentNode.parentNode.parentNode.classList.add('current-chat')
        setCurChat(clickedChat)
        let newCount = {}
        newCount[clickedChat.id] = 0
        setNewMessagesCount({...newMessagesCount, ...newCount})
    }
    const openMainMenu = () => {
        setShowMainMenuPopup(true)
        setTimeout(() => {
            document.body.addEventListener('click', function a(){
                setShowMainMenuPopup(false)
                document.body.removeEventListener('click',a)
            })
        },200)
    }

    const openCreateNewGroup = () => {
        setShowLeftSideDefault(false)
        setIsCreatingingNewGroup(true)
    }
    const closeCreateNewGroup = () => {
        setShowLeftSideDefault(true)
        setIsCreatingingNewGroup(false)
    }
    const openUpdateProfile = () => {
        setShowLeftSideDefault(false)
        setIsUpdatingProfile(true)
    }
    const closeUpdateProfile = () => {
        setShowLeftSideDefault(true)
        setIsUpdatingProfile(false)
    }
    const addNewGroup = (group) => {
        console.log("add new grp")
        setChats([...chats, group])
    }
    const logout = () => {
        localStorage.clear()
        window.location = '/auth'
    }

    return (
        <div className="h-full">
            <div className="grid h-full grid-rows-[15%_85%]">
                <div className="bg-[#05A884] grid"></div>
                <div className="bg-[#D9DBD6]"></div>
            </div>
            {(isLoading || !chats) && <div className='h-full w-full bg-white absolute top-0 left-0 p-5'>Loading . . .</div>}
            {!isLoading && chats && <div className="absolute h-[96vh] w-[98vw] bg-white top-[2vh] left-[1vw] grid grid-cols-[30%_70%]">
                {/* Left side starts */}
                {showLeftSideDefault && <div className="left grid grid-rows-[60px_58px_auto]">
                    <div className="bg-[#F0F2F5] flex items-center">
                        <div className="w-[20%] ml-4">
                            <img src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                 onClick={openUpdateProfile}
                                 alt="" className="rounded-full h-10 w-10 overflow-hidden cursor-pointer"/>
                        </div>
                        <div className="nav-list w-[80%] flex text-2xl space-x-6 text-[#54656F] font-extrabold justify-end mr-6">
                            <MdOutlineGroups className='cursor-pointer'/>
                            <TbPlaystationCircle className='cursor-pointer' />
                            <IoChatbubbleEllipsesOutline className='cursor-pointer' />
                            <LuMessageSquarePlus className='cursor-pointer' />
                            <HiMiniEllipsisVertical className='cursor-pointer' onClick={() => openMainMenu()}/>
                        </div>
                        {showMainMenuPopup && <div className='absolute top-14 left-52 w-[204px] bg-white text-[0.91rem] text-[#3B4A54] flex flex-col py-3 cursor-pointer shadow-md shadow-gray-400'>
                            <div onClick={openCreateNewGroup} className='hover:bg-[#F5F6F6] py-[9px] px-6'>New group</div>
                            <div className='hover:bg-[#F5F6F6] py-[9px] px-6'>New Community</div>
                            <div className='hover:bg-[#F5F6F6] py-[9px] px-6'>Starred messages</div>
                            <div className='hover:bg-[#F5F6F6] py-[9px] px-6'>Select chats</div>
                            <div className='hover:bg-[#F5F6F6] py-[9px] px-6'>Settings</div>
                            <div onClick={logout} className='hover:bg-[#F5F6F6] py-[9px] px-6'>Log out</div>
                        </div>}
                    </div>
                    <div className="flex border border-[#F0F2F5] justify-center items-center text-xl">
                        <div className="flex w-full bg-[#F0F2F5] m-2 h-[2.5rem] rounded-xl overflow-hidden items-center justify-between">
                            <MdOutlineSearch className="text-[#54656F] m-6"/>
                            <input type="text"
                                   onChange={(e) => handleUsersSearchQuery(e.target.value)}
                                   placeholder="Search or start new chat"
                                   className="w-[80%] bg-[#F0F2F5] h-full cursor-text focus-visible:outline-none text-sm placeholder:text-[#667781]"/>
                        </div>
                        <div className="w-[40px] text-center text-[#8697A0]">
                            <MdFilterList />
                        </div>
                    </div>
                    <div className="custom-scroll-bar overflow-y-scroll h-[80vh] cursor-pointer">
                        {!isSearchingUsers && chats.map(chat => {
                            return <div onClick={(e) => handleChatCardClick(chat, e)}>
                                <ChatCard
                                name={chat.chatName}
                                image={chat.image}
                                newMessages={newMessagesCount[chat.id]}
                                lastMessage={lastMessageMap[chat.id]}/></div>
                        })}
                        {isSearchingUsers && searchUsersList.map(searchedUser => {
                            return <div onClick={(e) => handleUserCardClick(searchedUser, e)}><ChatCard
                                name={searchedUser.fullName}
                                image={searchedUser.image}
                                lastMessage={searchedUser.statusText}/>
                            </div>
                        })}
                    </div>
                </div>}
                {isCreatingingNewGroup && <NewGroupComponent close={() => closeCreateNewGroup()} addNewGroup={addNewGroup}/>}
                {isUpdatingProfile && <UpdateProfileComponent close={() => closeUpdateProfile()}/>}
                {/* Left side ends */}

                {/* Right side starts */}
                {!curChat && <div className="right bg-[#F8FAFB]">
                    <div>
                        <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202111/Screenshot_2021-11-12_at_1.51._0_1200x768.png" alt=""/>
                    </div>
                </div>}
                {curChat && <ChatComponent chat={curChat}/>}
                {/* Right side ends */}
            </div>}
            {snackBar.open && <div className='absolute bottom-10 left-10'>
                <SnackBar message={snackBar.message}
                          close={() => setSnackBar({...snackBar, open: false})}
                          type="success"
                />
            </div>}
        </div>)
}

export default HomePage
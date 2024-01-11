import {MdOutlineSearch} from "react-icons/md";
import {HiMiniEllipsisVertical} from "react-icons/hi2";
import {BsEmojiSmile} from "react-icons/bs";
import {FaPlus} from "react-icons/fa";
import MessageCard from "../card/MessageCard";
import {createMessageApi, getAllMessagesApi} from "../../api/MessageApi";
import {useEffect, useState} from "react";
import {IoMdSend} from "react-icons/io";
import {useSelector} from "react-redux";
import SockJs from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';

function ChatComponent(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState(undefined);
    const [chatId, setChatId] = useState(props.chat.id);
    const [newMessageContent, setNewMessageContent] = useState('');

    if(!messages || props.chat.id!==chatId) {
        getAllMessagesApi(props.chat.id).then(data => {
            //console.log(data)
            setMessages(data.reverse())
            setIsLoading(false)
            setChatId(props.chat.id)
        }).catch(e => {
            window.location.href='/'
        })
    }
    const currentUserId = useSelector(state => {
        return state.user.id
    })

    let socket = new SockJs('http://localhost:8080/ws')
    let subscriptionUrl = "/group/"+props.chat.id
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame){
        stompClient.subscribe(subscriptionUrl, (result) => {
            let newMessage = JSON.parse(result.body)
            console.log(newMessage,"subs")
            if(messages){
                setMessages([newMessage, ...messages])
            }
        })
    })


    const sendMessage = () => {
        console.log("sending")
        if(newMessageContent && newMessageContent.length>0) {
            createMessageApi(props.chat.id, newMessageContent).then(res => {
                console.log("res", res)
                setMessages([res, ...messages])
                stompClient.send("/app/message",{}, JSON.stringify(res))
                setNewMessageContent("")
            }).catch((e) => {
                window.location.href='/'
            })
        }
    }




    useEffect(() => {
        const keyboardEvent = (e) => {
        //console.log(e)
        if(e.key==='Enter'){
            sendMessage()
        }
    }
        const inputElement = document.getElementById("send-message-text-box");

        if (inputElement) {
            inputElement.addEventListener('keyup', keyboardEvent);

            // Cleanup the event listener when the component is unmounted
            return () => {
                inputElement.removeEventListener('keyup', keyboardEvent);
            };
        }
    }, [sendMessage]);







    return(
        <div className="flex flex-col overflow-hidden">
            <div className="bg-[#F0F2F5] h-[60px] flex items-center w-full">
                <div className="w-[7%] ml-4">
                    <img src={props.chat.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                         alt="" className="rounded-full h-11 w-11 overflow-hidden"/>
                </div>
                <div className="w-[80%]">
                    <div>
                        {props.chat.chatName || ''}
                    </div>
                    <div className="text-[#667781] text-[0.8125rem] truncate overflow-hidden">
                        {props.chat.chatType==="DIRECT_CHAT"?'online':'Rituparna, +91 6362 520 223, +91 78299 35899, +91 78994 68601, +91 81057 64547, +91 6362 520 223, +91 78299 35899, +91 78994 68601, +91 81057 64547'}
                    </div>
                </div>
                <div className="flex w-[15%] space-x-2">
                    <MdOutlineSearch className="text-[#54656F] m-6 text-2xl"/>
                    <HiMiniEllipsisVertical  className="text-[#54656F] m-6 text-2xl"/>
                </div>
            </div>
            {!isLoading && <div className="h-[85%] bg-[#F0EBE3] overflow-y-scroll flex flex-col-reverse">
                {messages?.map((message) => {
                    return <MessageCard
                        message={message}
                        type={currentUserId===message.senderId?"outgoing":"incoming"}  />})}
            </div>}
            <div className="bg-[#F0F2F5] h-[60px] flex items-center">
                <BsEmojiSmile  className="text-[#54656F] ml-5 text-2xl"/>
                <FaPlus className="text-[#54656F] m-4 text-2xl"/>
                <div className="w-[90%] m-[5px]">
                <input id="send-message-text-box" className="h-10 w-full px-4 rounded-xl focus-visible:outline-none"
                       value={newMessageContent}
                       onChange={(e)=> setNewMessageContent(e.target.value)}
                       autoComplete="off"
                       placeholder="Type a message"/>
                </div>
                <IoMdSend onClick={() => sendMessage()} className="text-[#54656F] m-5 text-3xl cursor-pointer" />
            </div>
        </div>
    )
}

export default ChatComponent;
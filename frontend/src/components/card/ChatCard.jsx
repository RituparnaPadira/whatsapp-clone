import {convertTime} from "../../utils/timeUtils";

function ChatCard(props) {
    return (
        <div className="border border-[#E9EDEF] border-t-0 h-[4.5rem] flex items-center w-full">
            <div className="w-[70px] ml-4">
                <img src={props.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt=""
                     className="rounded-full h-12 w-12 overflow-hidden"/>
            </div>
            <div className="flex flex-col h-full justify-center w-[75%] mr-4">
                <div className="h-[50%] flex items-end justify-between">
                    <div className={`text-[16px] ${props.newMessages>0?'font-semibold':''}`}>{props.name}</div>
                    {props.lastMessage && <div className={`text-[12px] ${props.newMessages>0?'text-[#1DA855] font-semibold':'text-[#667781]'}`}>{convertTime(props.lastMessage.timestamp)}</div>}
                </div>
                {props.lastMessage && <div className="h-[50%] overflow-hidden flex items-start justify-between">
                    <div className={`${props.newMessages>0?'':'text-[#667781]'} text-[14px] truncate w-auto`}>
                        {props.lastMessage?.senderName || 'Someone'}: {props.lastMessage?.content || 'Hi, how are you'}
                    </div>
                    {props.newMessages>0 && <div className="bg-[#24D366] text-white h-5 w-auto rounded-full p-1 px-1.5 pt-0.5 text-[12px] ml-2 font-semibold text-center">
                        {props.newMessages}
                    </div>}
                </div>}
                {props.statusText && <div className="h-[50%] overflow-hidden flex items-start justify-between">
                    <div className="text-[#667781] text-[14px] truncate w-auto">
                        {props.statusText}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ChatCard
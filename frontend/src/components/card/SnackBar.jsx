import {IoMdClose} from "react-icons/io";
import {TbAlertTriangle} from "react-icons/tb";
import {VscError} from "react-icons/vsc";
import {LuCheckCircle} from "react-icons/lu";
import {HiOutlineInformationCircle} from "react-icons/hi";

function snackBar(props) {

    const types = {
        success: {
            color: 'bg-green-600',
            symbol: <LuCheckCircle />
        },
        error: {
            color: 'bg-red-700',
            symbol: <VscError />
        },
        alert: {
            color: 'bg-[#FF9800]',
            symbol: <TbAlertTriangle />
        },
        info: {
            color: 'bg-blue-500',
            symbol: <HiOutlineInformationCircle />
        }
    }

    const color = types[props.type]?.color || 'bg-black'
    const symbol = types[props.type]?.symbol || ''

        setTimeout(() => {
        props.close();
    }, 4000)


    return (
        <div className="max-w-[600px] h-fit min-w-[100px] z-10 bg-black rounded-md text-white flex items-center overflow-hidden">
            <div className={`w-[25px] self-stretch mr-4 ${color}`}></div>
            <div>{symbol}</div>
            <div className='text-left w-full p-3'>{props.message}</div>
            <IoMdClose  className='text-2xl mx-4 font-extrabold cursor-pointer' onClick={props.close}/>
        </div>
    )
}
export default snackBar
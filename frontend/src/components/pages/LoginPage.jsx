import {useState} from "react";
import {MdError} from "react-icons/md";
import SnackBar from "../card/SnackBar";
import { loginApi, signupApi} from "../../api/AuthApi";

function LoginPage() {

    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState({name:false, email:false, password: false});
    const [formData, setFormData] = useState({name:'', email:'', password: ''});
    const [snackBar,setSnackBar] = useState({message: '', isOpen: false})
    console.log("rendered", formData, error)

    const signin = () => {
        if(formData.email?.length<1) {
            setError({...error, email: true})
            return
        }
        if(formData.password.length<1) {
            setError({...error, password: true})
            return;
        }
        if(!error.email && !error.password) {
            loginApi(formData.email, formData.password).then(res => {
                console.log("Login page token", res)
                if(res.jwt) {
                    console.log(res.jwt)
                    localStorage.setItem("token", res.jwt)
                    window.location.href = '/'
                } else {
                    let errorMessage = res.errorMessage || "Some error occurred!"
                    openSnackBar(errorMessage)
                }
            }).catch(error => {
                openSnackBar(error.toString())
            })
        }
    }

    const signup = async () =>{
        if(formData.name?.length<1) {
            setError({...error, name: true})
            return
        }
        if(formData.email?.length<1) {
            setError({...error, email: true})
            return
        }
        if(formData.password.length<1) {
            setError({...error, password: true})
            return;
        }
        if(error.email || error.password || error.name) {
            return
        }
        if(!error.name && !error.email && !error.password) {
            signupApi(formData.name, formData.email, formData.password).then(res => {
                console.log("Login page token", res)
                if(res.jwt) {
                    localStorage.setItem("token", res.jwt)
                    window.location.href = '/'
                } else {
                    let errorMessage = res.errorMessage || "Some error occurred!"
                    openSnackBar(errorMessage)
                }
            }).catch(error => {
                openSnackBar(error.toString())
            })
        }
    }

    const valChanged = (e, attr) => {
        let newFormData = {}
        newFormData[attr] = e.target.value || ''
        setFormData({...formData, ...newFormData})
        if(error[attr]) {
            let newError = {}
            newError[attr] = false;
            setError({...error, ...newError})
            console.log(formData, error)
        }
    }

    const openSnackBar = (message) => {
        setSnackBar({message: message, isOpen: true})
    }

    return (
        <div className='bg-[#F0EBE3] h-full relative'>
            <div className='w-[40%] bg-white flex flex-col border-[20px] border-[#EFF1F3] absolute top-20 left-[30%]'>
                <div className='bg-[#EFF1F3] text-[#555555] text-center p-4 text-[20px] font-extrabold'>
                    Login or create new account
                </div>
                <div className='flex bg-[#0CC144] text-white text-[1.5rem]'>
                    <button onClick={() => setIsLogin(true)} className={`w-[50%] p-[12px] font-bold ${isLogin?'bg-white border-t-4 border-[#0CC144] text-[#555555]':''}`}>Sign in</button>
                    <button onClick={() => setIsLogin(false)} className={`w-[50%] p-[12px] font-bold ${!isLogin?'bg-white border-t-4 border-[#0CC144] text-[#555555]':''}`}>Sign up</button>
                </div>
                {!isLogin && <div  className='mt-8 mx-16'>
                    <input className=' p-3 w-full border-2 focus-visible:outline-none'
                           type="text" placeholder="Full name*"
                           onChange={(e) => valChanged(e, 'name')}
                    />
                    {error.name && <div className='text-xs text-red-700 font-semibold flex mt-2 ml-2'>
                        <MdError className='text-sm mr-1'/> Full name cannot be empty
                    </div>}
                </div>}
                <div className='mt-8 mx-16'>
                    <input className='w-full p-3 border-2 focus-visible:outline-none'
                           type="email" placeholder="E-mail*"
                           onChange={(e) => valChanged(e, 'email')}
                    />
                    {error.email && <div className='text-xs text-red-700 font-semibold flex mt-2 ml-2'>
                        <MdError className='text-sm mr-1'/> E-mail cannot be empty
                    </div>}
                </div>
                <div className='mt-8 mx-16'>
                    <input  className='w-full p-3 border-2 focus-visible:outline-none'
                            type="password" placeholder="Password*"
                            onChange={(e) => valChanged(e, 'password')}
                    />
                    {error.password && <div className='text-xs text-red-700 font-semibold flex mt-2 ml-2'>
                        <MdError className='text-sm mr-1'/> Password cannot be empty
                    </div>}
                </div>
                {isLogin && <button onClick={() => signin()}
                                    className='w-[80%] self-center bg-[#0CC144] my-10 text-white text-[1.5rem] p-[12px] font-bold rounded-2xl'>
                    Sign in</button>}
                {!isLogin && <button onClick={() => signup()}
                                     className='w-[80%] self-center bg-[#0CC144] my-10 text-white text-[1.5rem] p-[12px] font-bold rounded-2xl'>
                    Sign up</button>}
            </div>
            {snackBar.isOpen && <div className='absolute top-[20px] right-[20px]'>
                <SnackBar message={snackBar.message}
                          type="error"
                          close={() => setSnackBar({...snackBar, isOpen: false})}
                />
            </div>}
        </div>
    )
}

export default LoginPage
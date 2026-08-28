import { TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router"

import googlePng from "../../assets/auth/google.png"
import { loginUserReq } from "../../reducer/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../../store/store"
import { useEffect } from "react"


export default function Login() {
    const token = localStorage.getItem('token')

    const authData = useSelector((store:RootState) => store.auth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit
    } = useForm({
        defaultValues:{
            userName: '',
            password: ''
        }
    })
    

    const submit = async(data:any) => {
        dispatch(loginUserReq(data))
    }

    useEffect(() => {
        if(Boolean(token)) navigate('/')
    },[token])
    return(
        <>

            <div className="flex flex-col gap-10 p-5 lg:px-0 py-10 lg:py-25 max-w-300 m-auto items-center">
                <div className="flex flex-col gap-3">
                    {
                        authData.isLoading ? <h1 className="self-center">Loading</h1> 
                        : ""
                    }
                    <h1 className="text-2xl lg:text-5xl font-medium">Log in to Exclusive</h1>
                    <p>Enter your details below</p>
                </div>
                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
                    <TextField {...register("userName")} required sx={{width: 400}} label="User Name"/>
                    <TextField {...register("password")} required sx={{width: 400}} label="Password"/>
                    <p className="py-3 text-red-600 font-semibold self-center cursor-pointer">Forget Password?</p>
                    <button type="submit" className="cursor-pointer bg-[#DB4444] text-white w-full p-3 font-bold rounded-sm">Login</button>
                    <button className="cursor-pointer flex items-center justify-center gap-3 border border-[#00000066] w-full p-3 rounded-sm"> <img src={googlePng} alt="" /> Sign up with Google</button>
                </form>
                <div className="flex items-center justify-center gap-5">
                    <p>Not Have account?</p>
                    <NavLink className="font-semibold border-b" to='/register'>Sign Up</NavLink>
                </div>
            </div>

        </>
    )
}

import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";


import googlePng from '../../assets/auth/google.png'
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { loginUserReq, regUserReq } from "../../reducer/authSlice";
import { useEffect, useState } from "react";

export default function Register() {
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
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    })
    const [loginData, setLoginData] = useState({userName: '', password: ''})

    const submit = async(data:any) => {
        setLoginData({userName: data.userName, password: data.password})
        dispatch(regUserReq(data))
        console.log('send')
    }
    useEffect(() => {
        if(authData.regStatus){
            dispatch(loginUserReq(loginData))
        }
    }, [authData.regStatus])
    
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
                    <h1 className="text-2xl lg:text-5xl font-medium">Create an account</h1>
                    <p>Enter your details below</p>
                </div>
                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
                    <TextField {...register("userName")} required sx={{width: 400}} label="User Name"/>
                    <TextField {...register("phoneNumber")} required sx={{width: 400}} label="Phone Number"/>
                    <TextField {...register("email")} required sx={{width: 400}} label="Email"/>
                    <TextField {...register("password")} required sx={{width: 400}} label="Password"/>
                    <TextField {...register("confirmPassword")} required sx={{width: 400}} label="Confirm Password"/>
                    <button type="submit" className="cursor-pointer bg-[#DB4444] text-white w-full p-3 font-bold rounded-sm">Create Account</button>
                    <button className="cursor-pointer flex items-center justify-center gap-3 border border-[#00000066] w-full p-3 rounded-sm"> <img src={googlePng} alt="" /> Sign up with Google</button>
                </form>
                <div className="flex items-center justify-center gap-5">
                    <p>Already have account?</p>
                    <NavLink className="font-semibold border-b" to='/login'>Log in</NavLink>
                </div>
            </div>
        </>
    )
}

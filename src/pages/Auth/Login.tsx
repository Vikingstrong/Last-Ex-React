import { TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import googlePng from "../../assets/auth/google.png"
import { clearError, loginUserReq } from "../../reducer/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../../store/store"
import { useEffect } from "react"

export default function Login() {
    const { t } = useTranslation()
    const rawToken = localStorage.getItem('token')
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' ? rawToken : null

    const authData = useSelector((store: RootState) => store.auth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit
    } = useForm({
        defaultValues: {
            userName: '',
            password: ''
        }
    })

    useEffect(() => {
        dispatch(clearError())
    }, [dispatch])

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    const submit = async (data: any) => {
        const res = await dispatch(loginUserReq(data))
        if (loginUserReq.fulfilled.match(res)) {
            const receivedToken = res.payload?.data || res.payload?.token || (typeof res.payload === 'string' ? res.payload : null)
            if (receivedToken && typeof receivedToken === 'string' && receivedToken !== 'undefined' && receivedToken !== 'null') {
                localStorage.setItem('userName', data.userName)
                navigate('/')
            }
        }
    }

    return (
        <>
            <div className="flex flex-col gap-10 p-5 lg:px-0 py-10 lg:py-25 max-w-300 m-auto items-center">
                <div className="flex flex-col gap-3 items-center text-center">
                    {authData.isLoading ? (
                        <h1 className="self-center text-sm font-semibold text-gray-500 animate-pulse">Загрузка...</h1>
                    ) : null}

                    {authData.error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-600 px-5 py-3 rounded-xl shadow-sm animate-in fade-in duration-300">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <h1 className="text-base lg:text-lg font-semibold tracking-tight">
                                {authData.errorMessage || t('auth.invalidAuth')}
                            </h1>
                        </div>
                    )}

                    <h1 className="text-2xl lg:text-5xl font-medium">{t('auth.loginTitle')}</h1>
                    <p>{t('auth.enterDetails')}</p>
                </div>
                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
                    <TextField {...register("userName")} required sx={{ width: 400 }} label={t('auth.name')} />
                    <TextField {...register("password")} type="password" required sx={{ width: 400 }} label={t('auth.password')} />
                    <p className="py-3 text-red-600 font-semibold self-center cursor-pointer">{t('auth.forgetPassword')}</p>
                    <button 
                        type="submit" 
                        disabled={authData.isLoading}
                        className="cursor-pointer bg-[#DB4444] text-white w-full p-3 font-bold rounded-sm hover:bg-[#c0392b] transition disabled:opacity-50"
                    >
                        {authData.isLoading ? "..." : t('auth.loginBtn')}
                    </button>
                    <button type="button" className="cursor-pointer flex items-center justify-center gap-3 border border-[#00000066] w-full p-3 rounded-sm hover:bg-gray-50 transition">
                        <img src={googlePng} alt="" /> {t('auth.signUpWithGoogle')}
                    </button>
                </form>
                <div className="flex items-center justify-center gap-5">
                    <p>{t('auth.dontHaveAccount')}</p>
                    <NavLink className="font-semibold border-b" to='/register'>{t('auth.signUp')}</NavLink>
                </div>
            </div>
        </>
    )
}

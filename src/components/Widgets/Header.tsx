import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/header/logo.png'
import { Heart, LogOut, Menu, Search, ShieldAlert, ShoppingBag, ShoppingCart, User, Globe, ChevronDown } from 'lucide-react'
import { type AppDispatch, type RootState } from '../../store/store'
import { getDataUser } from '../../reducer/usersSlice'
import { logout } from '../../reducer/authSlice'
import { getProductsFromCart } from '../../reducer/cartSlice'

export default function Header() {
    const { t, i18n } = useTranslation()
    const rawToken = localStorage.getItem('token')
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' ? rawToken : null

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [langDropdownOpen, setLangDropdownOpen] = useState(false)

    const userStore = useSelector((store: RootState) => store.userData)
    const userInfo = userStore.data?.getUserInfo

    const cartStore = useSelector((store: RootState) => store.cart)
    const cartCount = (cartStore.items || []).reduce((acc, item) => acc + (item.quantity || item.productCount || 1), 0)

    const currentLang = i18n.language || 'ru'

    useEffect(() => {
        if (token) {
            if (!userInfo?.userName) {
                dispatch(getDataUser())
            }
            dispatch(getProductsFromCart())
        }
    }, [token, userInfo?.userName, dispatch])

    const isAdmin = Boolean(
        userInfo?.userRoles?.some((r: any) => 
            (typeof r === 'string' && r.toLowerCase() === 'admin') || 
            (r?.name && r.name.toLowerCase() === 'admin')
        )
    )

    const handleLogout = () => {
        dispatch(logout())
        setDropdownOpen(false)
        navigate('/login')
    }

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('i18nextLng', lang)
        setLangDropdownOpen(false)
    }
  
    return (
        <div className="w-full flex flex-col">
            {/* Top Announcement Bar with Language Selector */}
            <div className="bg-black text-white text-xs py-2 px-4">
                <div className="max-w-300 m-auto flex justify-between items-center">
                    <div className="hidden sm:block flex-1"></div>
                    <div className="flex-1 text-center font-normal flex items-center justify-center gap-2">
                        <span>{t('header.topBanner')}</span>
                        <NavLink to="/catalog" className="font-bold underline hover:text-gray-300 transition">
                            {t('header.shopNow')}
                        </NavLink>
                    </div>
                    <div className="relative flex justify-end flex-1">
                        <button
                            onClick={() => setLangDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1.5 hover:text-gray-300 transition text-xs font-semibold cursor-pointer py-0.5 px-2 rounded"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{currentLang === 'ru' ? 'Русский' : 'English'}</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {langDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-black border border-white/20 rounded-md shadow-xl py-1 w-28 z-50 animate-in fade-in duration-150">
                                <button
                                    onClick={() => changeLanguage('ru')}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                                        currentLang === 'ru' ? 'text-[#DB4444] font-bold' : 'text-white'
                                    }`}
                                >
                                    <span>Русский</span>
                                    {currentLang === 'ru' && <span className="w-1.5 h-1.5 rounded-full bg-[#DB4444]"></span>}
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                                        currentLang === 'en' ? 'text-[#DB4444] font-bold' : 'text-white'
                                    }`}
                                >
                                    <span>English</span>
                                    {currentLang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[#DB4444]"></span>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="flex justify-between max-w-300 w-full m-auto p-5 lg:px-0 relative z-40 items-center">
                <div className='lg:hidden flex gap-3 items-center'>
                    <Menu className='w-8 h-8 cursor-pointer'/>
                    <h3 className='text-3xl font-bold'>Exclusive</h3>
                </div>
                <div className="hidden lg:flex justify-between w-180 items-center">
                    <NavLink to="/">
                        <img src={logo} alt="Exclusive" />
                    </NavLink>
                    <nav className='lg:flex hidden gap-7 items-center'>
                        <NavLink to="/" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>{t('header.home')}</NavLink>
                        <NavLink to="/catalog" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>{t('header.catalog')}</NavLink>
                        <NavLink to="/contact" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>{t('header.contact')}</NavLink>
                        <NavLink to="/about" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>{t('header.about')}</NavLink>

                        {isAdmin && (
                            <NavLink 
                                to="/admin" 
                                className={({isActive}) => `bg-[#DB4444] text-white px-3.5 py-1 rounded-md text-sm font-semibold tracking-wide shadow-sm hover:bg-red-700 transition flex items-center gap-1.5 ${isActive ? "ring-2 ring-red-400 font-bold" : ""}`}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>{t('header.adminPanel')}</span>
                            </NavLink>
                        )}

                        {
                            token ? "" 
                            : <NavLink to="/register" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>{t('header.signUp')}</NavLink>
                        }
                    </nav>
                </div>
                <div className='hidden lg:flex gap-8 items-center'>
                    <div className='flex items-center justify-between rounded-lg gap-4 py-2.5 px-4 bg-[#F5F5F5]'>
                        <input className='outline-none w-4/5 bg-transparent text-sm' placeholder={t('header.searchPlaceholder')} type="text" />
                        <Search className='cursor-pointer text-gray-700 w-4 h-4' />
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className="relative">
                            <Heart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                            <span className="absolute -top-1.5 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </div>
                        <NavLink to="/cart" className="relative">
                            <ShoppingCart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[#DB4444] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-xs animate-in zoom-in-50 duration-200">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        <div className="relative">
                        {
                            token ? 
                                (<div 
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className={`p-1.5 rounded-full cursor-pointer transition-colors duration-200 ${
                                        dropdownOpen 
                                            ? "bg-[#DB4444] text-white" 
                                            : "hover:bg-gray-100 text-gray-900"
                                    }`}
                                >
                                    <User className='w-5 h-5'/>
                                </div> 
                            ) : "" 
                        }

                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-black/85 backdrop-blur-md text-white rounded-md p-4 shadow-2xl flex flex-col gap-3 z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {isAdmin && (
                                        <NavLink 
                                            to="/admin" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 text-sm text-[#DB4444] font-semibold hover:text-red-300 transition py-1 cursor-pointer border-b border-white/10 pb-2"
                                        >
                                            <ShieldAlert className="w-5 h-5" />
                                            <span>{t('header.adminPanel')}</span>
                                        </NavLink>
                                    )}

                                    <NavLink 
                                        to="/profile" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>{t('header.account')}</span>
                                    </NavLink>

                                    <NavLink 
                                        to="/cart"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>{t('header.myOrder')} ({cartCount})</span>
                                    </NavLink>

                                    <div 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer border-t border-white/10 pt-2"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>{t('header.logout')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='lg:hidden flex gap-4 items-center'>
                    {/* Mobile Language Switcher */}
                    <button 
                        onClick={() => changeLanguage(currentLang === 'ru' ? 'en' : 'ru')}
                        className="text-xs font-bold px-2 py-1 bg-gray-100 rounded border border-gray-300"
                    >
                        {currentLang.toUpperCase()}
                    </button>
                    {isAdmin && (
                        <NavLink to="/admin" className="text-xs bg-[#DB4444] text-white px-2 py-1 rounded font-bold">
                            Admin
                        </NavLink>
                    )}
                    <NavLink to="/cart" className="relative">
                        <ShoppingCart className='cursor-pointer w-5 h-5'/>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#DB4444] text-white text-[9px] min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>
                    <NavLink to="/profile">
                        <User className='cursor-pointer w-5 h-5'/>
                    </NavLink>
                </div>
            </header>
        </div>
    )
}

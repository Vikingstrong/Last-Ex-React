import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/header/logo.png'
import { 
    Heart, 
    LogOut, 
    Menu, 
    Search, 
    ShieldAlert, 
    ShoppingBag, 
    ShoppingCart, 
    User, 
    Globe, 
    ChevronDown, 
    X, 
    Home, 
    Grid, 
    Phone, 
    Info 
} from 'lucide-react'
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
    const location = useLocation()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [langDropdownOpen, setLangDropdownOpen] = useState(false)
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

    const userStore = useSelector((store: RootState) => store.userData)
    const userInfo = userStore.data?.getUserInfo

    const cartStore = useSelector((store: RootState) => store.cart)
    const cartCount = cartStore.totalProducts || (cartStore.items || []).reduce((acc, item) => acc + (item.quantity || item.productCount || 1), 0)

    const currentLang = i18n.language || 'ru'

    useEffect(() => {
        if (token) {
            if (!userInfo?.userName) {
                dispatch(getDataUser())
            }
            dispatch(getProductsFromCart())
        }
    }, [token, userInfo?.userName, dispatch])

    // Close drawer on route change
    useEffect(() => {
        setMobileDrawerOpen(false)
        setDropdownOpen(false)
    }, [location.pathname])

    const isAdmin = Boolean(
        userInfo?.userRoles?.some((r: any) => 
            (typeof r === 'string' && r.toLowerCase() === 'admin') || 
            (r?.name && r.name.toLowerCase() === 'admin')
        )
    )

    const handleLogout = () => {
        dispatch(logout())
        setDropdownOpen(false)
        setMobileDrawerOpen(false)
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
            <div className="bg-black text-white text-xs sm:text-sm py-2 sm:py-2.5 px-4">
                <div className="max-w-300 m-auto flex justify-between items-center gap-2">
                    <div className="hidden sm:block flex-1"></div>
                    <div className="flex-1 text-center font-normal flex items-center justify-center gap-2">
                        <span className="truncate">{t('header.topBanner')}</span>
                        <NavLink to="/catalog" className="font-bold underline hover:text-gray-300 transition whitespace-nowrap">
                            {t('header.shopNow')}
                        </NavLink>
                    </div>
                    <div className="relative flex justify-end flex-1">
                        <button
                            onClick={() => setLangDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1.5 hover:text-gray-300 transition text-xs sm:text-sm font-semibold cursor-pointer py-1 px-2.5 rounded bg-white/10"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{currentLang === 'ru' ? 'Русский' : 'English'}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {langDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-black border border-white/20 rounded-lg shadow-xl py-1.5 w-32 z-50 animate-in fade-in duration-150">
                                <button
                                    onClick={() => changeLanguage('ru')}
                                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                                        currentLang === 'ru' ? 'text-[#DB4444] font-bold' : 'text-white'
                                    }`}
                                >
                                    <span>Русский</span>
                                    {currentLang === 'ru' && <span className="w-2 h-2 rounded-full bg-[#DB4444]"></span>}
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                                        currentLang === 'en' ? 'text-[#DB4444] font-bold' : 'text-white'
                                    }`}
                                >
                                    <span>English</span>
                                    {currentLang === 'en' && <span className="w-2 h-2 rounded-full bg-[#DB4444]"></span>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header Bar */}
            <header className="flex justify-between max-w-300 w-full m-auto p-4 sm:p-5 lg:px-0 relative z-40 items-center border-b border-gray-100">
                <div className='lg:hidden flex gap-3.5 items-center'>
                    <button 
                        onClick={() => setMobileDrawerOpen(true)}
                        className="p-2 -ml-1 hover:bg-gray-100 rounded-xl transition text-gray-900 cursor-pointer active:scale-95"
                        aria-label="Open navigation menu"
                    >
                        <Menu className='w-8 h-8'/>
                    </button>
                    <NavLink to="/">
                        <h3 className='text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight'>Exclusive</h3>
                    </NavLink>
                </div>

                <div className="hidden lg:flex justify-between w-180 items-center">
                    <NavLink to="/">
                        <img src={logo} alt="Exclusive" className="h-6 object-contain" />
                    </NavLink>
                    <nav className='lg:flex hidden gap-8 items-center text-base font-medium'>
                        <NavLink to="/" className={({isActive}) => isActive ? "border-b-2 border-black font-semibold" : "hover:text-black transition"}>{t('header.home')}</NavLink>
                        <NavLink to="/catalog" className={({isActive}) => isActive ? "border-b-2 border-black font-semibold" : "hover:text-black transition"}>{t('header.catalog')}</NavLink>
                        <NavLink to="/contact" className={({isActive}) => isActive ? "border-b-2 border-black font-semibold" : "hover:text-black transition"}>{t('header.contact')}</NavLink>
                        <NavLink to="/about" className={({isActive}) => isActive ? "border-b-2 border-black font-semibold" : "hover:text-black transition"}>{t('header.about')}</NavLink>

                        {isAdmin && (
                            <NavLink 
                                to="/admin" 
                                className={({isActive}) => `bg-[#DB4444] text-white px-3.5 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm hover:bg-red-700 transition flex items-center gap-1.5 ${isActive ? "ring-2 ring-red-400 font-bold" : ""}`}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>{t('header.adminPanel')}</span>
                            </NavLink>
                        )}

                        {
                            token ? "" 
                            : <NavLink to="/register" className={({isActive}) => isActive ? "border-b-2 border-black font-semibold" : "hover:text-black transition"}>{t('header.signUp')}</NavLink>
                        }
                    </nav>
                </div>

                {/* Desktop Search & Icons */}
                <div className='hidden lg:flex gap-8 items-center'>
                    <div className='flex items-center justify-between rounded-lg gap-4 py-2.5 px-4 bg-[#F5F5F5] w-64'>
                        <input className='outline-none w-full bg-transparent text-sm' placeholder={t('header.searchPlaceholder')} type="text" />
                        <Search className='cursor-pointer text-gray-700 w-4 h-4 shrink-0' />
                    </div>
                    <div className='flex gap-5 items-center'>
                        <div className="relative p-1">
                            <Heart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                            <span className="absolute -top-1 -right-1 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </div>
                        <NavLink to="/cart" className="relative p-1">
                            <ShoppingCart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#DB4444] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-xs animate-in zoom-in-50 duration-200">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        <div className="relative">
                        {
                            token ? 
                                (<div 
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${
                                        dropdownOpen 
                                            ? "bg-[#DB4444] text-white" 
                                            : "hover:bg-gray-100 text-gray-900"
                                    }`}
                                >
                                    <User className='w-5 h-5'/>
                                </div> 
                            ) : (
                                <NavLink to="/login" className="text-sm font-semibold text-[#DB4444] hover:underline">
                                    {t('header.logIn')}
                                </NavLink>
                            )
                        }

                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-md text-white rounded-xl p-4 shadow-2xl flex flex-col gap-3 z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {isAdmin && (
                                        <NavLink 
                                            to="/admin" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 text-sm text-[#DB4444] font-semibold hover:text-red-300 transition py-1.5 cursor-pointer border-b border-white/10 pb-2.5"
                                        >
                                            <ShieldAlert className="w-5 h-5" />
                                            <span>{t('header.adminPanel')}</span>
                                        </NavLink>
                                    )}

                                    <NavLink 
                                        to="/profile" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1.5 cursor-pointer"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>{t('header.account')}</span>
                                    </NavLink>

                                    <NavLink 
                                        to="/cart"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1.5 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>{t('header.myOrder')} ({cartCount})</span>
                                    </NavLink>

                                    <div 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1.5 cursor-pointer border-t border-white/10 pt-2.5"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>{t('header.logout')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Right Action Icons (Optimized and Larger) */}
                <div className='lg:hidden flex gap-4 items-center'>
                    <NavLink to="/cart" className="relative p-2 rounded-lg active:bg-gray-100">
                        <ShoppingCart className='cursor-pointer w-7 h-7 text-gray-900'/>
                        {cartCount > 0 && (
                            <span className="absolute 0 top-0.5 right-0.5 bg-[#DB4444] text-white text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-extrabold shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>
                    {token ? (
                        <NavLink to="/profile" className="p-2 rounded-lg active:bg-gray-100">
                            <User className='cursor-pointer w-7 h-7 text-gray-900'/>
                        </NavLink>
                    ) : (
                        <NavLink to="/login" className="text-sm font-bold text-white bg-[#DB4444] px-4 py-2 rounded-lg shadow-sm">
                            {t('header.logIn')}
                        </NavLink>
                    )}
                </div>
            </header>

            {/* Mobile Slide-Over Navigation Drawer */}
            {mobileDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        onClick={() => setMobileDrawerOpen(false)}
                        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
                    />

                    {/* Drawer Panel */}
                    <div className="fixed inset-y-0 left-0 max-w-[85vw] sm:max-w-sm w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
                        <div className="flex flex-col p-6 gap-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Exclusive</h3>
                                    {userInfo?.userName && (
                                        <p className="text-sm text-gray-600 font-medium mt-1">
                                            {userInfo.firstName ? `${userInfo.firstName} (${userInfo.userName})` : userInfo.userName}
                                        </p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="flex items-center rounded-xl gap-3 py-3 px-4 bg-[#F5F5F5]">
                                <Search className="w-5 h-5 text-gray-500" />
                                <input 
                                    placeholder={t('header.searchPlaceholder')} 
                                    className="outline-none w-full bg-transparent text-base text-gray-800"
                                />
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex flex-col gap-2 text-base font-semibold">
                                <NavLink 
                                    to="/"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={({isActive}) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition ${
                                        isActive ? "bg-red-50 text-[#DB4444] font-bold" : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <Home className="w-5 h-5" />
                                    <span>{t('header.home')}</span>
                                </NavLink>

                                <NavLink 
                                    to="/catalog"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={({isActive}) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition ${
                                        isActive ? "bg-red-50 text-[#DB4444] font-bold" : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <Grid className="w-5 h-5" />
                                    <span>{t('header.catalog')}</span>
                                </NavLink>

                                <NavLink 
                                    to="/cart"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-xl transition ${
                                        isActive ? "bg-red-50 text-[#DB4444] font-bold" : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{t('footer.cart')}</span>
                                    </div>
                                    {cartCount > 0 && (
                                        <span className="bg-[#DB4444] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                                            {cartCount}
                                        </span>
                                    )}
                                </NavLink>

                                <NavLink 
                                    to="/contact"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={({isActive}) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition ${
                                        isActive ? "bg-red-50 text-[#DB4444] font-bold" : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>{t('header.contact')}</span>
                                </NavLink>

                                <NavLink 
                                    to="/about"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={({isActive}) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition ${
                                        isActive ? "bg-red-50 text-[#DB4444] font-bold" : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <Info className="w-5 h-5" />
                                    <span>{t('header.about')}</span>
                                </NavLink>

                                {isAdmin && (
                                    <NavLink 
                                        to="/admin"
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="flex items-center gap-3.5 px-4 py-3 mt-3 rounded-xl bg-red-600 text-white font-bold transition shadow-sm"
                                    >
                                        <ShieldAlert className="w-5 h-5" />
                                        <span>{t('header.adminPanel')}</span>
                                    </NavLink>
                                )}
                            </nav>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="p-6 border-t border-gray-100 flex flex-col gap-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-semibold">Язык / Language</span>
                                <div className="flex gap-1.5">
                                    <button 
                                        onClick={() => changeLanguage('ru')}
                                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                                            currentLang === 'ru' ? 'bg-[#DB4444] text-white shadow-sm' : 'bg-white border text-gray-700'
                                        }`}
                                    >
                                        Русский (RU)
                                    </button>
                                    <button 
                                        onClick={() => changeLanguage('en')}
                                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                                            currentLang === 'en' ? 'bg-[#DB4444] text-white shadow-sm' : 'bg-white border text-gray-700'
                                        }`}
                                    >
                                        English (EN)
                                    </button>
                                </div>
                            </div>

                            {token ? (
                                <div className="flex flex-col gap-2.5 pt-3 border-t border-gray-200">
                                    <NavLink
                                        to="/profile"
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="flex items-center gap-3 text-base text-gray-800 hover:text-black py-1.5 font-medium"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>{t('header.account')}</span>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 text-base text-red-600 hover:text-red-800 py-1.5 font-semibold text-left cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>{t('header.logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 pt-3 border-t border-gray-200">
                                    <NavLink
                                        to="/login"
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="flex-1 text-center py-3 bg-white border border-gray-300 rounded-xl text-base font-bold text-gray-900"
                                    >
                                        {t('auth.logIn')}
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="flex-1 text-center py-3 bg-[#DB4444] text-white rounded-xl text-base font-bold shadow-sm"
                                    >
                                        {t('auth.signUp')}
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

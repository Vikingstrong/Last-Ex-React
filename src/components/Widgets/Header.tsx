import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import logo from '../../assets/header/logo.png'
import { Heart, LogOut, Menu, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react'

export default function Header() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        setDropdownOpen(false)
        navigate('/login')
    }
  
    return(
        <header className="flex justify-between max-w-300 m-auto p-5 lg:px-0 relative z-50">
            <div className='lg:hidden flex gap-3 items-center'>
                <Menu className='w-8 h-8 cursor-pointer'/>
                <h3 className='text-3xl font-bold'>Exclusive</h3>
            </div>
            <div className="hidden lg:flex justify-between w-160 items-center">
                <NavLink to="/">
                    <img src={logo} alt="Exclusive" />
                </NavLink>
                <nav className='lg:flex hidden gap-8 items-center'>
                    <NavLink to="/" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>Home</NavLink>
                    <NavLink to="/catalog" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>Catalog</NavLink>
                    <NavLink to="/contact" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>Contact</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>About</NavLink>

                    {
                        token ? "" 
                        :  <NavLink to="/register" className={({isActive}) => isActive ? "border-b border-black font-medium" : "hover:text-black transition"}>Sign Up</NavLink>
                    }
                </nav>
            </div>
            <div className='hidden lg:flex gap-8 items-center'>
                <div className='flex items-center justify-between rounded-lg gap-4 py-3 px-5 bg-[#F5F5F5]'>
                    <input className='outline-none w-4/5 bg-transparent' placeholder='What are you looking for?' type="text" />
                    <Search className='cursor-pointer text-gray-700' />
                </div>
                <div className='flex gap-4 items-center'>
                    <div className="relative">
                        <Heart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                        <span className="absolute -top-1.5 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                    </div>

                    <div className="relative">
                        <ShoppingCart className='cursor-pointer w-6 h-6 hover:text-[#DB4444] transition'/>
                        <span className="absolute -top-1.5 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                    </div>

                    {/* User Profile Icon with Click Dropdown */}
                    <div className="relative">
                        <div 
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className={`p-1.5 rounded-full cursor-pointer transition-colors duration-200 ${
                                dropdownOpen 
                                    ? "bg-[#DB4444] text-white" 
                                    : "hover:bg-gray-100 text-gray-900"
                            }`}
                        >
                            <User className='w-5 h-5'/>
                        </div>

                        {/* Frosted Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-black/80 backdrop-blur-md text-white rounded-md p-4 shadow-2xl flex flex-col gap-3 z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                <NavLink 
                                    to="/profile" 
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Account</span>
                                </NavLink>

                                <div 
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>My Order</span>
                                </div>

                                <div 
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-sm hover:text-[#DB4444] transition py-1 cursor-pointer border-t border-white/10 pt-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='lg:hidden flex gap-5 items-center'>
                <ShoppingCart className='cursor-pointer'/>
                <NavLink to="/profile">
                    <User className='cursor-pointer w-6 h-6'/>
                </NavLink>
            </div>
        </header>
    )
}


import { NavLink } from 'react-router'
import logo from '../../assets/header/logo.png'
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react'



export default function Header() {
    const token = localStorage.getItem('token')
  
    return(
        <header className="flex justify-between max-w-300 m-auto p-5 lg:px-0">
            <div className='lg:hidden flex gap-3 items-center'>
                <Menu className='w-8 h-8'/>
                <h3 className='text-3xl font-bold'>Exclusive</h3>
            </div>
            <div className="hidden lg:flex justify-between w-160 items-center">
                <img src={logo} alt="" />
                <nav className='lg:flex hidden gap-8'>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/">Contact</NavLink>
                    <NavLink to="/">About</NavLink>

                    {
                        Boolean(token) ? "" 
                        :  <NavLink to="/register">Sign Up</NavLink>
                    }
                </nav>
            </div>
            <div className='hidden lg:flex gap-8 items-center'>
                <div className='flex items-center justify-between rounded-lg gap-4 py-3 px-5 bg-[#F5F5F5]'>
                    <input className='outline-none w-4/5' placeholder='What are you looking for?' type="text" />
                    <Search className='cursor-pointer' />
                </div>
                <div className='flex gap-3'>
                    <Heart className='cursor-pointer'/>
                    <ShoppingCart className='cursor-pointer'/>
                    {
                        Boolean(token) ? <User className='cursor-pointer'/> 
                        : ""
                    }
                </div>
            </div>

            <div className='lg:hidden flex gap-5'>
                <ShoppingCart className='cursor-pointer'/>
            </div>
        </header>
    )
}

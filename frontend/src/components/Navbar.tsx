import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "./ui/navigation-menu";
import { Link, NavigateFunction, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { User } from "@/redux/features/userSlice";
import { useLogout, LogoutHook } from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { JSX, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar(): JSX.Element{
    const user: User | null = useAppSelector<User | null>(state=>state.user.user);
    const {logout}: LogoutHook = useLogout();
    const navigate: NavigateFunction = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

  
    const toggleMenu = () => setIsOpen(!isOpen);

    function handleClick(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.preventDefault();
        logout();
        navigate('/');
    }

    const hideNavbarRoutes = ['/groups', '/create-group', '/home', '/itinerary'];
    const shouldShowNavbar = hideNavbarRoutes.includes(location.pathname);

    return(
        <div>
            { screen.width > 600 ? (
                <nav className='w-full flex flex-row justify-between items-center px-10 py-6 font-Montserrat'>
                    <Link to="/" className="flex flex-row items-center">
                        <p className="text-2xl font-bold leading-10 text-center bg-gradient-to-r from-blue-500 via-blue-700 to-black text-transparent bg-clip-text">
                            ConcertExpensr
                        </p>
                    </Link>

                
                    <div className="flex flex-row items-center">
                        <NavigationMenu className="flex">
                            {shouldShowNavbar && <NavigationMenuList>
                                <NavigationMenuItem >
                                <NavigationMenuTrigger className="bg-gray-100 text-lg w-full">Options</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <Link to="/home" >
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                                    </Link>
                                    <Link to="/create_group" >
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Create groups</NavigationMenuLink>
                                    </Link>
                                    <Link to="/groups" >
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>View current groups</NavigationMenuLink>
                                    </Link>
                                </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>}
                        </NavigationMenu>
                        { user ? (<Button onClick={handleClick} variant = "ghost" className="text-lg h-[40px] flex ">Log Out</Button>) : (<><Link to='/login'><Button variant = "ghost" className="text-lg h-[40px] hidden md:flex ">Log In</Button></Link><Link to="/signup"><Button variant = "outline" className="dark:text-white text-md mx-5 rounded-md h-[40px] hover:opacity-90 md:w-[84px] hidden md:flex">Sign up</Button></Link></>)}
                    </div>
                </nav> 
            )
             :
            (
                <div>
                    <div className={`fixed inset-0 bg-white z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform md:translate-x-0 md:relative md:flex md:items-center md:justify-between md:w-auto`}>
                        <div className="flex flex-col items-center mt-20 md:mt-0 md:flex-row">
                            <Link to="/home" className="text-xl m-4 w-full text-center" onClick={toggleMenu}>Home</Link>
                            <Link to="/create_group" className="text-xl m-4 w-full text-center" onClick={toggleMenu}>Create groups</Link>
                            <Link to="/groups" className="text-xl m-4 w-full text-center" onClick={toggleMenu}>View current groups</Link>
                            {user ? (
                            <Button onClick={handleClick} variant="ghost" className="text-lg m-4 w-full text-center">Log Out</Button>
                            ) : (
                            <>
                                <Link to='/login'><Button variant="ghost" className="text-lg m-4 w-full text-center" onClick={toggleMenu}>Log In</Button></Link>
                                <Link to="/signup"><Button variant="outline" className="text-md m-4 w-full text-center" onClick={toggleMenu}>Sign up</Button></Link>
                            </>
                            )}
                        </div>
                    </div>
                    {isOpen ? 
                        <X onClick={toggleMenu} size={48} className="md:hidden z-50 fixed top-4 right-4" /> 
                        : <Menu onClick={toggleMenu} size={48} className="md:hidden z-50 fixed top-4 right-4" />
                    }
                </div>
            )}
      </div>
    )
};
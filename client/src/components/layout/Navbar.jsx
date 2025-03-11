import React, {useState} from 'react';
import {User, Menu, CircleUserIcon} from 'lucide-react'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Link, Navigate} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useDispatch, useSelector} from "react-redux";
import {logout} from "@/features/user/userSlice.js";



function Navbar(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const links = [
        {
            path: '/definetest',
            label: 'Test Yechish',
            roles: ['user', 'admin', 'bosh admin'],
        },
        {
            path: '/results',
            label: 'Natijalar',
            roles: ['user', 'admin', 'bosh admin'],
        },
        {
            path: '/users',
            label: 'Foydalanuvchilar',
            roles: ['admin', "bosh admin"],
        },
        {
            path: '/testtopdf',
            label: 'Test-PDF',
            roles: ['admin', "bosh admin", "user"],
        },
        {
            path: '/addtopic',
            label: 'Savollar qo\'shish',
            roles: ["bosh admin", "admin"],
        },
        {
            path: '/allresults',
            label: 'Barcha Natijalar',
            roles: ["bosh admin"],
        }
    ];
    const filteredLinks = links.filter(link =>
        link.roles.some(role => user.role === role)
    );
    return (
        <nav className="bg-white shadow-md ">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center  text-gray-700 hover:text-gray-900 ">
                            <span className="text-2xl font-bold">Innova</span>
                        </Link>
                        <div className="hidden sm:ml-6 lg:flex sm:items-center">
                            {filteredLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-base   font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <h5 className={`pr-2 lg:flex md:flex  2xl:flex xl:flex  gap-1 hidden`}>Hush kelibsiz, <b>{user.name}</b></h5>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUserIcon className="h-5 w-5"/>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {/*<DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
                                <DropdownMenuSeparator/>
                                <Link to={"/profile/settings"} className={`cursor-pointer`}>
                                    <DropdownMenuItem className={`cursor-pointer`}>Sozlamalar</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator/>
                                <Link to={"/signin"}
                                      className={`cursor-pointer`}
                                      onClick={() => dispatch(logout())}>
                                    <DropdownMenuItem className={`cursor-pointer`}>Chiqish</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>

                        </DropdownMenu>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative rounded-full lg:hidden"
                                    aria-label="Main menu"
                                >
                                    <Menu className="h-7 w-7"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] lg:hidden pt-10">
                                <nav className="flex flex-col gap-4">
                                    {filteredLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            to={link.path}
                                            className={cn(
                                                "px-4 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
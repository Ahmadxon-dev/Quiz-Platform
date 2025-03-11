import React, {useEffect, useState} from 'react';
import {Loader2, MoreHorizontal, Edit, Trash, Mail, EllipsisVertical} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.js";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Card} from "@/components/ui/card.jsx";

function UsersPage(props) {
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [tableLoading, setTableLoading] = useState(false)
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [role, setRole] = useState(null)
    const {toast} = useToast()
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    if (user.role === "user") {
        navigate("/")
    }
    const getUsers = async () => {
        const res = await fetch(`${import.meta.env.VITE_SERVER}/user/get-users`)
        const data = await res.json()
        let filteredUsers = []
        if (user.role === "admin") {
            filteredUsers = data.filter(user => user.role === "user")
        } else if (user.role === "bosh admin") {
            filteredUsers = data.filter(user => user.role !== "bosh admin")
        }
        setAllUsers(filteredUsers)
        setLoading(false)
    }

    useEffect(() => {
        getUsers()
        if(user){
            setRole(user.role)
        }
    }, [user])

    const handleDelete = async (userId) => {
        setLoadingUserId(userId)
        await fetch(`${import.meta.env.VITE_SERVER}/user/delete/${userId}`, {
            method: "delete"
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast({
                        title: data.error,
                        variant: "destructive",
                    })
                }
                toast({
                    title: data.msg,
                    variant: "success",
                })
                setLoadingUserId(null)
                let filteredUsers = []
                if (user.role === "admin") {
                    filteredUsers = data.allUsers.filter(user => user.role === "user")
                } else if (user.role === "bosh admin") {
                    filteredUsers = data.allUsers.filter(user => user.role !== "bosh admin")
                }
                setAllUsers(filteredUsers)
            })
    }
    const roleToUser = async (userEmail) =>{
        setLoadingUserId(userEmail)
        await fetch(`${import.meta.env.VITE_SERVER}/user/role-to-user/`, {
            method: "put",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail
            })
        })
            .then(res=>res.json())
            .then(data=>{
                toast({
                    title: data.msg,
                    variant:'success',
                    duration:4000,
                })
                setLoadingUserId(null)
                let filteredUsers = []
                if (user.role === "admin") {
                    filteredUsers = data.newData.filter(user => user.role === "user")
                } else if (user.role === "bosh admin") {
                    filteredUsers = data.newData.filter(user => user.role !== "bosh admin")
                }
                setAllUsers(filteredUsers)
            })
    }
    const roleToAdmin = async (userEmail) =>{
        setLoadingUserId(userEmail)
        await fetch(`${import.meta.env.VITE_SERVER}/user/role-to-admin/`, {
            method: "put",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail
            })
        })
            .then(res=>res.json())
            .then(data=>{
                toast({
                    title: data.msg,
                    variant:'success',
                    duration:4000,
                })
                setLoadingUserId(null)
                let filteredUsers = []
                if (user.role === "admin") {
                    filteredUsers = data.newData.filter(user => user.role === "user")
                } else if (user.role === "bosh admin") {
                    filteredUsers = data.newData.filter(user => user.role !== "bosh admin")
                }
                setAllUsers(filteredUsers)
            })
    }
    if (loading) {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        );
    }

    return (
         <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            {
                allUsers
                    ?
                    (
                        <>
                            <Table className={`bg-white  rounded-lg shadow-lg`}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ism</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Yaratilgan sanasi</TableHead>
                                        <TableHead className="text-right">Amallar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allUsers.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {(loadingUserId === user._id || loadingUserId === user.email) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    <Button size={"icon"} onClick={() => handleDelete(user._id)} variant={"outline"}>
                                                        <Trash className=" h-4 w-4"/>
                                                    </Button>
                                                    {
                                                        (role === "bosh admin") && (<DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Button size={"icon"} variant={"outline"}>
                                                                    <EllipsisVertical className={`h-7 w-7`}/>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                {/*<DropdownMenuLabel>.....test</DropdownMenuLabel>*/}
                                                                {/*<DropdownMenuSeparator />*/}
                                                                {user.role === "user" &&
                                                                    <DropdownMenuItem onClick={()=>roleToAdmin(user.email)}>User {"->"} Admin</DropdownMenuItem>
                                                                }

                                                                { role === "bosh admin" && user.role === "admin" &&
                                                                    <DropdownMenuItem  onClick={()=>roleToUser(user.email)}>Admin {"->"} User</DropdownMenuItem>
                                                                }

                                                                {/*<DropdownMenuItem>Profile</DropdownMenuItem>*/}
                                                                {/*<DropdownMenuItem>Billing</DropdownMenuItem>*/}
                                                                {/*<DropdownMenuItem>Team</DropdownMenuItem>*/}
                                                                {/*<DropdownMenuItem>Subscription</DropdownMenuItem>*/}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>)
                                                    }

                                                </div>



                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </>
                    )
                    :
                    (<p className={`text-center`}>Foydalanuvchi topilmadi</p>)


            }
                </Card>
        </div>
        </div>
    );
}

export default UsersPage;
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
    const [currentPassword, setCurrentPassword] = useState("")
    const [role, setRole] = useState(null)
    const user = useSelector(state => state.user)
    const {toast} = useToast()
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
                let filteredUsers = []
                if (user.role === "admin") {
                    filteredUsers = data.allUsers.filter(user => user.role === "user")
                } else if (user.role === "bosh admin") {
                    filteredUsers = data.allUsers.filter(user => user.role !== "bosh admin")
                }
                setAllUsers(filteredUsers)
            })
    }
    const handleEdit = async (userId) => {
        await fetch(`${import.meta.env.VITE_SERVER}/user/edit/${userId}`, {
            method: "put",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password: currentPassword
            })
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
                let filteredUsers = []
                if (user.role === "admin") {
                    filteredUsers = data.allUsers.filter(user => user.role === "user")
                } else if (user.role === "bosh admin") {
                    filteredUsers = data.allUsers.filter(user => user.role !== "bosh admin")
                }
                setAllUsers(filteredUsers)
                setCurrentPassword("")
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
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size={"icon"} variant={"outline"} >
                                                                <Edit className="h-4 w-4"/>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Parolni O'zgartirish</DialogTitle>
                                                                {/*<DialogDescription>*/}
                                                                {/*    Make changes to your profile here. Click save when you're done.*/}
                                                                {/*</DialogDescription>*/}
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="password" className="text-right">
                                                                        Yangi parol kiriting
                                                                    </Label>
                                                                    <Input
                                                                        id="password"
                                                                        // defaultValue={currentPassword}
                                                                        className="col-span-3"
                                                                        value={currentPassword}
                                                                        onChange={e=>setCurrentPassword(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button type="submit" onClick={()=>handleEdit(user._id)}>Saqlash</Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button size={"icon"} onClick={() => handleDelete(user._id)} variant={"outline"}>
                                                        <Trash className=" h-4 w-4"/>
                                                    </Button>
                                                    {
                                                        role === "bosh admin" && (<DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Button size={"icon"} variant={"outline"}>
                                                                    <EllipsisVertical className={`h-7 w-7`}/>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuLabel>.....test</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
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
import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {cn} from "@/lib/utils.js";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.js";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "@/features/user/userSlice.js";
import {Loader2} from "lucide-react";

function LoginForm(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const {toast} = useToast()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleSubmit = ()=>{
        if (!email || !password){
            toast({
                title:"Hamma maydonlarni to'ldiring",
                variant:"destructive",
                duration:4000
            })
            return
        }
        setLoading(true)
        fetch(`${import.meta.env.VITE_SERVER}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
            .then(res=>res.json())
            .then(data=>{
                if (data.error){
                    toast({
                        title:data.error,
                        variant:"destructive",
                        duration:4000
                    })
                }else{
                    localStorage.setItem("token", data.token)
                    toast({
                        title:data.msg,
                        variant:"success",
                        duration:4000
                    })
                    setLoading(false)
                    setPassword("")
                    setEmail("")
                    const {email, name, role} = data.user
                    dispatch(setUser({email, name, role}))
                    navigate("/")
                }
            })
    }

    return (
        // <div className={cn("flex flex-col gap-6 justify-center mx-auto h-[80vh] w-3/12")}>
        <div className="min-h-screen  bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-lg mx-auto ">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Kirish</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Parol</Label>
                                </div>
                                <Input id="password"
                                       type="password"
                                       value={password}
                                       placeholder={"********"}
                                       onChange={e=>setPassword(e.target.value)}
                                       required/>
                            </div>
                            <Button type="button" onClick={handleSubmit} className="w-full">
                                Kirish
                                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin"/> : ""}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Foydalanuvchi topilmadimi? {" "}
                            <Link to="/signup" className="underline underline-offset-4">
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
        </div>
    );
}

export default LoginForm;
import React, {useState} from 'react';
import {cn} from "@/lib/utils.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.js";

function SignupForm(props) {
    // console.log(import.meta.env.VITE_SERVER)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {toast} = useToast()
    const navigate = useNavigate()


    const handleSubmit =()=>{
        if (!email || !name || !password){
            toast({
                title:"Hamma maydonlarni to'ldiring",
                variant:"destructive",
                duration:4000
            })
            return
        }
        fetch(`${import.meta.env.VITE_SERVER}/auth/signup`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
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
                    toast({
                        title:data.msg,
                        variant:"success",
                        duration:4000
                    })
                    setPassword("")
                    setEmail("")
                    setName("")
                    navigate("/signin")

                }
            })
    }

    return (
        <div className={cn("flex flex-col gap-6 justify-center mx-auto h-[80vh] w-3/12")}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Ro'yxatdan o'tish</CardTitle>
                    {/*<CardDescription>*/}
                    {/*    Kirish uchun quyida elektron pochtangizni kiriting*/}
                    {/*</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Ism</Label>
                                <Input
                                    id="name"
                                    type={"name"}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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
                                       onChange={e => setPassword(e.target.value)}
                                       required
                                />
                            </div>
                            <Button onClick={handleSubmit} type="button" className="w-full">
                                Ro'yxatdan o'tish
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Foydalanuvchi oldin yaratilganmi? {" "}
                            <Link to="/signin" className="underline underline-offset-4">
                                Kirish
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignupForm;
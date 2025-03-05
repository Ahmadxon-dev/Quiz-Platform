import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useSelector} from "react-redux";
import {toast} from "@/hooks/use-toast.js";

function SettingsPage(props) {
    const [newName, setNewName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(state => state.user)

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setIsLoading(true)
        await fetch(`${import.meta.env.VITE_SERVER}/user/profile/name/edit`, {
            method:"put",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail:user.email,
                newName
            })
        })
            .then(res=>res.json())
            .then(data=>{
                toast({
                    title: data.msg,
                    variant:"success"
                })
                setIsLoading(false)
            })
    }
    return (
        <div className="container max-w-2xl py-10 mx-auto">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    defaultValue={user.name}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t px-6 py-4">
                            <Button type="submit" disabled={isLoading || (newName === "" || newName === user.name)}>
                                {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default SettingsPage;
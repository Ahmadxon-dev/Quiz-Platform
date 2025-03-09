import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "@/hooks/use-toast.js";
import {Eye, EyeOff, Lock, Save, User} from "lucide-react"
import {setUser} from "@/features/user/userSlice.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

function SettingsPage(props) {
    const [newName, setNewName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await fetch(`${import.meta.env.VITE_SERVER}/user/profile/password/edit`, {
            method: "put", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                currentPassword, newPassword, userId: user._id
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg) {
                    toast({
                        title: data.msg, variant: "success", duration: 4000
                    })
                    dispatch(setUser(data.user))
                    setCurrentPassword("")
                    setNewPassword("")
                } else {
                    toast({
                        title: data.error, variant: "destructive", duration: 4000
                    })
                }
                setIsLoading(false)
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await fetch(`${import.meta.env.VITE_SERVER}/user/profile/name/edit`, {
            method: "put", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                userId: user._id,
                newName
            })
        })
            .then(res => res.json())
            .then(data => {
                toast({
                    title: data.msg, variant: "success"
                })
                dispatch(setUser(data.user))
                setIsLoading(false)
            })
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container max-w-4xl px-4 py-12 mx-auto">
                <div className="mb-8 space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Sozlamalar</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
                </div>

                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="personal" className="text-sm sm:text-base">
                            <User className="w-4 h-4 mr-2"/>
                            Shaxsiy ma&apos;lumotlar
                        </TabsTrigger>
                        <TabsTrigger value="security" className="text-sm sm:text-base">
                            <Lock className="w-4 h-4 mr-2"/>
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-6">
                        <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-2xl">Shaxsiy ma&apos;lumotlar</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={user.name}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="transition-all focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end border-t px-6 py-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || newName === "" || newName === user.name}
                                        className="transition-all"
                                    >
                                        {isLoading ? (<span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                          />
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saqlanmoqda...
                      </span>) : (<span className="flex items-center gap-2">
                        <Save className="w-4 h-4"/>
                        Saqlash
                      </span>)}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-2xl">Change Password</CardTitle>
                                <CardDescription>Update your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <form onSubmit={handlePasswordSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password" className="text-sm font-medium">
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="pr-10 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                                placeholder="Enter your current password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground"/>) : (
                                                    <Eye className="w-4 h-4 text-muted-foreground"/>)}
                                                <span
                                                    className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password" className="text-sm font-medium">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="pr-10 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                                placeholder="Enter your new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground"/>) : (
                                                    <Eye className="w-4 h-4 text-muted-foreground"/>)}
                                                <span
                                                    className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end border-t px-6 py-4">
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto transition-all"
                                        disabled={!currentPassword || !newPassword || isLoading}
                                    >
                                        {isLoading ? (<span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                          />
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>) : (<span className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4"/>
                        Change Password
                      </span>)}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        // <div className={`bg-gray-100 h-screen w-full`}>
        // <div className="h-full max-w-2xl py-10 mx-auto">
        //     <div className="space-y-6">
        //         <div>
        //             <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
        //         </div>
        //
        //         <Card>
        //             <CardHeader>
        //                 <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
        //             </CardHeader>
        //             <form onSubmit={handleSubmit}>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="name">Name</Label>
        //                         <Input
        //                             id="name"
        //                             defaultValue={user.name}
        //                             onChange={(e) => setNewName(e.target.value)}
        //                         />
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter className="flex justify-end border-t px-6 py-4">
        //                     <Button type="submit" disabled={isLoading || (newName === "" || newName === user.name)}>
        //                         {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        //                     </Button>
        //                 </CardFooter>
        //             </form>
        //         </Card>
        //         <Card className="w-full max-w-md mx-auto">
        //             <CardHeader>
        //                 <CardTitle className="text-2xl">Change Password</CardTitle>
        //                 <CardDescription>Update your password to keep your account secure</CardDescription>
        //             </CardHeader>
        //             <form onSubmit={handlePasswordSubmit}>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="current-password">Current Password</Label>
        //                         <div className="relative">
        //                             <Input
        //                                 id="current-password"
        //                                 type={showCurrentPassword ? "text" : "password"}
        //                                 value={currentPassword}
        //                                 onChange={(e) => setCurrentPassword(e.target.value)}
        //                                 className="pr-10"
        //                                 placeholder="Enter your current password"
        //                             />
        //                             <Button
        //                                 type="button"
        //                                 variant="ghost"
        //                                 size="icon"
        //                                 className="absolute right-0 top-0 h-full px-3"
        //                                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        //                             >
        //                                 {showCurrentPassword ? (
        //                                     <EyeOff className="h-4 w-4 text-muted-foreground" />
        //                                 ) : (
        //                                     <Eye className="h-4 w-4 text-muted-foreground" />
        //                                 )}
        //                                 <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
        //                             </Button>
        //                         </div>
        //                     </div>
        //
        //                     <div className="space-y-2">
        //                         <Label htmlFor="new-password">New Password</Label>
        //                         <div className="relative">
        //                             <Input
        //                                 id="new-password"
        //                                 type={showNewPassword ? "text" : "password"}
        //                                 value={newPassword}
        //                                 onChange={(e) => setNewPassword(e.target.value)}
        //                                 className="pr-10"
        //                                 placeholder="Enter your new password"
        //                             />
        //                             <Button
        //                                 type="button"
        //                                 variant="ghost"
        //                                 size="icon"
        //                                 className="absolute right-0 top-0 h-full px-3"
        //                                 onClick={() => setShowNewPassword(!showNewPassword)}
        //                             >
        //                                 {showNewPassword ? (
        //                                     <EyeOff className="h-4 w-4 text-muted-foreground" />
        //                                 ) : (
        //                                     <Eye className="h-4 w-4 text-muted-foreground" />
        //                                 )}
        //                                 <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
        //                             </Button>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button type="submit" className="w-full">
        //     <span className="flex items-center gap-2">
        //       <Lock className="h-4 w-4" />
        //       Change Password
        //     </span>
        //                     </Button>
        //                 </CardFooter>
        //             </form>
        //         </Card>
        //     </div>
        // </div>
        // </div>
    );
}

export default SettingsPage;
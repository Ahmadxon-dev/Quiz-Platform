import React, {useEffect, useState} from "react"
import {ArrowUpDown, ChevronDown, Clock, Download, Eye, Search, User} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

function AllResultsPage(props) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("date")
    const [sortDirection, setSortDirection] = useState("desc")
    const [quizResults,setData] = useState([])
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    if (user.role === "user" || user.role === "admin") {
        navigate("/")
    }
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Fetch data and transform it to the desired format
    const getData = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/all-results`)
            .then(res => res.json())
            .then(data => {
                const transformedData = data.map((result) => {
                    return {
                        id: result._id,
                        userName: result.userId.name,
                        date: result.startTime,
                        role: result.userId.role,
                        topics: result.subtopicname,
                        questions: result.questions.length,
                        score: result.result,
                        timeSpent: formatTime(result.remainingTime),
                    }
                });

                setData(transformedData.filter(item=> item.role!=="bosh admin"));
            })
    }

    useEffect(() => {
        getData();
    }, [])
    // Mock data for quiz results
    // const quizResults = [
    //     {
    //         id: 1,
    //         userName: "John Smith",
    //         date: "2023-05-15",
    //         role: "User",
    //         topics: ["Mathematics", "Algebra"],
    //         questions: 20,
    //         score: 18,
    //         timeSpent: "15:30",
    //     },
    //     {
    //         id: 2,
    //         userName: "Emily Johnson",
    //         date: "2023-05-14",
    //         role: "User",
    //         topics: ["Science", "Biology"],
    //         questions: 25,
    //         score: 22,
    //         timeSpent: "22:45",
    //     },
    //     {
    //         id: 3,
    //         userName: "Michael Brown",
    //         date: "2023-05-13",
    //         role: "Admin",
    //         topics: ["History", "World War II"],
    //         questions: 15,
    //         score: 15,
    //         timeSpent: "12:15",
    //     },
    //     {
    //         id: 4,
    //         userName: "Sarah Davis",
    //         date: "2023-05-12",
    //         role: "User",
    //         topics: ["English", "Literature"],
    //         questions: 30,
    //         score: 25,
    //         timeSpent: "28:10",
    //     },
    //     {
    //         id: 5,
    //         userName: "David Wilson",
    //         date: "2023-05-11",
    //         role: "User",
    //         topics: ["Geography", "Continents"],
    //         questions: 20,
    //         score: 16,
    //         timeSpent: "18:45",
    //     },
    //
    // ]

    const sortData = (data, sortBy, direction) => {
        return [...data].sort((a, b) => {
            if (sortBy === "score" || sortBy === "questions") {
                return direction === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
            } else if (sortBy === "date") {
                return direction === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
            } else {
                return direction === "asc" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
            }
        })
    }

    // Filter function
    const filterData = (data, term) => {
        if (!term) return data
        return data.filter(
            (item) =>
                item.userName.toLowerCase().includes(term.toLowerCase()) ||
                item.role.toLowerCase().includes(term.toLowerCase()) ||
                item.topics.some((topic) => topic.toLowerCase().includes(term.toLowerCase())),
        )
    }

    // Handle sort
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortDirection("asc")
        }
    }

    // Process data with current filters and sorting
    const processedData = sortData(filterData(quizResults, searchTerm), sortBy, sortDirection)

    // Calculate average score
    const averageScore = quizResults.reduce((sum, item) => sum + item.score, 0) / quizResults.length

    // Calculate completion rate (score/questions)
    const averageCompletionRate =
        (quizResults.reduce((sum, item) => sum + item.score / item.questions, 0) / quizResults.length) * 100

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + ", " + date.toLocaleTimeString()
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-6 px-4">
                {/*<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">*/}
                {/*    <h1 className="text-3xl font-bold text-white mb-2">Quiz Results Dashboard</h1>*/}
                {/*    <p className="text-blue-100">Track performance and analyze quiz outcomes</p>*/}
                {/*</div>*/}

                <div className="grid gap-6 mb-8 md:grid-cols-3">
                    <Card className="border-t-4 border-blue-500 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                            <CardDescription>Barcha Foydalanuvchilar</CardDescription>
                            <CardTitle className="text-3xl text-blue-700">{quizResults.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-t-4 border-green-500 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                            <CardDescription>User</CardDescription>
                            <CardTitle className="text-3xl text-green-700">{quizResults.filter((item) => item.role === "user").length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-t-4 border-yellow-500 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                            <CardDescription>Admin</CardDescription>
                            <CardTitle className="text-3xl text-yellow-700">{quizResults.filter((item) => item.role === "admin").length}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg">
                    <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Qidirish..."
                                className="w-full pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 self-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        Rollar bo'yicha filterlash
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSearchTerm("")}>Barcha Rollar</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSearchTerm("user")}>User</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSearchTerm("admin")}>Admin</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">
                                        <Button variant="ghost" className="gap-1 font-medium" onClick={() => handleSort("userName")}>
                                            Foydalanuvchi Ismi
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="gap-1 font-medium" onClick={() => handleSort("date")}>
                                            Sanasi
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="gap-1 font-medium" onClick={() => handleSort("role")}>
                                            Rol
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Mavzular</TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" className="gap-1 font-medium" onClick={() => handleSort("questions")}>
                                            Savollar Soni
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" className="gap-1 font-medium" onClick={() => handleSort("score")}>
                                            Natija
                                            <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Ketgan Vaqt</TableHead>
                                    <TableHead className={`text-right`}>Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processedData.length > 0 ? (
                                    processedData.map((result, index) => (
                                        <TableRow key={result.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                            <TableCell className="font-medium">{result.userName}</TableCell>
                                            <TableCell>{formatDate(result.date)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={result.role === "admin" ? "secondary" : "default"}
                                                    className={
                                                        result.role === "admin"
                                                            ? "bg-purple-500 hover:bg-purple-600"
                                                            : "bg-blue-500 hover:bg-blue-600"
                                                    }
                                                >
                                                    {result.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {result.topics.map((topic, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs border-blue-300 text-blue-700 bg-blue-50"
                                                        >
                                                            {topic}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{result.questions}</TableCell>
                                            <TableCell className="text-right">
                        <span
                            className={
                                result.score / result.questions >= 0.8
                                    ? "text-green-600 font-medium"
                                    : result.score / result.questions >= 0.6
                                        ? "text-amber-600 font-medium"
                                        : "text-red-600 font-medium"
                            }
                        >
                          {result.score}
                        </span>
                                                <span className="text-muted-foreground text-xs ml-1">
                          ({Math.round((result.score / result.questions) * 100)}%)
                        </span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{result.timeSpent}</TableCell>
                                            <TableCell className={`text-right`}>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/results/${result.id}`}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Ko'rmoq
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Hech qanday natija topilmadi.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="border-t text-sm text-muted-foreground">
                        {/*Showing {processedData.length} ta {quizResults.length} results*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllResultsPage;
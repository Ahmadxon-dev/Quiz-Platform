import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Link} from "react-router-dom";
import {Loader2, Eye, ChevronLeft, ChevronRight, Clock, Mail} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";


function ResultsPage(props) {
    const [data, setData] = useState([])
    const user = useSelector(state => state.user)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const totalPages =!loading && Math.ceil(data.length / itemsPerPage)
    const paginatedData =!loading && data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const getPercentageColor = (percentage) => {
        if (percentage >= 80) return "bg-green-500"
        if (percentage >= 60) return "bg-yellow-500"
        return "bg-red-500"
    }

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}m ${remainingSeconds}s`
    }

    const calculateTimeTaken = (startTime, updatedAt) => {
        const start = new Date(startTime).getTime()
        const end = new Date(updatedAt).getTime()
        return formatDuration(Math.floor((end - start) / 1000))
    }
    const getResults = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/results/${user.email}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
                console.log(data)
            })
    }
    useEffect(() => {
        getResults()
    }, [user])
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
            <Card className="w-full max-w-5xl mx-auto my-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Test Natijalari</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.length === 0 ? (
                        <p className="text-lg text-center text-gray-500">Hozircha hech qanday natijalar mavjud emas</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mavzu</TableHead>
                                            <TableHead>Savollar</TableHead>
                                            <TableHead>To'g'ri javoblar</TableHead>
                                            <TableHead>Ball</TableHead>
                                            <TableHead>Ketgan vaqt</TableHead>
                                            <TableHead>Sana</TableHead>
                                            <TableHead className="text-right">Amallar</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((item) => {
                                            const percentage = Math.round((item.result / item.questions.length) * 100)
                                            const timeTaken = calculateTimeTaken(item.startTime, item.updatedAt)
                                            return (
                                                <TableRow key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <TableCell className="font-medium">{item.subtopicname.join(", ")}</TableCell>
                                                    <TableCell>{item.questions.length}</TableCell>
                                                    <TableCell>{item.result}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className={`${getPercentageColor(percentage)} text-white hover:text-black cursor-default`}>
                                                            {percentage}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {timeTaken}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link to={`/results/${item._id}`}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Ko'rmoq
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Ortga
                                </Button>
                                <span className="text-sm text-gray-500">
                Sahifa {currentPage}/{totalPages}
              </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Keyingisi
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/*{data && (*/}
            {/*    <Table*/}
            {/*        className={`xl:w-[60vw] w-full my-20 text-lg  border-2  border-gray-200 rounded mx-auto`}>*/}
            {/*        /!*<TableCaption>A list of your recent invoices.</TableCaption>*!/*/}

            {/*        {*/}
            {/*            (data.length !== 0) && (*/}
            {/*                <>*/}
            {/*                    <TableHeader>*/}
            {/*                        <TableRow>*/}
            {/*                            <TableHead className="w-[100px]">Savollar Soni</TableHead>*/}
            {/*                            <TableHead>To'g'ri javoblar</TableHead>*/}
            {/*                            <TableHead>Foiz</TableHead>*/}
            {/*                            <TableHead>Sanasi</TableHead>*/}
            {/*                            <TableHead>Amallar</TableHead>*/}
            {/*                        </TableRow>*/}
            {/*                    </TableHeader>*/}
            {/*                    <TableBody>*/}
            {/*                        {data.map(item => {*/}
            {/*                            return <TableRow className={``} key={item._id}>*/}
            {/*                                <TableCell className="font-medium">{item.questions.length}</TableCell>*/}
            {/*                                <TableCell>{item.result}</TableCell>*/}
            {/*                                <TableCell>{Math.round(item.result / item.questions.length * 100)} %</TableCell>*/}
            {/*                                <TableCell>{item.createdAt.toLocaleString()}</TableCell>*/}
            {/*                                <TableCell><Link className={`underline`} to={item._id}>Ko'rish(hozircha ishlamaydi)</Link></TableCell>*/}
            {/*                            </TableRow>;*/}
            {/*                        })}*/}

            {/*                    </TableBody>*/}
            {/*                </>*/}
            {/*            )}*/}
            {/*        {data.length === 0 && <h1 className={`text-lg text-center`}>Hozircha hech qanday natija yo'q</h1>}*/}
            {/*    </Table>*/}
            {/*)*/}
            {/*}*/}

            </div>
        </div>
    );
}

export default ResultsPage;
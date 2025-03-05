import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, MinusCircle, Loader2 } from "lucide-react"

function EachResultPage(props) {
    const params = useParams()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const totalQuestions = !loading && data?.questions.length
    const answeredQuestions = !loading && data?.questions.filter((q) => q.selectedAnswer !== null).length
    const correctAnswers = !loading && data?.questions.filter((q) => q.selectedAnswer === q.answer).length
    const getTest = async ()=>{
        await fetch(`${import.meta.env.VITE_SERVER}/test/${params.testId}`)
            .then(res=>res.json())
            .then(data=>{
                setData(data)
                setLoading(false)
            })
    }
    useEffect(()=>{
        getTest()
    }, [])

    if (loading){
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        )
    }
    return (
        <div className="container mx-auto px-4 py-8  dark:bg-gray-900 min-h-screen">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{data.subtopicname} - ko'rib chiqish</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-2">Test boshlangan vaqti: {new Date(data.startTime).toLocaleString()}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
                            <p className="font-semibold">Savollar soni</p>
                            <p className="text-2xl font-bold">{totalQuestions}</p>
                        </div>
                        {/*<div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">*/}
                        {/*    <p className="font-semibold">Javob berilgan savollar</p>*/}
                        {/*    <p className="text-2xl font-bold">{answeredQuestions}</p>*/}
                        {/*</div>*/}
                        <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
                            <p className="font-semibold">To'g'ri javob berilganlar</p>
                            <p className="text-2xl font-bold">{correctAnswers}</p>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg">
                            <p className="font-semibold">Natija</p>
                            <p className="text-2xl font-bold">
                                {data.result} / {totalQuestions}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-6">
                {data.questions.map((question, index) => (
                    <Card
                        key={question._id}
                        className={`border-l-4 ${
                            question.selectedAnswer === question.answer
                                ? "border-green-500"
                                : (question.selectedAnswer === undefined || null)
                                    ? "border-yellow-500"
                                    : "border-red-500"
                        }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-xl flex items-start">
                <span
                    className={`text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0 ${
                        question.selectedAnswer === question.answer
                            ? "bg-green-500"
                            : (question.selectedAnswer === undefined || null)
                                ? "bg-yellow-500"
                                : "bg-red-500"
                    }`}
                >
                  {index + 1}
                </span>
                                {question.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <li
                                        key={optionIndex}
                                        className={`p-3 rounded-lg flex items-center justify-between ${
                                            option === question.answer
                                                ? "bg-green-100 dark:bg-green-800 border-green-500"
                                                : option === question.selectedAnswer
                                                    ? "bg-red-100 dark:bg-red-800 border-red-500"
                                                    : "bg-gray-100 dark:bg-gray-700"
                                        } border-2`}
                                    >
                                        <span>{option}</span>
                                        {option === question.answer && <CheckCircle className="text-green-500" size={24} />}
                                        {option === question.selectedAnswer && option !== question.answer && (
                                            <XCircle className="text-red-500" size={24} />
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 space-y-2">
                                <p className="font-semibold flex items-center">
                                    <span className="mr-2">Belgilangan javob:</span>
                                    {question.selectedAnswer ? (
                                        <span className={question.selectedAnswer === question.answer ? "text-green-500" : "text-red-500"}>
                      {question.selectedAnswer}
                    </span>
                                    ) : (
                                        <span className="text-yellow-500 flex items-center">
                      <MinusCircle className="inline-block mr-1" size={20} />
                      Javob tanlanmagan
                    </span>
                                    )}
                                </p>
                                <p className="font-semibold flex items-center">
                                    <span className="mr-2">To'g'ri javob:</span>
                                    <span className="text-green-500">{question.answer}</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default EachResultPage;
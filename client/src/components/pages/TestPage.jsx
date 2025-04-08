import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Loader2} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {removeAnswer, setTest, updateAnswer} from "@/features/test/testSlice.js";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";

function TestPage() {
    const {testId} = useParams()
    const [loading, setLoading] = useState(true)
    const test = useSelector((state) => state.test.testData)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [currentIndex, setCurrentIndex] = useState(Number(sessionStorage.getItem("currentIndex")) || 0)
    sessionStorage.setItem("currentIndex", Number.parseInt(currentIndex, 10))
    const [timeLeft, setTimeLeft] = useState(() => {
        return JSON.parse(sessionStorage.getItem("timer")) || test.remainingTime
    })
    const [selectedOption, setSelectedOption] = useState(null)
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60
    console.log(test)

    useEffect(() => {
        setLoading(true)
        fetch(`${import.meta.env.VITE_SERVER}/test/${testId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                dispatch(setTest(data))
                const storedIndex = Number(sessionStorage.getItem("currentIndex")) || 0
                setCurrentIndex(storedIndex)
                setSelectedOption(data.questions[storedIndex].selectedAnswer || null)

                if (!sessionStorage.getItem("timer")) {
                    setTimeLeft(data.remainingTime)
                    sessionStorage.setItem("timer", JSON.stringify(data.remainingTime))
                }

                setLoading(false)
            })
    }, [testId])

    useEffect(() => {
        sessionStorage.setItem("timer", JSON.stringify(timeLeft))
    }, [timeLeft])

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    handleSubmit()
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft]) // <- Depend on timeLeft to keep updating correctly

    const handleNext = () => {
        if (currentIndex < test.questions.length - 1) {
            handleQuestionChange(currentIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            handleQuestionChange(currentIndex - 1)
        }
    }

    const handleAnswerSelect = async (answer) => {
        console.log("answer: " + answer)
        // const finalAnswer = "option"+ Number(Object.values(test.questions[currentIndex].options).indexOf(answer))
        setSelectedOption(answer)
        dispatch(updateAnswer({index: currentIndex, answer}))

        try {
            await fetch(`${import.meta.env.VITE_SERVER}/test/${testId}/answer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionIndex: currentIndex,
                    selectedAnswer: answer,
                }),
            })
        } catch (error) {
            console.error("Error updating answer:", error)
        }
    }
    const handleRemoveAnswerSelect = async () => {
        setSelectedOption(null)
        dispatch(removeAnswer({index: currentIndex}))

        try {
            await fetch(`${import.meta.env.VITE_SERVER}/test/${testId}/answer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionIndex: currentIndex,
                    selectedAnswer: null,
                }),
            })
        } catch (error) {
            console.error("Error updating answer:", error)
        }
    }

    const handleSubmit = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/submit/${testId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                remainingTime: timeLeft,
                isCompleted: true,
            }),
        })

        sessionStorage.removeItem("timer")
        sessionStorage.removeItem("currentIndex")
        navigate("/results")
    }

    const handleQuestionChange = (index) => {
        setCurrentIndex(index)
        setSelectedOption(test.questions[index].selectedAnswer || null)
    }

    if (loading) {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        )
    }
    return (
        <div className=" bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full mx-auto">
            <CardHeader className="border-b pb-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/*<h2 className="text-xl font-medium">*/}
                    {/*    {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:*/}
                    {/*    {seconds < 10 ? `0${seconds}` : seconds}*/}
                    {/*</h2>*/}
                    <CardTitle className="text-2xl md:text-3xl font-bold text-center my-2 md:my-0">
                        {test.subtopicname.map((subtopic, index) => (
                            <span key={subtopic}>
                                {subtopic}{index !== test.subtopicname.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        Savol {+currentIndex + 1}/{test.questions.length}
                    </div>
                </div>
            </CardHeader>
            <div className="grid grid-cols-12 gap-4">
                <CardContent className="col-span-10 justify-center px-8 py-6">
                    <div className="mb-4">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                    width: `${(test.questions.filter(q => q.selectedAnswer).length / test.questions.length) * 100}%`
                                }}
                            ></div>
                        </div>
                        <div className="text-sm text-center mt-1">
                            {test.questions.filter(q => q.selectedAnswer).length} / {test.questions.length} javob
                            berilgan
                        </div>
                    </div>
                    <div className="mb-6">
                        {test.questions[currentIndex].questionImage && (
                            <img
                                src={test?.questions[currentIndex]?.questionImage}
                                className={`w-auto h-auto mx-auto`}
                                alt="rasm"
                            />
                        )}
                        <h2 className="text-3xl font-semibold mb-12 text-center">{test.questions[currentIndex].questionText}</h2>
                        <RadioGroup
                            value={
                                test.questions[currentIndex].selectedAnswer
                                    ? test.questions[currentIndex].selectedAnswer
                                    : selectedOption
                            }
                            onValueChange={(e) => handleAnswerSelect(e)}
                            className="space-y-8"
                        >
                            {test.questions.length > 1
                                ? Object.values(test.questions[currentIndex].options).map((option, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <RadioGroupItem value={"option" + Number(index + 1)} id={`option-${index}`}/>
                                        <Label htmlFor={`option-${index}`}
                                               className="text-xl flex justify-between items-center">
                                            {option.text}
                                            {option.image && (
                                                <img src={option.image} className={`w-auto h-auto`}
                                                     alt="rasm"/>
                                            )}
                                        </Label>
                                    </div>
                                ))
                                : "test yoq"}
                            <Button variant={"outline"} className={`w-fit `} onClick={handleRemoveAnswerSelect}>
                                Belgilanganlarni o'chirish
                            </Button>
                        </RadioGroup>
                    </div>
                </CardContent>

                {/* Question navigation card on the right */}
                <div className="w-full p-4 col-span-2 border-l border-gray-200">
                    <div className="sticky top-4">
                        <h2 className="text-2xl text-center mb-4  font-medium">
                            {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                            {seconds < 10 ? `0${seconds}` : seconds}
                        </h2>
                        {/*<h3 className="text-lg font-medium mb-4 text-center">Savollar</h3>*/}
                        <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(48px,1fr))]">
                            {test.questions.map((_, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        currentIndex === index ? "default" : test.questions[index].selectedAnswer ? "secondary" : "outline"
                                    }
                                    onClick={() => handleQuestionChange(index)}
                                    className={`h-10 w-10 p-0 ${
                                        test.questions[index].selectedAnswer
                                            ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                                            : ""
                                    }`}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="w-full"
                            >
                                Ortga
                            </Button>

                            {currentIndex < test.questions.length - 1 && (
                                <Button size="lg" className="w-full" onClick={handleNext}>
                                    Keyingisi
                                </Button>
                            )}

                            {test.questions.length - 1 === currentIndex && (
                                <Button size="lg" className="w-full" onClick={handleSubmit}>
                                    Topshirish
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        </div>
    )
}

export default React.memo(TestPage);

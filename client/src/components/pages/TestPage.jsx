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
    const {testId} = useParams();
    const [loading, setLoading] = useState(true);
    const test = useSelector((state) => state.test.testData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(Number(localStorage.getItem('currentIndex')) || 0);
    localStorage.setItem("currentIndex", parseInt(currentIndex, 10))
    const [timeLeft, setTimeLeft] = useState(() => {
        return JSON.parse(localStorage.getItem("timer")) || test.remainingTime;
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_SERVER}/test/${testId}`)
            .then((res) => res.json())
            .then((data) => {
                dispatch(setTest(data));

                if (!localStorage.getItem("timer")) {
                    setTimeLeft(data.remainingTime);
                    localStorage.setItem("timer", JSON.stringify(data.remainingTime));
                }

                setLoading(false);
            });
    }, [testId]);

    useEffect(() => {
        localStorage.setItem("timer", JSON.stringify(timeLeft));
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]); // <- Depend on timeLeft to keep updating correctly


    const handleNext = () => {
        if (currentIndex < test.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswerSelect = async (answer) => {
        setSelectedOption(answer);
        dispatch(updateAnswer({index: currentIndex, answer}));

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
            });
        } catch (error) {
            console.error("Error updating answer:", error);
        }
    };
    const handleRemoveAnswerSelect = async () => {
        setSelectedOption(null);
        dispatch(removeAnswer({index: currentIndex}));

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
            });
        } catch (error) {
            console.error("Error updating answer:", error);
        }
    };


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
        });

        localStorage.removeItem("timer");
        localStorage.removeItem("currentIndex")
        navigate("/results");
    };

    if (loading) {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        );
    }

    return (
            <div className=" bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className=" mx-auto">
            <Card className="w-[80vw] h-[80vh] mx-auto flex flex-col">
                <CardHeader className={`flex flex-row justify-between`}>
                    <h2 className={`text-3xl text-start font-semibold mb-12 `}>
                        {hours < 10 ? `0${hours}` : hours}:
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </h2>
                    <CardTitle className="text-4xl font-bold text-center">
                        {/*{test.subtopicname.forEach(subtopic=>{*/}
                        {/*    return subtopic*/}
                        {/*})}*/}
                        Subtopic name
                    </CardTitle>
                    <div className="mt-4 text-sm text-gray-500">
                    Savol {+currentIndex + 1}/{test.questions.length}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center px-8 py-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-semibold mb-12 text-center">
                            {test.questions[currentIndex].question}
                        </h2>
                        <RadioGroup
                            value={test.questions[currentIndex].selectedAnswer ? test.questions[currentIndex].selectedAnswer : selectedOption}
                            onValueChange={(e) => handleAnswerSelect(e)}
                            className="space-y-8"
                        >
                            {test.questions.length > 1
                                ? test.questions[currentIndex].options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <RadioGroupItem value={option} id={`option-${index}`}/>
                                        <Label htmlFor={`option-${index}`} className="text-xl">
                                            {option}
                                        </Label>
                                    </div>
                                ))
                                : "test yoq"}
                            <Button variant={"outline"} className={`w-fit `} onClick={handleRemoveAnswerSelect}>Belgilanganlarni o'chirish</Button>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto px-8 py-6">
                    <Button size="lg" variant="outline" onClick={handlePrevious} disabled={currentIndex===0}>
                        Ortga
                    </Button>
                    <div>
                        <Button size="lg" className={`mr-4`} onClick={handleNext}
                                disabled={(test.questions.length - 1) === currentIndex}>
                            Keyingisi
                        </Button>

                        {
                            (test.questions.length - 1) === currentIndex && <Button size={`lg`} onClick={handleSubmit}
                            >
                                Topshirish
                            </Button>
                        }
                    </div>
                </CardFooter>

            </Card>
        </div>
            </div>
    );
}

export default React.memo(TestPage);

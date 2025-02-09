import React, {useEffect, useState} from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate} from "react-router-dom";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Loader2} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {setTest} from "@/features/test/testSlice.js";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Card} from "@/components/ui/card.jsx";


function DefiningTestPage(props) {
    const [selectedMaintopic, setSelectedMaintopic] = useState('');
    const [selectedSubtopics, setSelectedSubtopics] = useState([]);
    const [loadingforBtn, setLoadingforBtn] = useState(false)
    const [topicsData, setTopicsData] = useState([])
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user);
    const navigate = useNavigate()
    const selectedTopicData = topicsData.find(topic => topic.maintopicname === selectedMaintopic);
    const subtopics = selectedTopicData ? selectedTopicData.subtopics : [];
    const [time, setTime] = useState({soat: "00", daqiqa: "00", soniya: "00"})
    let timeSeconds = +time.soat * 60 * 60 + +time.daqiqa * 60 + +time.soniya
    let selectedSubTopicNames = []
    selectedSubtopics.forEach(subtopic => {
        selectedSubTopicNames.push(subtopic.subtopicname)
    })
    console.log(selectedSubTopicNames)
    const getFullDb = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`)
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setTopicsData(data)
                console.log(data)
            })
    }
    useEffect(() => {
        getFullDb()
    }, [])
    const handleInputChange = (e, unit) => {
        let value = e.target.value
        value = value.replace(/^0+/, "")
        const max = unit === "soat" ? 23 : 59
        const numValue = Number.parseInt(value || "0", 10)
        const validValue = Math.min(Math.max(numValue, 0), max)
        const formattedValue = validValue.toString().padStart(2, "0")

        setTime((prevTime) => ({...prevTime, [unit]: formattedValue}))
    }
    const handleStart = async () => {
        let timeSeconds = +time.soat * 60 * 60 + +time.daqiqa * 60 + +time.soniya
        setLoadingforBtn(true)
        await fetch(`${import.meta.env.VITE_SERVER}/test/start`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                time: timeSeconds,
                subtopicnamesArray: selectedSubTopicNames, //selected subtopic with questions,
                userEmail: user.email,
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoadingforBtn(false)
                dispatch(setTest(data.newTest))
                navigate(`/test/${data.testId}`)
            })
    }
    const handleItemToggle = (item) => {
        setSelectedSubtopics((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
    }

    if (loading) {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-fit">
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className={`max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Test yechish uchun bo'lim,
                            mavzu va vaqtni kiriting</h2>
                        <form className={`space-y-4 flex flex-col mx-auto justify-center items-center`}></form>
                        <div className={`mb-3`}>
                            <Label htmlFor="maintopic">Bo'limni tanlang </Label>
                            {/*onSelect={(event)=>event.preventDefault()}*/}
                            <Select className={`z-50`} id="maintopic" value={selectedMaintopic}
                                    onValueChange={(value) => {
                                        setSelectedMaintopic(value);
                                        setSelectedSubtopics([]);
                                    }}>
                                <SelectTrigger className="min-w-full outline-none">
                                    <SelectValue placeholder="Bo'limlar"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {topicsData.map((topic, index) => (
                                        <SelectItem key={index}
                                                    value={topic.maintopicname}>{topic.maintopicname}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedMaintopic && (
                            <div className="space-y-2">
                                <Label>Mavzularni tanlang</Label>
                                {
                                    subtopics.map(subtopic => (
                                        <div key={subtopic.subtopicname} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={subtopic.subtopicname}
                                                checked={selectedSubtopics.includes(subtopic)}
                                                onCheckedChange={() => handleItemToggle(subtopic)}
                                            />
                                            <label
                                                htmlFor={subtopic.subtopicname}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {subtopic.subtopicname}
                                            </label>
                                        </div>
                                    ))
                                }


                            </div>
                        )}
                        <div className="mb-3 grid grid-cols-3 gap-4">
                            {(["soat", "daqiqa", "soniya"]).map((unit) => (
                                <div key={unit} className="space-y-2">
                                    <Label htmlFor={unit} className="text-sm font-medium text-gray-700 capitalize">
                                        {unit}
                                    </Label>
                                    <Input
                                        type="number"
                                        id={unit}
                                        name={unit}
                                        value={time[unit]}
                                        onChange={(e) => handleInputChange(e, unit)}
                                        min={0}
                                        placeholder={"00"}
                                        max={unit === "soat" ? 23 : 59}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            ))}
                        </div>
                        {/*{selectedSubtopic && (*/}
                        <div>
                            <Button disabled={loadingforBtn && true} className={`w-full`} onClick={handleStart}>
                                Testni boshlash
                                {loadingforBtn ? <Loader2 className="ml-2 h-4 w-4 animate-spin"/> : ""}
                            </Button>

                        </div>
                        {/*)}*/}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DefiningTestPage;
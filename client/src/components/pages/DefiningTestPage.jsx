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

// const topicsData = [
//     {
//         "maintopicname": "Electromagnetism",
//         "subtopics": [
//             {
//                 "subtopicname": "Electric Circuits",
//                 "questions": [
//                     {
//                         "questionId": "8923466156465",
//                         "question": "What is the current through a 2 ohm resistor when a 10 V potential difference is applied across it?",
//                         "answer": "5 A",
//                         "options": [
//                             "2 A",
//                             "5 A",
//                             "7 A",
//                             "10 A"
//                         ]
//                     },
//                     {
//                         "questionId": "313565487979",
//                         "question": "If a circuit has a total resistance of 10 ohms and a voltage of 20 V, what is the current?",
//                         "answer": "2 A",
//                         "options": [
//                             "0.5 A",
//                             "1 A",
//                             "2 A",
//                             "4 A"
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "subtopicname": "Magnetic Fields",
//                 "questions": [
//                     {
//                         "questionId": "2146245124412445",
//                         "question": "What is the direction of the magnetic field around a current-carrying wire?",
//                         "answer": "It forms concentric circles around the wire.",
//                         "options": [
//                             "In straight lines",
//                             "In concentric circles",
//                             "Along the wire",
//                             "Perpendicular to the wire"
//                         ]
//                     },
//                     {
//                         "questionId": "212313497946464",
//                         "question": "What is the force on a charged particle moving in a magnetic field?",
//                         "answer": "It depends on the charge, speed, and angle of the particle relative to the field.",
//                         "options": [
//                             "It depends on the charge only",
//                             "It depends on the charge and speed only",
//                             "It depends on the charge, speed, and angle",
//                             "It is always zero"
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "maintopicname": "Mechanics",
//         "subtopics": [
//             {
//                 "subtopicname": "Kinematics",
//                 "questions": [
//                     {
//                         "questionId": "456",
//                         "question": "What is the velocity of an object after 10 seconds if it starts from rest and accelerates at 2 m/s²?",
//                         "answer": "20 m/s",
//                         "options": [
//                             "10 m/s",
//                             "20 m/s",
//                             "30 m/s",
//                             "40 m/s"
//                         ]
//                     },
//                     {
//                         "questionId": "967",
//                         "question": "What is the displacement of an object moving at constant velocity of 5 m/s for 3 seconds?",
//                         "answer": "15 m",
//                         "options": [
//                             "10 m",
//                             "15 m",
//                             "20 m",
//                             "25 m"
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "subtopicname": "Newton's Laws",
//                 "questions": [
//                     {
//                         "questionId": "465154",
//                         "question": "What is the force required to accelerate a 5 kg object at 2 m/s²?",
//                         "answer": "10 N",
//                         "options": [
//                             "5 N",
//                             "10 N",
//                             "15 N",
//                             "20 N"
//                         ]
//                     },
//                     {
//                         "questionId": "34162647",
//                         "question": "If an object has a mass of 10 kg and is experiencing a force of 30 N, what is its acceleration?",
//                         "answer": "3 m/s²",
//                         "options": [
//                             "1 m/s²",
//                             "2 m/s²",
//                             "3 m/s²",
//                             "4 m/s²"
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ];

function DefiningTestPage(props) {
    const [selectedMaintopic, setSelectedMaintopic] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [loadingforBtn, setLoadingforBtn] = useState(false)
    const [topicsData, setTopicsData] = useState([])
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user);
    const navigate = useNavigate()
    const selectedTopicData = topicsData.find(topic => topic.maintopicname === selectedMaintopic);
    const subtopics = selectedTopicData ? selectedTopicData.subtopics : [];
    const [time, setTime] = useState({ soat: "00", daqiqa: "00", soniya: "00" })
    let timeSeconds =+time.soat*60*60+ +time.daqiqa*60+ +time.soniya
    console.log(timeSeconds)
    const getFullDb = async ()=>{
        await fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`)
            .then(res=>res.json())
            .then(data=>{
                setLoading(false)
                setTopicsData(data)
                console.log(`questions are here`)
            })
    }
    useEffect(()=>{
        getFullDb()
    }, [])
    const handleInputChange = (e, unit) => {
        let value = e.target.value
        value = value.replace(/^0+/, "")
        const max = unit === "soat" ? 23 : 59
        const numValue = Number.parseInt(value || "0", 10)
        const validValue = Math.min(Math.max(numValue, 0), max)
        const formattedValue = validValue.toString().padStart(2, "0")

        setTime((prevTime) => ({ ...prevTime, [unit]: formattedValue }))
    }
    const handleStart =async ()=>{
        let timeSeconds =+time.soat*60*60+ +time.daqiqa*60+ +time.soniya
        console.log(timeSeconds)
        setLoadingforBtn(true)
        await fetch(`${import.meta.env.VITE_SERVER}/test/start`, {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                time:timeSeconds,
                subtopicname:selectedSubtopic, //selected subtopic with questions,
                userEmail:user.email,
            })
        })
            .then(res=>res.json())
            .then(data=> {
                setLoadingforBtn(false)
                dispatch(setTest(data.newTest))
                navigate(`/test/${data.testId}`)
            })
    }

    if (loading){
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        )
    }

    return (
        <div className={`max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Test yechish uchun bo'lim, mavzu va vaqtni kiriting</h2>
            <form className={`space-y-4 flex flex-col mx-auto justify-center items-center`}></form>
                <div className={`mb-3`}>
                    <Label htmlFor="maintopic" >Bo'limni tanlang </Label>
                    {/*onSelect={(event)=>event.preventDefault()}*/}
                    <Select className={`z-50`} id="maintopic"  value={selectedMaintopic}  onValueChange={(value) => {
                        setSelectedMaintopic(value);
                        setSelectedSubtopic('');
                    }}>
                        <SelectTrigger className="min-w-full outline-none">
                            <SelectValue placeholder="Bo'limlar"/>
                        </SelectTrigger>
                        <SelectContent>
                            {topicsData.map((topic, index) => (
                                <SelectItem key={index} value={topic.maintopicname}>{topic.maintopicname}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/*{selectedMaintopic && (*/}
                    <div className={`mb-3`}>
                        <Label htmlFor="subtopic" >Mavzuni tanlang </Label>
                        <Select  id="subtopic" value={selectedSubtopic} onValueChange={(value) => {
                            setSelectedSubtopic(value);
                        }}>
                            <SelectTrigger className="w-full outline-none">
                                <SelectValue placeholder="Mavzular"/>
                            </SelectTrigger>
                            <SelectContent>
                                {subtopics.map((subtopic) => (
                                    <SelectItem key={subtopic.subtopicname}
                                                value={subtopic.subtopicname}>{subtopic.subtopicname}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                {/*)}*/}
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
                            {loadingforBtn?<Loader2 className="ml-2 h-4 w-4 animate-spin" />:""}
                        </Button>

                </div>
            {/*)}*/}
        </div>
    );
}

export default DefiningTestPage;
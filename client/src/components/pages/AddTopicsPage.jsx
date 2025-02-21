import React, {useEffect} from 'react';
import {useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {Plus, Edit, Trash2, Loader2} from "lucide-react"
import {useToast} from "@/hooks/use-toast.js";



function AddTopicsPage(props) {
    const [database, setDatabase] = useState([])
    const [loading, setLoading] = useState(true)
    const {toast} = useToast()
    const getData = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`,)
            .then(res => res.json())
            .then(data => {
                setDatabase(data)
                console.log(data)
                setLoading(false)
            })
    }
    useEffect(() => {
        getData()
    }, [])

    if (loading) {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        );
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Bo'limlar, Mavzular va savollar qo'shish</h1>
            <Tabs defaultValue="main-topics">
                <TabsList>
                    <TabsTrigger value="main-topics">Bo'limlar</TabsTrigger>
                    <TabsTrigger value="subtopics">Mavzular</TabsTrigger>
                    <TabsTrigger value="questions">Savollar</TabsTrigger>
                </TabsList>
                <TabsContent value="main-topics">
                    <MainTopicsTab database={database} setDatabase={setDatabase}/>
                </TabsContent>
                <TabsContent value="subtopics">
                    <SubtopicsTab database={database} setDatabase={setDatabase}/>
                </TabsContent>
                <TabsContent value="questions">
                    <QuestionsTab database={database} setDatabase={setDatabase}/>
                </TabsContent>
            </Tabs>
        </div>
    );
}


function MainTopicsTab({database, setDatabase}) {
    const [newMainTopic, setNewMainTopic] = useState("")
    const [loadingforMainTopicAdd, setLoadingForMainTopicAdd] = useState(false)
    const [loadingforMainTopicDelete, setLoadingForMainTopicDelete] = useState({})
    const [editMainTopic, setEditMainTopic] = useState("")
    const {toast} = useToast()

    const createNewMaintopic = async () => {
        if (newMainTopic === "") {
            toast({
                title: "Maydonni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        setLoadingForMainTopicAdd(true)
        await fetch(`${import.meta.env.VITE_SERVER}/test/topics/add`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newMainTopic
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setNewMainTopic("")
                setLoadingForMainTopicAdd(false)
            })
    }

    const deleteMainTopic = async (mainTopicId) => {
        setLoadingForMainTopicDelete((prev) => ({...prev, [mainTopicId]: true}));
        await fetch(`${import.meta.env.VITE_SERVER}/test/topics/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setLoadingForMainTopicDelete((prev) => ({...prev, [mainTopicId]: false}));
            })
    }

    const updateMainTopic = async (mainTopicId) => {
        if (editMainTopic === "") {
            toast({
                title: "Maydonni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        await fetch(`${import.meta.env.VITE_SERVER}/test/topics/edit`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                newMainTopicName: editMainTopic
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setEditMainTopic("")
            })
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Bo'limlar</h2>
            <div className="flex gap-2 mb-4">
                <Input placeholder="Yangi bo'lim" value={newMainTopic}
                       onChange={(e) => setNewMainTopic(e.target.value)}/>
                <Button onClick={createNewMaintopic} disabled={loadingforMainTopicAdd}>
                    {loadingforMainTopicAdd ? <Loader2 className="ml-2 h-4 w-4 animate-spin"/> :
                        <Plus className="mr-2 h-4 w-4"/>}
                    Qo'shish
                </Button>
            </div>
            <ul className="space-y-2">
                {database.map((topic, index) => (
                    <li key={topic._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        {topic.maintopicname}
                        <div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Bo'lim nomini o'zgartirish</DialogTitle>
                                    </DialogHeader>
                                    <Input placeholder="Mavzu nomi" defaultValue={topic.maintopicname}
                                           onChange={e => setEditMainTopic(e.target.value)}/>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="submit"
                                                onClick={() => updateMainTopic(topic._id)}
                                            >
                                                O'zgartirish
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => deleteMainTopic(topic._id)}>
                                {loadingforMainTopicDelete[topic._id] ?
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function SubtopicsTab({database, setDatabase}) {
    const [newSubTopic, setNewSubTopic] = useState("")
    const [loadingforSubtopicsAdd, setLoadingforSubtopicsAdd] = useState(false)
    const [loadingforSubtopicsDelete, setLoadingforSubtopicsDelete] = useState({})
    const [editSubTopic, setEditSubTopic] = useState("")
    const {toast} = useToast()
    const addSubtopic = async (mainTopicId) => {
        if (newSubTopic === "") {
            toast({
                title: "Maydonni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        setLoadingforSubtopicsAdd(true)
        await fetch(`${import.meta.env.VITE_SERVER}/test/subtopics/add`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newSubTopic,
                mainTopicId
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setNewSubTopic("")
                setLoadingforSubtopicsAdd(false)
            })
    }

    const deleteSubtopic = async (mainTopicId, subTopicName) => {

        setLoadingforSubtopicsDelete((prev) => ({...prev, [subTopicName]: true}));
        await fetch(`${import.meta.env.VITE_SERVER}/test/subtopics/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                subTopicName
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setLoadingforSubtopicsDelete((prev) => ({...prev, [subTopicName]: false}));
            })
    }

    const updateSubTopic = async (mainTopicId, oldSubTopicName) => {
        if (editSubTopic === "") {
            toast({
                title: "Maydonni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        await fetch(`${import.meta.env.VITE_SERVER}/test/subtopics/edit`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                newSubTopicName: editSubTopic,
                oldSubTopicName
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setEditSubTopic("")
            })
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Mavzular</h2>
            <Accordion type="single" collapsible className="w-full">
                {database.map((topic, topicIndex) => (
                    <AccordionItem key={topicIndex} value={`item-${topicIndex}`}>
                        <AccordionTrigger>{topic.maintopicname}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2">
                                {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <li key={subtopicIndex}
                                        className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                        {subtopic.subtopicname}
                                        <div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4"/>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Mavzu nomini o'zgartirish</DialogTitle>
                                                    </DialogHeader>
                                                    <Input placeholder="Mavzu nomi" defaultValue={subtopic.subtopicname}
                                                           onChange={e => setEditSubTopic(e.target.value)}/>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button
                                                                type="submit"
                                                                onClick={() => updateSubTopic(topic._id, subtopic.subtopicname,)}
                                                            >
                                                                O'zgartirish
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon"
                                                    onClick={() => deleteSubtopic(topic._id, subtopic.subtopicname)}>
                                                {loadingforSubtopicsDelete[subtopic.subtopicname] ?
                                                    <Loader2 className="ml-2 h-4 w-4 animate-spin"/> :
                                                    <Trash2 className="h-4 w-4"/>}
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Plus className="mr-2 h-4 w-4"/> Mavzu Qo'shish
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Yangi Mavzu Qo'shish</DialogTitle>
                                        </DialogHeader>
                                        <Input placeholder="Subtopic name" id={`new-subtopic-${topicIndex}`}
                                               value={newSubTopic} onChange={e => setNewSubTopic(e.target.value)}/>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="submit"
                                                    onClick={() => addSubtopic(topic._id)}
                                                    disabled={loadingforSubtopicsAdd}
                                                >
                                                    {loadingforSubtopicsAdd &&
                                                        <Loader2 className="ml-2 h-4 w-4 animate-spin"/>}
                                                    Qo'shish
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function QuestionsTab({database, setDatabase}) {
    const [questionAnswer, setQuestionAnswer] = useState("")
    const [question, setQuestion] = useState("")
    const [option1, setOption1] = useState("")
    const [option2, setOption2] = useState("")
    const [option3, setOption3] = useState("")
    const [option4, setOption4] = useState("")
    const [loadingforQuestionDelete, setLoadingforQuestionDelete] = useState({})
    const {toast} = useToast()
    const createQuestion = async (mainTopicId, subTopicName)=>{
        if (questionAnswer === "" || question === "" || option2 === "" || option1 === "" || option3 === "" || option4=== "") {
            toast({
                title: "Barcha maydonlarni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        await fetch(`${import.meta.env.VITE_SERVER}/test/questions/add`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                subTopicName,
                question:question,
                answer:questionAnswer,
                options: [option1, option2, option3, option4]
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setQuestion("")
                setQuestionAnswer("")
                setOption1("")
                setOption2("")
                setOption3("")
                setOption4("")
            })
    }

    const updateQuestion = async (mainTopicId, subTopicName, questionId) =>{
        if (question === "" || questionAnswer === "" || option4 === "" || option3 === "" || option2 === "" || option1 === "" ){
            toast({
                title: "Barcha maydonlarni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            return
        }
        await fetch(`${import.meta.env.VITE_SERVER}/test/questions/edit`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                subTopicName,
                questionId,
                newQuestion: question,
                answer:questionAnswer,
                options: [option1, option2, option3, option4]
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setQuestion("")
                setQuestionAnswer("")
                setOption1("")
                setOption2("")
                setOption3("")
                setOption4("")
            })
    }
    const deleteQuestion = async (mainTopicId, subTopicName, questionId) => {
        setLoadingforQuestionDelete((prev) => ({...prev, [questionId]: true}));
        await fetch(`${import.meta.env.VITE_SERVER}/test/questions/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainTopicId,
                subTopicName,
                questionId
            })
        })
            .then(res => res.json())
            .then(data => {
                setDatabase(data.newData)
                toast({
                    title: data.msg,
                    variant: "success",
                    duration: 4000,
                })
                setLoadingforQuestionDelete((prev) => ({...prev, [questionId]: false}));
            })
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Savollar</h2>
            <Accordion type="single" collapsible className="w-full">
                {database.map((topic, topicIndex) => (
                    <AccordionItem key={topicIndex} value={`item-${topicIndex}`}>
                        <AccordionTrigger>{topic.maintopicname}</AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="single" collapsible className="w-full">
                                {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <AccordionItem key={subtopic.subtopicname} value={`subitem-${topicIndex}-${subtopicIndex}`}>
                                        <AccordionTrigger>{subtopic.subtopicname}</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2">
                                                {subtopic.questions.map((question, questionIndex) => (
                                                    <li key={question.questionId} className="p-2 bg-gray-100 rounded">
                                                        <p className="font-medium">{question.question}</p>
                                                        <p className="text-sm text-gray-600">Javob: {question.answer}</p>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={()=>{
                                                                        setQuestion(question.question)
                                                                        setQuestionAnswer(question.answer)
                                                                        setOption1(question.options[0])
                                                                        setOption2(question.options[1])
                                                                        setOption3(question.options[2])
                                                                        setOption4(question.options[3])
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4"/>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Savolni o'zgartirish</DialogTitle>

                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <Textarea placeholder="Savol"
                                                                              id={`new-question-${topicIndex}-${subtopicIndex}`}
                                                                              defaultValue={question.question}
                                                                              onChange={e=>setQuestion(e.target.value)}
                                                                    />
                                                                    <Input placeholder="To'g'ri javob"
                                                                           id={`new-answer-${topicIndex}-${subtopicIndex}`}
                                                                           defaultValue={questionAnswer}
                                                                           onChange={e=>setQuestionAnswer(e.target.value)}
                                                                    />
                                                                    <Input placeholder="Variant 1"
                                                                           id={`new-option1-${topicIndex}-${subtopicIndex}`}
                                                                           defaultValue={question.options[0]}
                                                                           onChange={e=>setOption1(e.target.value)}
                                                                    />
                                                                    <Input placeholder="Variant 2"
                                                                           id={`new-option2-${topicIndex}-${subtopicIndex}`}
                                                                           defaultValue={question.options[1]}
                                                                           onChange={e=>setOption2(e.target.value)}
                                                                    />
                                                                    <Input placeholder="Variant 3"
                                                                           id={`new-option3-${topicIndex}-${subtopicIndex}`}
                                                                           defaultValue={question.options[2]}
                                                                           onChange={e=>setOption3(e.target.value)}
                                                                    />
                                                                    <Input placeholder="Variant 4"
                                                                           id={`new-option4-${topicIndex}-${subtopicIndex}`}
                                                                           defaultValue={question.options[3]}
                                                                           onChange={e=>setOption4(e.target.value)}
                                                                    />
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            type="submit"
                                                                            onClick={()=> updateQuestion(topic._id, subtopic.subtopicname, question.questionId)}
                                                                        >
                                                                            O'zgartirish
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={()=>deleteQuestion(topic._id, subtopic.subtopicname, question.questionId)}
                                                            disabled={loadingforQuestionDelete[question.questionId]}
                                                        >
                                                            {loadingforQuestionDelete[question.questionId] ?
                                                                <Loader2 className="ml-2 h-4 w-4 animate-spin"/> :
                                                                <Trash2 className="h-4 w-4"/>}
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">
                                                            <Plus className="mr-2 h-4 w-4"/> Savol Qo'shish
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Yangi savol qo'shish</DialogTitle>

                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <Textarea placeholder="Savol"
                                                                      id={`new-question-${topicIndex}-${subtopicIndex}`}
                                                                      value={question}
                                                                      onChange={e=>setQuestion(e.target.value)}
                                                            />
                                                            <Input placeholder="To'g'ri javob"
                                                                   id={`new-answer-${topicIndex}-${subtopicIndex}`}
                                                                   value={questionAnswer}
                                                                   onChange={e=>setQuestionAnswer(e.target.value)}
                                                            />
                                                            <Input placeholder="Variant 1"
                                                                   id={`new-option1-${topicIndex}-${subtopicIndex}`}
                                                                    value={option1}
                                                                   onChange={e=>setOption1(e.target.value)}
                                                            />
                                                            <Input placeholder="Variant 2"
                                                                   id={`new-option2-${topicIndex}-${subtopicIndex}`}
                                                                   value={option2}
                                                                   onChange={e=>setOption2(e.target.value)}
                                                            />
                                                            <Input placeholder="Variant 3"
                                                                   id={`new-option3-${topicIndex}-${subtopicIndex}`}
                                                                   value={option3}
                                                                   onChange={e=>setOption3(e.target.value)}
                                                            />
                                                            <Input placeholder="Variant 4"
                                                                   id={`new-option4-${topicIndex}-${subtopicIndex}`}
                                                                   value={option4}
                                                                   onChange={e=>setOption4(e.target.value)}
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button
                                                                    type="submit"
                                                                    onClick={()=> createQuestion(topic._id, subtopic.subtopicname)}
                                                                >
                                                                    Qo'shish
                                                                </Button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default AddTopicsPage;
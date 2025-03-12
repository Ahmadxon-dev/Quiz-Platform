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
import {Plus, Edit, Trash2, Loader2, X, Image} from "lucide-react"
import {useToast} from "@/hooks/use-toast.js";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Label} from "@/components/ui/label.jsx";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


function AddTopicsPage(props) {
    const [database, setDatabase] = useState([])
    const [loading, setLoading] = useState(true)
    const {toast} = useToast()
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    if (user.role === "user") {
        navigate("/")
    }
    const getData = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`,)
            .then(res => res.json())
            .then(data => {
                setDatabase(data)
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

function MathSymbolsToolbar({onInsertSymbol}) {
    const symbols = {
        Asosiy: [
            {symbol: "π", label: "Pi"},
            {symbol: "±", label: "Plus-minus"},
            {symbol: "•", label: "Multiply"},
            {symbol: "÷", label: "Divide"},
            {symbol: "=", label: "Equals"},
            {symbol: "≠", label: "Not equals"},
            {symbol: "≈", label: "Approximately"},
            {symbol: "∞", label: "Infinity"},
        ],
        Funksiyalar: [
            {symbol: "sin()", label: "Sine"},
            {symbol: "cos()", label: "Cosine"},
            {symbol: "tan()", label: "Tangent"},
            {symbol: "log()", label: "Logarithm"},
            {symbol: "ln()", label: "Natural log"},
            {symbol: "√()", label: "Square root"},
            {symbol: "∛()", label: "Cube root"},
        ],
        Operatorlar: [
            {symbol: "^", label: "Power"},
            {symbol: "∑", label: "Sum"},
            {symbol: "∏", label: "Product"},
            {symbol: "∫", label: "Integral"},
            {symbol: "∂", label: "Partial"},
            {symbol: "∇", label: "Nabla"},
            {symbol: "Δ", label: "Delta"},
        ],
        Taqqoslash: [
            {symbol: "<", label: "Less than"},
            {symbol: ">", label: "Greater than"},
            {symbol: "≤", label: "Less or equal"},
            {symbol: "≥", label: "Greater or equal"},
            {symbol: "∈", label: "Element of"},
            {symbol: "⊂", label: "Subset"},
            {symbol: "⊆", label: "Subset or equal"},
        ],
        Kasrlar: [
            {symbol: "½", label: "1/2"},
            {symbol: "⅓", label: "1/3"},
            {symbol: "¼", label: "1/4"},
            {symbol: "⅕", label: "1/5"},
            {symbol: "⅙", label: "1/6"},
            {symbol: "⅛", label: "1/8"},
            {symbol: "a/b", label: "Ixtiyoriy kasr"},
        ],
        Superscripts: [
            { symbol: "⁰", label: "⁰" },
            { symbol: "¹", label: "¹" },
            { symbol: "²", label: "²" },
            { symbol: "³", label: "³" },
            { symbol: "⁴", label: "⁴" },
            { symbol: "⁵", label: "⁵" },
            { symbol: "⁶", label: "⁶" },
            { symbol: "⁷", label: "⁷" },
            { symbol: "⁸", label: "⁸" },
            { symbol: "⁹", label: "⁹" },
            { symbol: "⁺", label: "plus" },
            { symbol: "⁻", label: "minus" },
            { symbol: "⁄", label: "slash" },
            { symbol: "⁽", label: "left parenthesis" },
            { symbol: "⁾", label: "right parenthesis" },
            { symbol: "ᵃ", label: "a" },
            { symbol: "ᵇ", label: "b" },
            { symbol: "ᶜ", label: "c" },
            { symbol: "ᵈ", label: "d" },
            { symbol: "ᵉ", label: "e" },
            { symbol: "ᶠ", label: "f" },
            { symbol: "ᵍ", label: "g" },
            { symbol: "ʰ", label: "h" },
            { symbol: "ⁱ", label: "i" },
            { symbol: "ʲ", label: "j" },
            { symbol: "ᵏ", label: "k" },
            { symbol: "ˡ", label: "l" },
            { symbol: "ᵐ", label: "m" },
            { symbol: "ⁿ", label: "n" },
            { symbol: "ᵒ", label: "o" },
            { symbol: "ᵖ", label: "p" },
            { symbol: "ʳ", label: "r" },
            { symbol: "ˢ", label: "s" },
            { symbol: "ᵗ", label: "t" },
            { symbol: "ᵘ", label: "u" },
            { symbol: "ᵛ", label: "v" },
            { symbol: "ʷ", label: "w" },
            { symbol: "ˣ", label: "x" },
            { symbol: "ʸ", label: "y" },
            { symbol: "ᶻ", label: "z" },
            { symbol: "ᴬ", label: "A" },
            { symbol: "ᴮ", label: "B" },
            { symbol: "ᴰ", label: "D" },
            { symbol: "ᴱ", label: "E" },
            { symbol: "ᴳ", label: "G" },
            { symbol: "ᴴ", label: "H" },
            { symbol: "ᴵ", label: "I" },
            { symbol: "ᴶ", label: "J" },
            { symbol: "ᴷ", label: "K" },
            { symbol: "ᴸ", label: "L" },
            { symbol: "ᴹ", label: "M" },
            { symbol: "ᴺ", label: "N" },
            { symbol: "ᴼ", label: "O" },
            { symbol: "ᴾ", label: "P" },
            { symbol: "ᴿ", label: "R" },
            { symbol: "ᵀ", label: "T" },
            { symbol: "ᵁ", label: "U" },
            { symbol: "ⱽ", label: "V" },
            { symbol: "ᵂ", label: "W" },
        ],
        Subscripts: [
            { symbol: "₀", label: "0" },
            { symbol: "₁", label: "1" },
            { symbol: "₂", label: "2" },
            { symbol: "₃", label: "3" },
            { symbol: "₄", label: "4" },
            { symbol: "₅", label: "5" },
            { symbol: "₆", label: "6" },
            { symbol: "₇", label: "7" },
            { symbol: "₈", label: "8" },
            { symbol: "₉", label: "9" },
            { symbol: "₊", label: "plus" },
            { symbol: "₋", label: "minus" },
            { symbol: "₌", label: "equals" },
            { symbol: "₍", label: "left parenthesis" },
            { symbol: "₎", label: "right parenthesis" },
            { symbol: "ₐ", label: "a" },
            { symbol: "ₑ", label: "e" },
            { symbol: "ₕ", label: "h" },
            { symbol: "ᵢ", label: "i" },
            { symbol: "ⱼ", label: "j" },
            { symbol: "ₖ", label: "k" },
            { symbol: "ₗ", label: "l" },
            { symbol: "ₘ", label: "m" },
            { symbol: "ₙ", label: "n" },
            { symbol: "ₒ", label: "o" },
            { symbol: "ₚ", label: "p" },
            { symbol: "ᵣ", label: "r" },
            { symbol: "ₛ", label: "s" },
            { symbol: "ₜ", label: "t" },
            { symbol: "ᵤ", label: "u" },
            { symbol: "ᵥ", label: "v" },
            { symbol: "ₓ", label: "x" },
        ],
    }

    const [activeCategory, setActiveCategory] = useState("Asosiy")

    return (
        <div className="border rounded-md p-2 bg-gray-50">
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {Object.keys(symbols).map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(category)}
                        className="whitespace-nowrap"
                    >
                        {category}
                    </Button>
                ))}
            </div>
            <div className="flex flex-wrap gap-1">
                {symbols[activeCategory].map((item) => (
                    <Button
                        key={item.symbol}
                        variant="outline"
                        size="sm"
                        onClick={() => onInsertSymbol(item.symbol)}
                        title={item.label}
                        className="min-w-8 h-8 px-2"
                    >
                        {item.symbol}
                    </Button>
                ))}
            </div>
        </div>
    )
}

function QuestionsTab({database, setDatabase}) {

    // multer
    const [questionText, setQuestionText] = useState('');
    const [answer, setAnswerText] = useState('');
    const [optionsText, setOptionsText] = useState(['', '', '', '', '']);
    const [questionImage, setQuestionImage] = useState(null);
    const [optionImages, setOptionImages] = useState([null, null, null, null, null]);
    const [questionImageLink, setQuestionImageLink] = useState(null)
    console.log(optionsText)
    // multer
    const [isAddingQuestion, setIsAddingQuestion] = useState(false)
    const [loadingforQuestionDelete, setLoadingforQuestionDelete] = useState({})
    const [loadingForQuestionsAdd, setLoadingForQuestionsAdd] = useState(false)
    const {toast} = useToast()
    const handleSubmitWithImage = async (mainTopicId, subTopicName) => {
        setLoadingForQuestionsAdd(true)
        if (questionText === "" || answer === "" || optionsText.every(option => option === "")) {
            toast({
                title: "Barcha maydonlarni to'ldiring",
                variant: "destructive",
                duration: 4000,
            })
            setLoadingForQuestionsAdd(false)
            return
        }
        const formData = new FormData();
        formData.append('questionText', questionText);
        formData.append('answer', answer);
        formData.append('mainTopicId', mainTopicId);
        formData.append('subTopicName', subTopicName);
        optionsText.forEach((option, idx) => formData.append('optionsText[]', option));

        if (questionImage) formData.append('questionImage', questionImage);
        // if (answerImage) formData.append('answerImage', answerImage);
        optionImages.forEach((image, idx) => {
            if (image) formData.append('optionImages', image);
        });

        try {
            await fetch(`${import.meta.env.VITE_SERVER}/test/questions/add`, {
                method: "POST",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    setDatabase(data.newData)
                    setLoadingForQuestionsAdd(false)
                    setQuestionText('')
                    setAnswerText('')
                    setOptionsText(['', '', '', '', '']);
                    setQuestionImage(null)
                    setOptionImages([null, null, null, null, null]);
                    toast({
                        title: data.msg,
                        variant: "success",
                        duration: 4000,
                    })

                })
        } catch (err) {
            console.error('Error adding question:', err);
        }
    };
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
    const insertSymbolInQuestion = (symbol) => {
        const textarea = document.getElementById("questionTextArea")
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const before = text.substring(0, start)
        const after = text.substring(end)

        // For functions that end with (), place the cursor inside the parentheses
        let cursorPosition = start + symbol.length
        if (symbol.endsWith("()")) {
            cursorPosition = start + symbol.length - 1
        }

        // Set the new text
        const newText = before + symbol + after
        setQuestionText(newText)

        // Need to wait for React to update the DOM before setting selection
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(cursorPosition, cursorPosition)
        }, 0)
    }

    const insertSymbolInOption = (symbol, index) => {
        const input = document.getElementById(`optionInput-${index}`)
        if (!input) return

        const start = input.selectionStart
        const end = input.selectionEnd
        const text = input.value
        const before = text.substring(0, start)
        const after = text.substring(end)

        // For functions that end with (), place the cursor inside the parentheses
        let cursorPosition = start + symbol.length
        if (symbol.endsWith("()")) {
            cursorPosition = start + symbol.length - 1
        }

        // Update the option text
        const newOptionsText = [...optionsText]
        newOptionsText[index] = before + symbol + after
        setOptionsText(newOptionsText)

        // Need to wait for React to update the DOM before setting selection
        setTimeout(() => {
            input.focus()
            input.setSelectionRange(cursorPosition, cursorPosition)
        }, 0)
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
                                    <AccordionItem key={subtopic.subtopicname}
                                                   value={`subitem-${topicIndex}-${subtopicIndex}`}>
                                        <AccordionTrigger>{subtopic.subtopicname}</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-4">
                                                {subtopic.questions.map((question, questionIndex) => (
                                                    <Card key={questionIndex}>
                                                        <CardHeader>
                                                            <CardTitle className="flex justify-between">
                                                                <span>Savol {questionIndex + 1}</span>
                                                                <div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            deleteQuestion(topic._id, subtopic.subtopicname, question.questionId)
                                                                        }
                                                                        disabled={loadingforQuestionDelete[question.questionId]}
                                                                    >
                                                                        {loadingforQuestionDelete[question.questionId] ? (
                                                                            <Loader2
                                                                                className="ml-2 h-4 w-4 animate-spin"/>
                                                                        ) : (
                                                                            <Trash2 className="h-4 w-4"/>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="font-medium">Savol:</h4>
                                                                    <p>{question.questionText}</p>
                                                                    {question.questionImage && (
                                                                        <div className="mt-2">
                                                                            <img
                                                                                src={question.questionImage || "/placeholder.svg"}
                                                                                alt="Question"
                                                                                className="max-h-40 rounded-md border"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <h4 className="font-medium mb-2">Variantlar:</h4>
                                                                    <div
                                                                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {Object.entries(question.options).map(([key, option]) => (
                                                                            <div
                                                                                key={key}
                                                                                className={`p-2 rounded-md border ${question.answer === key ? "border-green-500 bg-green-50" : ""}`}
                                                                            >
                                                                                <div
                                                                                    className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {key === "option1"
                                                ? "A"
                                                : key === "option2"
                                                    ? "B"
                                                    : key === "option3"
                                                        ? "C"
                                                        : key === "option4"
                                                        ? "D"
                                                            : "E"
                                            }
                                              :
                                          </span>
                                                                                    <span>{option.text}</span>
                                                                                </div>
                                                                                {option.image && (
                                                                                    <div className="mt-2">
                                                                                        <img
                                                                                            src={option.image || "/placeholder.svg"}
                                                                                            alt={`Option ${key}`}
                                                                                            className="max-h-24 rounded-md border"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className={`flex gap-3`}>
                                                                    <h4 className="font-medium">To'g'ri Javob:</h4>
                                                                    <p>
                                                                        {question.answer === "option1"
                                                                            ? "A"
                                                                            : question.answer === "option2"
                                                                                ? "B"
                                                                                : question.answer === "option3"
                                                                                    ? "C"
                                                                                    : question.answer === "option4"
                                                                                    ? "D"
                                                                                        : "E"
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </ul>
                                            <div className="mt-2">
                                                <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setQuestionText("")
                                                                setAnswerText("")
                                                                setOptionsText(["", "", "", "", ""])
                                                                setQuestionImage(null)
                                                                setOptionImages([null, null, null, null, null])
                                                            }}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4"/> Savol Qo'shish
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl  max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Yangi Savol Qo'shish</DialogTitle>
                                                        </DialogHeader>

                                                        <div className="grid gap-6 py-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="questionTextArea">Savol Matni</Label>
                                                                <MathSymbolsToolbar
                                                                    onInsertSymbol={insertSymbolInQuestion}/>
                                                                <Textarea
                                                                    id="questionTextArea"
                                                                    placeholder="Matn kiriting"
                                                                    value={questionText}
                                                                    onChange={(e) => setQuestionText(e.target.value)}
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Savol uchun Rasm (Ixtiyoriy)</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Input type="file"
                                                                           onChange={(e) => setQuestionImage(e.target.files[0])}/>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <Label>Variantlar</Label>
                                                                {optionsText.map((option, idx) => (
                                                                    <div key={idx}
                                                                         className="space-y-2 p-3 border rounded-md">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span
                                                                                className="font-medium">{String.fromCharCode(65 + idx)}:</span>
                                                                        </div>
                                                                        <MathSymbolsToolbar
                                                                            onInsertSymbol={(symbol) => insertSymbolInOption(symbol, idx)}
                                                                        />
                                                                        <Input
                                                                            id={`optionInput-${idx}`}
                                                                            type="text"
                                                                            placeholder={`Variant ${idx + 1}`}
                                                                            value={option}
                                                                            onChange={(e) => {
                                                                                const newOptions = [...optionsText]
                                                                                newOptions[idx] = e.target.value
                                                                                setOptionsText(newOptions)
                                                                            }}
                                                                        />

                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <Label>Variant {idx + 1} uchun rasm
                                                                                (Ixtiyoriy)</Label>
                                                                            <Input
                                                                                type="file"
                                                                                onChange={(e) => {
                                                                                    const newOptionImages = [...optionImages]
                                                                                    newOptionImages[idx] = e.target.files[0]
                                                                                    setOptionImages(newOptionImages)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="correctAnswer">To'g'ri Javob</Label>
                                                                <Select value={answer}
                                                                        onValueChange={(value) => setAnswerText(value)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder="To'g'ri javobli variantni belgilang"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="option1">A</SelectItem>
                                                                        <SelectItem value="option2">B</SelectItem>
                                                                        <SelectItem value="option3">C</SelectItem>
                                                                        <SelectItem value="option4">D</SelectItem>
                                                                        <SelectItem value="option5">E</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <DialogFooter>
                                                            <DialogClose>
                                                                <Button variant="outline"
                                                                        onClick={() => setIsAddingQuestion(false)}>
                                                                    Chiqish
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleSubmitWithImage(topic._id, subtopic.subtopicname)}
                                                                    disabled={loadingForQuestionsAdd}
                                                                >
                                                                    Savol qo'shish
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
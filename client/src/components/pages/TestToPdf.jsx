import React, {useEffect, useState} from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Label} from "@radix-ui/react-label";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Download, FileText, Loader2, Minus, Plus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {useToast} from "@/hooks/use-toast.js";
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js'; // Import crypto-js for encryption/decryption
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";
import Loader from "@/components/ui/Loader.jsx";
import {useQuery} from "@tanstack/react-query";
import {generateAnswersWord, generateTestWordDocs} from "@/hooks/test-word-generation.js";

const secretKey = `${import.meta.env.VITE_SECRET_KEY}`;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

function TestToPdf() {
    const [selectedSubtopics, setSelectedSubtopics] = useState([]);
    const [openTopics, setOpenTopics] = useState({})
    const [btnLoader, setBtnLoader] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5);
    const [numVariations, setNumVariations] = useState(3);
    const [pdfUrls, setPdfUrls] = useState([]);
    const [answersUrl, setAnswersUrl] = useState(null);
    const [zagolovokText, setZagolovokText] = useState("")
    const {toast} = useToast()
    const {isPending, error, data: database} = useQuery({
        queryKey: ['test/getfulltestdb'],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`)
                .then((res) => res.json()),
    })

    const handleCheckboxChange = (value) => {
        setSelectedSubtopics((prevCheckedValues) => {

            if (prevCheckedValues.includes(value)) {
                return prevCheckedValues.filter((val) => val !== value);
            }
            return [...prevCheckedValues, value];
        });
    };

    const shuffleOptions = (options) => {
        const entries = Object.entries(options);
        const shuffledEntries = entries.sort(() => Math.random() - 0.5);
        return Object.fromEntries(shuffledEntries);
    };

    const handleGenerateWordDocs = async () => {
        setBtnLoader(true)

        const {generateTestWordDocs, generateAnswersWord} = await import("../../hooks/test-word-generation.js")
        let selectedQuestions = [];

        selectedSubtopics.forEach((subtopic) => {
            const subtopicData = database.flatMap(topic => topic.subtopics).find(s => s.subtopicname === subtopic);
            if (subtopicData) {
                selectedQuestions.push(...subtopicData.questions);
            }
        });

        if (selectedQuestions.length < numQuestions) {
            toast({
                title: "Tanlangan mavzulardagi savollar yetmaydi.",
                variant: "destructive",
            });
            setBtnLoader(false)
            return;
        }

        let testVariations = [];
        for (let i = 0; i < numVariations; i++) {
            let shuffledQuestions = [...selectedQuestions]
                .sort(() => 0.5 - Math.random())
                .slice(0, numQuestions)
                .map(q => ({...q, options: shuffleOptions(q.options)}));

            testVariations.push(shuffledQuestions);
        }
        generateTestWordDocs(testVariations, zagolovokText, setPdfUrls, setBtnLoader, setZagolovokText, encryptData);
        generateAnswersWord(testVariations, setAnswersUrl, encryptData);
    };


    if (isPending) {
        return (
            <Loader variant={"big"}/>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Test - Word</h1>
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
                    <CardContent className="p-6">
                        <form className="space-y-6 w-full">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">Mavzular</Label>
                                <div className="w-full">
                                    <Accordion type="multiple" className="space-y-4 w-full">
                                        {database.map((topic) => (
                                            <AccordionItem key={topic._id} value={topic._id}
                                                           className="border rounded-lg overflow-hidden">
                                                <AccordionTrigger
                                                    className="px-4 py-3 bg-gray-50 hover:bg-gray-100 hover:no-underline">
                                                    {topic.maintopicname}
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white">
                                                    {topic.subtopics.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {topic.subtopics.map((sub) => (
                                                                <div key={sub._id} className="flex items-center">
                                                                    <Checkbox
                                                                        id={sub.subtopicname}
                                                                        checked={selectedSubtopics.includes(sub.subtopicname)}
                                                                        onCheckedChange={() => handleCheckboxChange(sub.subtopicname)}
                                                                    />
                                                                    <Label
                                                                        htmlFor={sub.subtopicname}
                                                                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                    >
                                                                        {sub.subtopicname}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">Mavzular topilmadi</p>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="numQuestions"
                                           className="block text-sm font-medium text-gray-700">
                                        Har bir testdagi savollar soni
                                    </Label>
                                    <div className="flex items-center mt-1">
                                        <Button
                                            type="button"
                                            onClick={() => setNumQuestions(Math.max(1, numQuestions - 1))}
                                            className="rounded-r-none"
                                            variant="outline"
                                        >
                                            <Minus className="h-4 w-4"/>
                                        </Button>
                                        <Input
                                            type="number"
                                            id="numQuestions"
                                            value={numQuestions}
                                            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                                            className="rounded-none text-center"
                                            min="1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => setNumQuestions(numQuestions + 1)}
                                            className="rounded-l-none"
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="numTests" className="block text-sm font-medium text-gray-700">
                                        Variantlar Soni
                                    </Label>
                                    <div className="flex items-center mt-1">
                                        <Button
                                            type="button"
                                            onClick={() => setNumVariations(Math.max(1, numVariations - 1))}
                                            className="rounded-r-none"
                                            variant="outline"
                                        >
                                            <Minus className="h-4 w-4"/>
                                        </Button>
                                        <Input
                                            type="number"
                                            id="numTests"
                                            value={numVariations}
                                            onChange={(e) => setNumVariations(parseInt(e.target.value))}
                                            className="rounded-none text-center"
                                            min="1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => setNumVariations(numVariations + 1)}
                                            className="rounded-l-none"
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor={`zagolovok`} className={`block text-sm font-medium text-gray-700`}>
                                    Sarlavha Uchun
                                </Label>
                                <Input
                                    type={"text"}
                                    id={"zagolovok"}
                                    value={zagolovokText}
                                    onChange={e => setZagolovokText(e.target.value)}
                                    className={`rounded`}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleGenerateWordDocs}
                                className="w-full"
                                disabled={selectedSubtopics.length === 0 || btnLoader}
                            >
                                Test Yaratish (Word)

                                {btnLoader && <Loader variant={`small`}/>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {pdfUrls.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Yaratilgan Word lar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {pdfUrls.map((docx, index) => (

                                <Card key={index}
                                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-8 w-8 text-gray-700 flex-shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-sm font-medium text-gray-900 truncate">{docx.name}</div>
                                                <p className="text-xs text-gray-500">Word Document</p>
                                            </div>
                                            <a
                                                key={index}
                                                href={docx.url}
                                                download={docx.name}
                                                className="block"
                                            >
                                                <Button variant="ghost" className="flex-shrink-0 p-1">
                                                    <Download className="h-4 w-4 text-gray-700"/>
                                                </Button>
                                            </a>

                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {answersUrl && (
                                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-8 w-8 text-gray-700 flex-shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">Test
                                                    Javoblari
                                                </div>
                                                <p className="text-xs text-gray-500">Word Document</p>
                                            </div>
                                            <a href={answersUrl} download="Test_Javoblari.docx" target="_blank"
                                               rel="noopener noreferrer">
                                                <Button variant="ghost" className="flex-shrink-0 p-1">
                                                    <Download className="h-4 w-4"/>
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestToPdf;
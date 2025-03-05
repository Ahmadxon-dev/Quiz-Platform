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
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";

function TestToPdf(props) {
    const [selectedSubtopics, setSelectedSubtopics] = useState([]);
    const [openTopics, setOpenTopics] = useState({})
    const [database, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [numQuestions, setNumQuestions] = useState(5);
    const [numVariations, setNumVariations] = useState(3);
    const [pdfUrls, setPdfUrls] = useState([]);
    const [answersUrl, setAnswersUrl] = useState(null);
    const {toast} = useToast()
    const getData = async () => {
        await fetch(`${import.meta.env.VITE_SERVER}/test/getfulltestdb`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                console.log(data)
                setLoading(false)
            })
    }
    useEffect(() => {
        getData()
    }, [])
    const toggleTopic = (topicId) => {
        setOpenTopics((prev) => ({
            ...prev,
            [topicId]: !prev[topicId],
        }))
    }
    const handleCheckboxChange = (value) => {
        setSelectedSubtopics((prevCheckedValues) => {
            // If the checkbox is checked, add its value to the array
            if (prevCheckedValues.includes(value)) {
                return prevCheckedValues.filter((val) => val !== value); // Remove it if unchecked
            }
            return [...prevCheckedValues, value]; // Add it if checked
        });
    };
    const handleGeneratePDFs = () => {
        let selectedQuestions = [];

        selectedSubtopics.forEach((subtopic) => {
            const subtopicData = database.flatMap(topic => topic.subtopics).find(s => s.subtopicname === subtopic);
            if (subtopicData) {
                selectedQuestions.push(...subtopicData.questions);
            }
        });

        if (selectedQuestions.length < numQuestions) {
            // alert("Not enough questions available for selection.");
            toast({
                title: "Tanlangan mavzulardagi savollar yetmaydi.",
                variant: "destructive",
            })
            return;
        }

        let testVariations = [];
        for (let i = 0; i < numVariations; i++) {
            let shuffledQuestions = [...selectedQuestions].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
            testVariations.push(shuffledQuestions);
        }

        generateTestPDFs(testVariations);
        generateAnswersPDF(testVariations);
    };

    // const generateTestPDFs = (variations) => {
    //     const urls = [];
    //
    //
    //     variations.forEach((questions, index) => {
    //         const doc = new jsPDF();
    //         const pageWidth = doc.internal.pageSize.width - 20; // Page width with margin
    //         const pageHeight = doc.internal.pageSize.height - 20; // Page height with margin
    //         let y = 40; // Start after labels
    //
    //         doc.setFontSize(16);
    //         doc.text(`Test Variant-${index + 1}`, 10, 10);
    //         doc.setFontSize(12);
    //         doc.text("F.I.SH: ______________________", 10, 20);
    //         doc.text("Sinf: _______________________", 120, 20);
    //
    //         questions.forEach((q, i) => {
    //             doc.setFontSize(14);
    //             const questionText = `${i + 1}. ${q.question}`;
    //             const questionLines = doc.splitTextToSize(questionText, pageWidth); // Wrap text
    //             const questionHeight = questionLines.length * 7;
    //
    //             if (y + questionHeight > pageHeight) {
    //                 doc.addPage();
    //                 y = 20; // Reset Y for new page
    //             }
    //
    //             doc.text(questionLines, 10, y);
    //             y += questionHeight;
    //
    //             doc.setFontSize(12);
    //             q.options.forEach((option, j) => {
    //                 const optionText = `${String.fromCharCode(65 + j)}) ${option}`;
    //                 const optionLines = doc.splitTextToSize(optionText, pageWidth - 10);
    //                 const optionHeight = optionLines.length * 6;
    //
    //                 if (y + optionHeight > pageHeight) {
    //                     doc.addPage();
    //                     y = 20;
    //                 }
    //
    //                 doc.text(optionLines, 15, y);
    //                 y += optionHeight + 4;
    //             });
    //
    //             y += 10;
    //         });
    //
    //         // Add page numbers
    //         const totalPages = doc.internal.getNumberOfPages();
    //         for (let i = 1; i <= totalPages; i++) {
    //             doc.setPage(i);
    //             doc.text(`Sahifa ${i}/${totalPages}`, 10, pageHeight + 5);
    //         }
    //
    //         const blob = doc.output("blob");
    //         const url = URL.createObjectURL(blob);
    //         urls.push({ url, name: `${index + 1}.pdf` });
    //     });
    //     setPdfUrls(urls);
    // };
    const generateTestPDFs = (variations) => {
        const urls = [];

        variations.forEach((questions, index) => {
            const doc = new jsPDF();
            const margin = 10;
            const pageWidth = doc.internal.pageSize.width - 2 * margin;
            const pageHeight = doc.internal.pageSize.height - 20;
            const columnWidth = (pageWidth / 2) - 5; // Two columns with a gap
            let yLeft = 40;
            let yRight = 40;
            let isLeftColumn = true;

            doc.setFontSize(16);
            doc.text(`Test Variant-${index + 1}`, margin, 10);
            doc.setFontSize(12);
            doc.text("F.I.SH: ______________________", margin, 20);
            doc.text("Sinf: _______________________", margin + 110, 20);
            doc.text("Sana: _______________________", margin, 28)

            questions.forEach((q, i) => {
                let x = isLeftColumn ? margin : margin + columnWidth + 10;
                let y = isLeftColumn ? yLeft : yRight;

                doc.setFontSize(14);
                const questionText = `${i + 1}. ${q.question}`;
                const questionLines = doc.splitTextToSize(questionText, columnWidth);
                const questionHeight = questionLines.length * 7;

                if (y + questionHeight > pageHeight) {
                    doc.addPage();
                    yLeft = 20;
                    yRight = 20;
                    isLeftColumn = true;
                    x = margin;
                    y = yLeft;
                }

                doc.text(questionLines, x, y);
                y += questionHeight;

                doc.setFontSize(12);
                q.options.forEach((option, j) => {
                    const optionText = `${String.fromCharCode(65 + j)}) ${option}`;
                    const optionLines = doc.splitTextToSize(optionText, columnWidth - 5);
                    const optionHeight = optionLines.length * 6;

                    if (y + optionHeight > pageHeight) {
                        doc.addPage();
                        yLeft = 20;
                        yRight = 20;
                        isLeftColumn = true;
                        x = margin;
                        y = yLeft;
                    }

                    doc.text(optionLines, x + 5, y);
                    y += optionHeight + 4;
                });

                if (isLeftColumn) {
                    yLeft = y + 10;
                } else {
                    yRight = y + 10;
                }
                isLeftColumn = !isLeftColumn;
            });

            // Add page numbers
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.text(`Sahifa ${i}/${totalPages}`, margin, pageHeight + 5);
            }

            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            urls.push({ url, name: `${index + 1}.pdf` });
        });

        setPdfUrls(urls);
    };


    const generateAnswersPDF = (variations) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width - 20; // Ensure margins
        const pageHeight = doc.internal.pageSize.height - 20;
        let y = 20; // Start below title

        doc.setFontSize(18);
        doc.text("Test Javoblari", 10, 10);
        doc.setFontSize(14);

        variations.forEach((questions, index) => {
            if (y + 10 > pageHeight) {
                doc.addPage();
                y = 20;
            }

            doc.text(`Test Variant-${index + 1}`, 10, y);
            y += 10;

            questions.forEach((q, i) => {
                const questionIndex = q.options.indexOf(q.answer);
                const answerLetter = ["A", "B", "C", "D"][questionIndex] || "?";
                const answerText = `${i + 1}. (${answerLetter}) ${q.answer}`;
                const wrappedText = doc.splitTextToSize(answerText, pageWidth); // Wrap text

                if (y + wrappedText.length * 7 > pageHeight) {
                    doc.addPage();
                    y = 20;
                }

                doc.text(wrappedText, 15, y);
                y += wrappedText.length * 7 + 5; // Dynamic spacing
            });

            y += 10; // Extra space after each test variant
        });

// Add page numbers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.text(`Sahifa ${i}/${totalPages}`, 10, pageHeight + 5);
        }

        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        setAnswersUrl(url);
    };
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
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Test Generator</h1>
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
                    <CardContent className="p-6">
                        <form className="space-y-6 w-full">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">Mavzular</Label>
                                <div className="w-full">
                                    <Accordion type="multiple" className="space-y-4 w-full">
                                        {database.map((topic) => (
                                            <AccordionItem key={topic._id} value={topic._id} className="border rounded-lg overflow-hidden">
                                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 hover:no-underline">
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
                                                        <p className="text-sm text-gray-500">No subtopics available</p>
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
                            <Button
                                type="button"
                                onClick={handleGeneratePDFs}
                                className="w-full"
                                disabled={selectedSubtopics.length === 0}
                            >
                                Test Yaratish
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {pdfUrls.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Yaratilgan PDF lar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {pdfUrls.map((pdf, index) => (
                                <Card key={index}
                                      className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-8 w-8 text-gray-700 flex-shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-sm font-medium text-gray-900 truncate">{pdf.name}</div>
                                                <p className="text-xs text-gray-500">PDF Document</p>
                                            </div>

                                            <a href={pdf.url} download={pdf.name} target="_blank"
                                               rel="noopener noreferrer">
                                                <Button variant="ghost" className="flex-shrink-0 p-1">
                                                    <Download className="h-4 w-4"/>
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
                                                <p className="text-xs text-gray-500">PDF Document</p>
                                            </div>
                                            <a href={answersUrl} download="Test_Javoblari.pdf" target="_blank" rel="noopener noreferrer">
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
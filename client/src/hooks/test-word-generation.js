import {
    AlignmentType,
    Document,
    HeadingLevel,
    ImageRun,
    Packer, PageOrientation,
    Paragraph, SectionType,
    Table, TableCell,
    TableRow,
    TextRun,
    WidthType
} from "docx";
import QRCode from "qrcode";

export const generateTestWordDocs = async (variations, zagolovokText, setPdfUrls, setBtnLoader, setZagolovokText, encryptData) => {
    const urls = [];

    for (const [index, questions] of variations.entries()) {
        const children = [
            new Paragraph({
                children: [new TextRun({text: `${zagolovokText}`, color: '#000000', bold: true})],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({text: `Test Variant-${index + 1}`, color: '#000000', bold: true})],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({
                    text: "F.I.SH: __________________________________________________",
                    color: '#000000',
                    bold: true
                })], // Reduced size
            }),
            new Paragraph({
                children: [new TextRun({
                    text: "Sinf: ____________________________________________________",
                    color: '#000000',
                    bold: true
                })], // Reduced size
            }),
            new Paragraph({
                children: [new TextRun({
                    text: "Sana: ____________________________________________________",
                    color: '#000000',
                    bold: true
                })], // Reduced size
            }),
        ];
        const childrenForColumn = []
        for (const [i, q] of questions.entries()) {
            childrenForColumn.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${i + 1}. ${q.questionText}`,
                            font: "Cambria Math",
                            color: '#000000',
                            size: 24
                        }),
                    ],
                })
            )


            // Add question image if available
            if (q.questionImage && typeof q.questionImage === 'string' && q.questionImage.startsWith('https://')) {
                try {
                    const imageResponse = await fetch(q.questionImage);
                    const imageBuffer = await imageResponse.arrayBuffer();

                    childrenForColumn.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    type: "png",
                                    data: imageBuffer,
                                    transformation: {
                                        width: 300,
                                        height: 200,
                                    },
                                }),
                            ],
                        })
                    );
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }

            // Add options
            let optionsText = '';  // Initialize a string to store all options

            Object.keys(q.options).forEach((key, j) => {
                optionsText += `${String.fromCharCode(65 + j)}) ${q.options[key].text} `;
            });

// Now, create a single paragraph with all options in one line
            childrenForColumn.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: optionsText.trim(),  // Remove any extra space at the end
                            font: "Cambria Math",
                            color: '#000000',
                            size: 24,
                        }),
                    ],
                    spacing: {
                        after: 200,
                    }
                })
            );
        }
        const chunkSize = 10; // Adjust chunk size as needed
        const questionChunks = [];
        for (let i = 0; i < questions.length; i += chunkSize) {
            questionChunks.push(questions.slice(i, i + chunkSize));
        }

        const answerTableRows = [];
        questionChunks.forEach((chunk, chunkIndex) => {
            const questionNumbersRow = new TableRow({
                children: chunk.map((_, questionIndex) => {
                    return new TableCell({
                        children: [
                            new Paragraph({
                                children: [new TextRun({
                                    text: `${questionIndex + (chunkIndex * chunkSize) + 1}`,
                                    size: 25,
                                    color: '#000000'
                                })], // Increased size to 14
                            }),
                        ],
                    });
                }),
            });

            const answerKeysRow = new TableRow({
                children: chunk.map(() => {
                    return new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "________",
                                        size: 10,
                                        color: "#FFFFFF",
                                    }),
                                ],
                            }),
                        ],
                    });
                }),
                height: {value: 500, rule: "atLeast"},
            });
            answerTableRows.push(questionNumbersRow, answerKeysRow);
        });

        const answerTable = new Table({
            rows: answerTableRows,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        });
        const childrenForFooter = []
        childrenForFooter.push(new Paragraph({children: [new TextRun({text: "", color: '#000000'})]}));
        childrenForFooter.push(new Paragraph({
            children: [new TextRun({
                text: "Javoblar:",
                color: '#000000',
                size: 24
            })]
        }));
        childrenForFooter.push(answerTable);
        // Create the answers string as letters (A, B, C, D, or E)
        let answersString = `Test Variant ${index + 1} Javoblar:\n`;
        questions.forEach((q, idx) => {
            // Map answer key to A, B, C, D, or E
            const answerLetter = String.fromCharCode(65 + Object.keys(q.options).indexOf(q.answer));
            answersString += `${idx + 1}: ${answerLetter}\n`; // Show the letter (A, B, C, D, E)
        });

        // Encrypt the answer string
        const encryptedAnswerText = encryptData(answersString);

        // Generate QR code with encrypted answer data
        const qrCodeDataUrl = await QRCode.toDataURL(encryptedAnswerText);
        const qrCodeImage = await fetch(qrCodeDataUrl);
        const qrCodeBuffer = await qrCodeImage.arrayBuffer();

        // Add QR code to the document
        childrenForFooter.push(
            new Paragraph({
                children: [
                    new ImageRun({
                        type: "png",
                        data: qrCodeBuffer,
                        transformation: {
                            width: 150,
                            height: 150,
                        },
                    }),
                ],
                alignment: AlignmentType.RIGHT,
                position: {
                    x: 5000, // Distance from the left edge (in twips)
                    y: 0,    // Distance from the top edge (in twips)
                    width: 100,  // Width of the image (in twips)
                    height: 100, // Height of the image (in twips)
                }
            })
        );

        const doc = new Document({
            sections: [
                {
                    children,
                    properties: {
                        page: {
                            margin: {
                                top: 320,
                                bottom: 250,
                            },
                        },
                    },
                },
                {
                    children: childrenForColumn,
                    properties: {
                        type: SectionType.CONTINUOUS,
                        column: {
                            count: 2,
                            space: 708,
                        },
                        margin: {
                            top: 320,
                            bottom: 250,
                        },
                    }
                },
                {
                    children: childrenForFooter,
                    properties: {
                        margin: {
                            top: 320,
                            bottom: 250,
                        },
                    }
                }
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        urls.push({url, name: `${index + 1}.docx`});
    }

    setPdfUrls(urls);
    setBtnLoader(false);
    setZagolovokText("");
};

export const generateAnswersWord = async (variations, setAnswersUrl, encryptData) => {
    const children = [];


    children.push(new Paragraph({text: "Test Javoblari", heading: "Heading1"}));
    for (const [index, variant] of variations.entries()) {
        children.push(new Paragraph({text: `Test Variant-${index + 1}`, heading: "Heading2"}));
        let answersString = `Test Variant ${index + 1} Javoblar:\n`;
        variant.forEach((q, i) => {
            const questionIndex = Object.keys(q.options).indexOf(q.answer);
            const answerLetter = ["A", "B", "C", "D", "E"][questionIndex] || "?";
            answersString += `${i + 1}. (${answerLetter})\n`
            children.push(new Paragraph(`${i + 1}. (${answerLetter})`));


        });
        const encryptedAnswerText = encryptData(answersString);
        const qrCodeDataUrl = await QRCode.toDataURL(encryptedAnswerText);
        const qrCodeImage = await fetch(qrCodeDataUrl);
        const qrCodeBuffer = await qrCodeImage.arrayBuffer();
        children.push(
            new Paragraph({
                children: [
                    new ImageRun({
                        type: "png",
                        data: qrCodeBuffer,
                        transformation: {
                            width: 150,
                            height: 150,
                        },
                    }),
                ],
                // alignment: AlignmentType.RIGHT,
            })
        );
        children.push(new Paragraph("")); // spacing
    }


    const doc = new Document({
        sections: [
            {
                children,
                properties: {
                    type: SectionType.CONTINUOUS,
                    column: {
                        count: 2,
                        space: 708,
                    },
                }
            }
        ]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    setAnswersUrl(url);
};
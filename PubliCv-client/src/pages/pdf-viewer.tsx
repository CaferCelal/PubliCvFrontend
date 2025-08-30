import React, { useEffect, useState } from "react";
import FileServices from "../services/file.ts";
import { Document, Page } from "react-pdf"; // make sure it's "react-pdf"

const PdfViewer: React.FC = () => {
    const fileId = "be056c61-436c-46d3-8893-0b66a25e072f"; // hardcoded
    const [fileBlob, setFileBlob] = useState<Blob | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);

    useEffect(() => {
        FileServices.getFile(fileId)
            .then(setFileBlob)
            .catch((err) => console.error("Failed to load PDF:", err));
    }, [fileId]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (!fileBlob) return <p>Loading PDF...</p>;

    const fileUrl = URL.createObjectURL(fileBlob);

    return (
        <div style={{ height: "100vh", overflow: "auto" }}>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages ?? 0), (_, index) => (
                    <Page key={index} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

export default PdfViewer;

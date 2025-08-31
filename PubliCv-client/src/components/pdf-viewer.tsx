import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FileServices from "../services/file.ts";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface PdfViewerHandle {
    download: () => void;
}

interface PdfViewerProps {
    fileId: string;
}

const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(({ fileId }, ref) => {
    const [fileBlob, setFileBlob] = useState<Blob | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [numPages, setNumPages] = useState<number | null>(null);

    useEffect(() => {
        FileServices.getFile(fileId).then(({ blob, fileName }) => {
            setFileBlob(blob);
            setFileName(fileName);
            console.log("Fetched file:", fileName);
        }).catch(console.error);
    }, [fileId]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    // Expose download method via ref
    useImperativeHandle(ref, () => ({
        download: () => {
            if (!fileBlob) return;
            const url = URL.createObjectURL(fileBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    }), [fileBlob, fileName]);

    if (!fileBlob) return <p>Loading PDF...</p>;

    const fileUrl = URL.createObjectURL(fileBlob);

    return (
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages ?? 0), (_, index) => (
                <Page
                    key={index}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            ))}
        </Document>
    );
});

export default PdfViewer;

import { useEffect, useState, useImperativeHandle, forwardRef, useMemo} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FileServices from "../services/file.ts";
import spinnerUrl from '../../public/spinner.svg';


pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface PdfViewerHandle {
    download: () => void;
}

interface PdfViewerProps {
    fileId: string;
}

const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(
    ({ fileId }, ref) => {
        const [fileBlob, setFileBlob] = useState<Blob | null>(null);
        const [fileName, setFileName] = useState<string>("");
        const [numPages, setNumPages] = useState<number | null>(null);
        const [loading, setLoading] = useState(true); // NEW

        useEffect(() => {
            let cancelled = false;

            setFileBlob(null);
            setNumPages(null);
            setLoading(true); // start loading

            FileServices.getFile(fileId)
                .then(({ blob, fileName }) => {
                    if (!cancelled) {
                        setFileBlob(blob);
                        setFileName(fileName);
                        setLoading(false); // done loading
                        console.log("Fetched file:", fileName);
                    }
                })
                .catch((err) => {
                    if (!cancelled) console.error(err);
                    setLoading(false); // stop loading even on error
                });

            return () => {
                cancelled = true;
            };
        }, [fileId]);

        const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
            setNumPages(numPages);
        };

        useImperativeHandle(
            ref,
            () => ({
                download: () => {
                    if (!fileBlob) return;
                    const url = URL.createObjectURL(fileBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);
                },
            }),
            [fileBlob, fileName]
        );

        const fileUrl = useMemo(() => {
            if (!fileBlob) return null;
            return URL.createObjectURL(fileBlob);
        }, [fileBlob]);

        useEffect(() => {
            return () => {
                if (fileUrl) URL.revokeObjectURL(fileUrl);
            };
        }, [fileUrl]);

        return (
            <div style={{ position: "relative", minHeight: "20rem" }}>
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            zIndex: 9999,
                            pointerEvents: "none",
                        }}
                    >
                        <img src={spinnerUrl} alt="Loading..." />
                    </div>
                )}


                {fileBlob && (
                    <Document
                        key={fileId}
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={null}
                    >
                        {Array.from(new Array(numPages ?? 0), (_, index) => (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                loading={null} // <- disables per-page "Loading page..." messages
                            />
                        ))}
                    </Document>
                )}
            </div>
        );
    }
);
export default PdfViewer;
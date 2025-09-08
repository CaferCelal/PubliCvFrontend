import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "../components/pdf-viewer";
import type { PdfViewerHandle } from "../components/pdf-viewer";
import FileServices from "../services/file";
import { Download } from "lucide-react";
import "./profile-page.css"; // reuse styles

const PublicFilePage = () => {
    const { userName, fileId } = useParams<{ userName: string; fileId: string }>();
    const pdfRef = useRef<PdfViewerHandle>(null);

    const [fileName, setFileName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userName || !fileId) {
            setError("Invalid URL");
            setLoading(false);
            return;
        }

        FileServices.getFileByUserName(userName, fileId)
            .then(({ fileName }) => {
                setFileName(fileName);
            })
            .catch((err) => {
                console.error("Error fetching file:", err);
                setError(err.message || "Failed to load file.");
            })
            .finally(() => setLoading(false));
    }, [userName, fileId]);

    const handleDownloadClick = () => pdfRef.current?.download();

    return (
        <div className="profile-page-container">
            <main className="content">
                {loading && <p>Loading PDF...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && fileId && (
                    <>
                        <div className="pdf-header">
                            <h2>{fileName || "Document"}</h2>
                            <button className="share-button" onClick={handleDownloadClick}>
                                <Download size={16} /> Download
                            </button>
                        </div>
                        <div className="pdf-container">
                            <div className="pdf-wrapper">
                                <PdfViewer ref={pdfRef} fileId={fileId} />
                            </div>
                        </div>
                    </>
                )}
            </main>

        </div>
    );
};

export default PublicFilePage;

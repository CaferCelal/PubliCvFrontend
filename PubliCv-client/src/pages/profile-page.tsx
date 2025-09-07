import React, { useState, useEffect, useRef } from "react";
import "./profile-page.css";
import FileServices from "../services/file";
import PdfViewer from "../components/pdf-viewer";
import type { PdfViewerHandle } from "../components/pdf-viewer";
import { Link, Download, Menu } from "lucide-react";
import Toast from "../components/toast";

const ProfilePage = () => {
    const [documents, setDocuments] = useState<{ id: string; fileName: string }[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<{ id: string; fileName: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null); // 👈 same as LoginPage
    const isMobile = window.innerWidth <= 768;

    const pdfRef = useRef<PdfViewerHandle>(null);

    useEffect(() => {
        let isMounted = true;

        FileServices.getMyDocuments()
            .then(({ userName, fileMetaData }) => {
                if (!isMounted) return;
                setUserName(userName);
                setDocuments(fileMetaData);
                if (fileMetaData.length > 0) setSelectedDocument(fileMetaData[0]);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || "Failed to load documents.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);


    const handleDocumentClick = (doc: { id: string; fileName: string }) => {
        setSelectedDocument(doc);
        setMobileMenuOpen(false);
    };

    const handleDownloadClick = () => pdfRef.current?.download();

    const copyLink = async (fileId?: string) => {
        if (!fileId || !userName) return;
        const url = `${window.location.origin}/${userName}/${fileId}`;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                setToast({ message: "Link copied to clipboard!", isPositive: true });
            } else {
                // fallback for unsupported browsers
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed"; // avoid scrolling
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                setToast({ message: "Link copied to clipboard!", isPositive: true });
            }
        } catch (err) {
            console.error("Copy failed:", err);
            setToast({ message: "Failed to copy link.", isPositive: false });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setToast({ message: "Only PDF files are allowed.", isPositive: false });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setToast({ message: "File size must be less than 50MB.", isPositive: false });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        try {
            const response = await FileServices.uploadFile(file);
            setToast({ message: response.data, isPositive: true });
        } catch (error: any) {
            console.error("Upload error:", error);
            setToast({ message: "Upload failed: " + error.message, isPositive: false });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="profile-page-container">
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleUpload}
            />

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="sidebar">
                    <h3 className="sidebar-title">Documents</h3>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && (
                        <ul className="certificate-list">
                            {documents.map((doc) => (
                                <li
                                    key={doc.id}
                                    className={`certificate-item ${selectedDocument?.id === doc.id ? "active" : ""}`}
                                    onClick={() => handleDocumentClick(doc)}
                                >
                                    {doc.fileName}
                                </li>
                            ))}
                            {documents.length === 0 && <li>No documents uploaded yet.</li>}
                        </ul>
                    )}
                    <div className="sidebar-bottom">
                        <button
                            className="resume-button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            + Resume
                        </button>
                    </div>
                </aside>
            )}

            {isMobile && (
                <>
                    <aside className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
                        <h3 className="sidebar-title">Documents</h3>
                        <ul className="certificate-list">
                            {documents.map((doc) => (
                                <li
                                    key={doc.id}
                                    className={`certificate-item ${selectedDocument?.id === doc.id ? "active" : ""}`}
                                    onClick={() => handleDocumentClick(doc)}
                                >
                                    {doc.fileName}
                                </li>
                            ))}
                            {documents.length === 0 && <li>No documents uploaded yet.</li>}
                        </ul>
                        <button
                            className="resume-button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            + Resume
                        </button>
                    </aside>

                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        <Menu size={24} />
                    </button>
                </>
            )}

            {/* Main Content */}
            <main className="content">
                {selectedDocument && (
                    <>
                        <div className="pdf-header">
                            <h2>{selectedDocument.fileName}</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                <button className="share-button" onClick={handleDownloadClick}>
                                    <Download size={16} /> Download
                                </button>
                                <button className="share-button" onClick={() => copyLink(selectedDocument.id)}>
                                    <Link size={16} /> Copy Link
                                </button>
                            </div>
                        </div>
                        <div className="pdf-container">
                            <div className="pdf-wrapper">
                                <PdfViewer ref={pdfRef} fileId={selectedDocument.id} />
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Toast */}
            {toast && <Toast message={toast.message} isPositive={toast.isPositive} />}
        </div>
    );
};

export default ProfilePage;

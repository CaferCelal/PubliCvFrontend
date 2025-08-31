import React, { useState, useEffect, useRef } from "react";
import "./profile-page.css";
import FileServices from "../services/file";
import PdfViewer from "../components/pdf-viewer";
import type { PdfViewerHandle } from "../components/pdf-viewer";
import { Link, Download, Menu } from "lucide-react";

const ProfilePage = () => {
    const [documents, setDocuments] = useState<{ id: string; fileName: string }[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<{ id: string; fileName: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;


    const pdfRef = useRef<PdfViewerHandle>(null);

    useEffect(() => {
        FileServices.getMyDocuments()
            .then((docs) => {
                setDocuments(docs);
                if (docs.length > 0) setSelectedDocument(docs[0]);
            })
            .catch((err) => setError(err.message || "Failed to load documents."))
            .finally(() => setLoading(false));
    }, []);

    const handleDocumentClick = (doc: { id: string; fileName: string }) => {
        setSelectedDocument(doc);
        setMobileMenuOpen(false); // close mobile menu after selection
    };

    const handleDownloadClick = () => pdfRef.current?.download();

    const copyLink = (fileId?: string) => {
        if (!fileId) return;
        const url = `${window.location.origin}/${fileId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied to clipboard!"))
            .catch(() => alert("Failed to copy link."));
    };

    return (
        <div className="profile-page-container">
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
                        <button className="resume-button" onClick={() => alert("Resume action clicked!")}>
                            + Resume
                        </button>
                    </div>
                </aside>
            )}

            {isMobile && (
                <>
                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Mobile Sidebar Menu */}
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
                    </aside>
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
        </div>
    );
};

export default ProfilePage;

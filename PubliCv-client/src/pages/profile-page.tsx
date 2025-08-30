// pages/profile-page.tsx

import React, { useState, useEffect } from "react";
import "./profile-page.css";
import FileServices from "../services/file";

const ProfilePage = () => {
    const [documents, setDocuments] = useState<{ id: string; fileName: string }[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<{ id: string; fileName: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        FileServices.getMyDocuments()
            .then((docs) => {
                setDocuments(docs);
                if (docs.length > 0) {
                    setSelectedDocument(docs[0]);
                }
            })
            .catch((err) => {
                setError(err.message || "Failed to load documents.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddResume = () => {
        alert("Resume action clicked!");
    };

    return (
        <div className="profile-page-container">
            {/* Left sidebar */}
            <aside className="sidebar">
                <h3 className="sidebar-title">Documents</h3>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && (
                    <ul className="certificate-list">
                        {documents.map((doc) => (
                            <li
                                key={doc.id}
                                className={`certificate-item ${
                                    selectedDocument?.id === doc.id ? "active" : ""
                                }`}
                                onClick={() => setSelectedDocument(doc)}
                            >
                                {doc.fileName}
                            </li>
                        ))}
                        {documents.length === 0 && <li>No documents uploaded yet.</li>}
                    </ul>
                )}

                {/* Bottom section */}
                <div className="sidebar-bottom">
                    <button className="resume-button" onClick={handleAddResume}>
                        + Resume
                    </button>
                </div>
            </aside>

            {/* Right content */}
            <main className="content">
                <h2>
                    {selectedDocument
                        ? selectedDocument.fileName
                        : "No document selected"}
                </h2>
                {/* Later we’ll add more details here */}
            </main>
        </div>
    );
};

export default ProfilePage;

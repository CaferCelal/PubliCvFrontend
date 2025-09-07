// services/file.ts
import Config from "./config";

const FileServices = {
    uploadFile(file: File): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);

        return fetch(`${Config.DOMAIN}/file/upload/${encodeURIComponent(file.name)}`, {
            method: "POST",
            body: formData,
            credentials: "include", // must send auth cookie/session
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Upload failed (${res.status})`);
            }
            return { data: "File uploaded successfully." };
        });
    },

    getMyDocuments(): Promise<{
        userName: string;
        fileMetaData: { id: string; fileName: string }[];
    }> {
        return fetch(`${Config.DOMAIN}/file/get/metadata`, {
            method: "GET",
            credentials: "include", // send auth cookie/session
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to fetch documents (${res.status})`);
            }

            const data = await res.json();

            if (!data.userName || !Array.isArray(data.fileMetaData)) {
                throw new Error("Invalid response format from server");
            }

            return data;
        });
    },

    // services/file.ts
    getFile(fileId: string): Promise<{ blob: Blob; fileName: string }> {
        return fetch(`${Config.DOMAIN}/file/get/${fileId}`, {
            method: "GET",
            credentials: "include",
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to fetch file (${res.status})`);
            }

            const blob = await res.blob();

            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "download.pdf"; // fallback

            if (contentDisposition) {
                // Prefer UTF-8 encoded filename*=, robust regex
                const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
                if (filenameStarMatch) {
                    fileName = decodeURIComponent(filenameStarMatch[1]);
                } else {
                    // Fallback to simple filename=
                    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
                    if (filenameMatch) {
                        fileName = filenameMatch[1];
                    }
                }
            }

            console.log("Log in service:", fileName);

            return { blob, fileName };
        });
    },

    getFileByUserName(userName: string, fileId: string): Promise<{ blob: Blob; fileName: string }> {
        return fetch(`${Config.DOMAIN}/file/get/${encodeURIComponent(userName)}/${encodeURIComponent(fileId)}`, {
            method: "GET",
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to fetch file (${res.status})`);
            }

            const blob = await res.blob();

            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "download.pdf";

            if (contentDisposition) {
                const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
                if (filenameStarMatch) {
                    fileName = decodeURIComponent(filenameStarMatch[1]);
                } else {
                    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
                    if (filenameMatch) {
                        fileName = filenameMatch[1];
                    }
                }
            }

            return { blob, fileName };
        });
    },


};

export default FileServices;

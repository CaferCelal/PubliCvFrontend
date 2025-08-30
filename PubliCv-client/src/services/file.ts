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

    getMyDocuments(): Promise<{ id: string; fileName: string }[]> {
        return fetch(`${Config.DOMAIN}/file/get/metadata`, {
            method: "GET",
            credentials: "include", // send auth cookie/session
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to fetch documents (${res.status})`);
            }
            return res.json();
        });
    },
    getFile(fileId: string): Promise<Blob> {
        return fetch(`${Config.DOMAIN}/file/get/${encodeURIComponent(fileId)}`, {
            method: "GET",
            credentials: "include", // send auth cookie/session
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to fetch file (${res.status})`);
            }
            return res.blob(); // return as Blob for inline display
        });
    }

};

export default FileServices;

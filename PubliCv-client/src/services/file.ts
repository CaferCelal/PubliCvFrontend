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
};

export default FileServices;

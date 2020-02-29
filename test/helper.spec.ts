console.warn("HELPER");

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = Buffer.from(base64, "base64").toString("ascii");
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};
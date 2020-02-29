export const readBits = (bitOffset: number, data: ArrayBuffer, numOfBits: number): number | undefined => {
    const byteOffset = Math.trunc(bitOffset / 8);
    const offset = bitOffset % 8;
    if (offset + numOfBits > 32) {
        console.warn("readBits: exceeds 32 bit read");
        return;
    }
    const shiftBy = 32 - numOfBits - offset;
    const mask = Math.pow(2, numOfBits) - 1;
    const temp: number = new DataView(data, byteOffset).getUint32(0);
    // Shift the mask and extract he bits we want, then shift them back to the 0th position
    return (temp & (mask * Math.pow(2, shiftBy))) >>> shiftBy;
};

export const parseExpGolomb = (data: ArrayBuffer): number => {
    let leadingZeroBits = -1;
    let bitOffset = 0;
    for (let b = 0; !b; leadingZeroBits++) {
        b = readBits(bitOffset++, data, 1);
    }
    const codeNum = Math.pow(2, leadingZeroBits) - 1 + readBits(0, data, leadingZeroBits,);
    return codeNum;
};
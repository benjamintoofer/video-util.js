export const readBits = (bitOffset: number, data: ArrayBuffer, numOfBits: number): number | undefined => {
    const byteOffset = Math.trunc(bitOffset / 8);
    const offset = bitOffset % 8;
    if (offset + numOfBits > 32) {
        console.warn("readBits: exceeds 32 bit read");
        return;
    }
    const temp: number = new DataView(data, byteOffset).getUint32(0) * Math.pow(2, offset);
    return temp & numOfBits;
};

export const parseExpGolomb = (data: ArrayBuffer): number => {
    let leadingZeroBits = -1;
    for (let b = 0; !b; leadingZeroBits++) {
        // b = data[0];
    }
    const codeNum = Math.pow(2, leadingZeroBits) - 1 + readBits(0, data, leadingZeroBits,);
    return 0;
};
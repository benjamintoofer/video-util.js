import { IBox, IFullBox, parseFullBox, getUint53, stringifyBox } from "./box";

interface IReference {
    referenceType: number;                  // 1 bit
    referenceSize: number;                   // 31 bit unsigned
    subSegmentDuration: number;              // 32 bit unsigned
    startsWithSAP: number;                 // 1 bit
    SAPType: number;                        // 3 bit unsigned
    SAPDeltaTime: number;                   // 28 bit unsigned
}

export interface ISIDX extends IFullBox {
    referenceID: number;                    // 32 bit unsigned
    timescale: number;                      // 32 bit unsigned
    earliestPresentationTime: number;        // 32 bit unsigned or 64 bit unsigned
    firstOffset: number;                     // 32 bit unsigned or 64 bit unsigned
    referenceCount: number;                  // 16 bit unsigned
    references: IReference[];


}

/**
 * ISO/IEC 14496-12:2012
 * 8.16.3
 *
 * Segment Index Box
 */
export class SIDX implements ISIDX {

    public static TYPE: string = "sidx";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public referenceID: number;
    public timescale: number;
    public earliestPresentationTime: number;
    public firstOffset: number;
    public referenceCount: number;
    public references: IReference[] = [];

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, dv: DataView) {
        const  { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let byteOffset = 12;

        this.referenceID = dv.getUint32(byteOffset);
        byteOffset += 4;

        this.timescale = dv.getUint32(byteOffset);
        byteOffset += 4;

        if (this.version === 0) {
            this.earliestPresentationTime = dv.getUint32(byteOffset);
            byteOffset += 4;

            this.firstOffset = dv.getUint32(byteOffset);
            byteOffset += 4;
        } else {
            this.earliestPresentationTime = getUint53(dv, byteOffset);
            byteOffset += 8;

            this.firstOffset = getUint53(dv, byteOffset);
            byteOffset += 8;
        }

        // Skip 16 bit reserv
        byteOffset += 2;

        this.referenceCount = dv.getUint16(byteOffset);
        byteOffset += 2;

        for( let i = 0; i < this.referenceCount; i++) {
            const reference: IReference = { } as IReference;

            let temp = dv.getUint32(byteOffset);
            byteOffset += 4;

            reference.referenceType = temp & 1;
            reference.referenceSize = temp & 0xefff;
            reference.subSegmentDuration = dv.getUint32(byteOffset);
            byteOffset += 4;

            temp = dv.getUint32(byteOffset);
            reference.startsWithSAP = (temp >>> 31) & 0x1;
            reference.SAPType = (temp >>> 28) & 0x7;
            reference.SAPDeltaTime = temp & (0xfffffff);
            this.references.push(reference);
        }

    }
    
    public toString(detail: boolean): string {
        if (detail) {
            return `${SIDX.TYPE}: ${stringifyBox(this)}`;
        }
        return SIDX.TYPE;
    }
}

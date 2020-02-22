import { IBox, parseFullBox, IFullBox, stringifyBox } from "./box";

export interface Imfhd extends IFullBox {
    sequenceNumber: number      // 32 bit unsigned
}

/**
 * ISO/IEC 14496-12:2012
 * 8.8.5
 * 
 * Move Fragment Header Box contains a sequence number, as a safety check. The sequence number
 * usually starts at 1 and must increase for each movie fragment in the file, in the order in which
 * they occur. This allows readers to verify integrity of the sequence; it is an error to construct
 * a file where the fragments are out of sequence.
 */
export class mfhd implements Imfhd {

    public static TYPE: string = "mfhd";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public sequenceNumber: number;

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let byteOffset = 12;
        this.sequenceNumber = dv.getUint32(byteOffset);
    }

    public toString(_detail: boolean): string {
        return `${mfhd.TYPE}: ${stringifyBox(this)}`
    }
}
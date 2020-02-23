/**
 * Track Fragment Decode Time Box
 */
import { IBox, IFullBox, parseFullBox, getUint53, stringifyBox } from "./box";

export interface ITFDT extends IFullBox {
    baseMediaDecodeTime: number;        // if version == 1 ? 64 bit unsigned : 32 bit unsigned
}

export class TFDT implements ITFDT {
    public static TYPE: string = "tfdt";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;
    
    public baseMediaDecodeTime: number;

    private absoluteOffset: number;

    constructor(_box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;
        this.absoluteOffset = dv.byteOffset;

        const offset = 12;
        if (this.version) {
            this.baseMediaDecodeTime = getUint53(dv, offset);
        } else {
            this.baseMediaDecodeTime = dv.getUint32(offset);
        }
    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${TFDT.TYPE}: ${stringifyBox(this)}`;
        }
        return TFDT.TYPE;
    }

    public getAbsoluteOffset(): number {
        return this.absoluteOffset;
    }
}
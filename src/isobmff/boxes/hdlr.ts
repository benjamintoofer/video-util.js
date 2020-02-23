import { IBox, byteToString, stringifyBox, parseFullBox } from "./box";

export interface IHDLR extends IBox {
    handlerType: string;             // 32 bit unsigned
    name: string;
}

/**
 * ISO/IEC 14496-12:2012
 * 8.4.3
 *
 * Handler Reference Box
 */
export class HDLR implements IHDLR {

    public static TYPE: string = "hdlr";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public getAbsoluteOffset: () => number;

    public handlerType: string;
    public name: string;

    constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let byteOffset = 12;
        // pre_defined
        byteOffset += 4;
        this.handlerType = byteToString(dv.getUint32(byteOffset));
        byteOffset += 4;

        //3 reserved 32 bit
        byteOffset += 12;

        let str = "";
        const start = dv.byteOffset + byteOffset;
        const end = dv.byteOffset + this.size - 1;
        const temp = new DataView(dv.buffer.slice(start, end)); 

        for (let i = 0; i < temp.byteLength; i++) {
            str += String.fromCharCode(temp.getUint8(i));
        }   
        this.handlerType = str;
    }


    public toString(detail: boolean = false): string {
        if (detail) {
            return `${HDLR.TYPE}: ${stringifyBox(this)}`;
        }
        return `${HDLR.TYPE}`;
    }

    public static containsBox(box: string): boolean {
        return HDLR.CHILDREN.indexOf(box) !== -1;
    }
}

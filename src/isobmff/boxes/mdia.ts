import { IBox, stringifyBox } from "./box";
import { MDHD } from "./MDHD";
import { HDLR } from "./HDLR";
import { MINF } from "./MINF";

export interface IMDIA extends IBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.4.1
 *
 * Media Box
 */
export class MDIA implements IMDIA{

    public static TYPE: string = "mdia";
    public static CHILDREN: string[] = [
        MDHD.TYPE,
        HDLR.TYPE,
        MINF.TYPE,
    ];

    public type: string;
    public size: number;

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, _dv: DataView) {
        this.type = box.type;
        this.size = box.size;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);
    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${MDIA.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MDIA.TYPE}`;
    }
}
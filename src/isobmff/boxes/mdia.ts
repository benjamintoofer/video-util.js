import { IBox, stringifyBox } from "./box";
import { mdhd } from "./mdhd";
import { hdlr } from "./hdlr";
import { minf } from "./minf";

export interface Imdia extends IBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.4.1
 *
 * Media Box
 */
export class mdia implements Imdia {

    public static TYPE: string = "mdia";
    public static CHILDREN: string[] = [
        mdhd.TYPE,
        hdlr.TYPE,
        minf.TYPE,
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
            return `${mdia.TYPE}: ${stringifyBox(this)}`;
        }
        return `${mdia.TYPE}`;
    }
}
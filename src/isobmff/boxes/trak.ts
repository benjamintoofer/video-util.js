import { IBox, stringifyBox } from "./box";
import { edts } from "./edts";
import { tkhd } from "./tkhd";
import { mdia } from "./mdia";

export interface Itrak extends IBox {

}

/**
 * ISO/IEC 14496-12:2012
 * 8.3.1
 *
 * Track Box
 */
export class trak implements Itrak {

    public static TYPE: string = "trak";
    public static CHILDREN: string[] = [
      tkhd.TYPE,
      // tref
      // trgr
      mdia.TYPE,
      edts.TYPE,
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
            return `${trak.TYPE}: ${stringifyBox(this)}`;
        }
        return `${trak.TYPE}`;
    }
}
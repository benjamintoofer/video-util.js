import { IBox, stringifyBox } from "./box";
import { EDTS } from "./EDTS";
import { TKHD } from "./TKHD";
import { MDIA} from "./MDIA";

export interface ITRAK extends IBox {

}

/**
 * ISO/IEC 14496-12:2012
 * 8.3.1
 *
 * Track Box
 */
export class TRAK implements ITRAK {

    public static TYPE: string = "trak";
    public static CHILDREN: string[] = [
      TKHD.TYPE,
      // tref
      // trgr
      MDIA.TYPE,
      EDTS.TYPE,
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
            return `${TRAK.TYPE}: ${stringifyBox(this)}`;
        }
        return `${TRAK.TYPE}`;
    }
}
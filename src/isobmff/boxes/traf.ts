
import { IBox, stringifyBox } from "./box";
import { TFHD } from "./TFHD";
import { TRUN } from "./TRUN";
import { TFDT } from "./TFDT";

export interface ITRAF extends IBox {

}

/**
 * ISO/IEC 14496-12:2012
 * 
 * Track Fragment Box
 */

export class TRAF implements ITRAF {

    public static TYPE: string = "traf";
    public static CHILDREN: string[] = [
        TFHD.TYPE,
        TRUN.TYPE,
        TFDT.TYPE,
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
            return `${TRAF.TYPE}: ${stringifyBox(this)}`;
        }
        return `${TRAF.TYPE}`;
    }
}
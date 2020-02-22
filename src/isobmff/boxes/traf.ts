
import { IBox, stringifyBox } from "./box";
import { tfhd } from "./tfhd";
import { trun } from "./trun";
import { tfdt } from "./tfdt";

export interface Itraf extends IBox {

}

/**
 * ISO/IEC 14496-12:2012
 * 
 * Track Fragment Box
 */

export class traf implements Itraf {

    public static TYPE: string = "traf";
    public static CHILDREN: string[] = [
        tfhd.TYPE,
        trun.TYPE,
        tfdt.TYPE,
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
            return `${traf.TYPE}: ${stringifyBox(this)}`;
        }
        return `${traf.TYPE}`;
    }
}
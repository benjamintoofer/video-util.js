/**
 * Movie Fragment Box
 */
import { IBox, stringifyBox } from "./box";
import { MFHD } from "./MFHD";
import { TRAF } from "./TRAF";

export interface IMOOF extends IBox { }

export class MOOF implements IMOOF {

    public static TYPE: string  = "moof";
    public static CHILDREN: string[] = [
        TRAF.TYPE,
        MFHD.TYPE,
    ]

    public type: string;
    public size: number; 

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, _dv: DataView) {
        this.type = box.type;
        this.size = box.size;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);
    }

    public toString(detail: boolean = false): string {
        if (detail) {
            return `${MOOF.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MOOF.TYPE}`;
    }
}

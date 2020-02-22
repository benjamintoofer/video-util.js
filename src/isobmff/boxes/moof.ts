/**
 * Movie Fragment Box
 */
import { IBox, stringifyBox } from "./box";
import { mfhd } from "./mfhd";
import { traf } from "./traf";

export interface Imoof extends IBox { }

export class moof implements Imoof {

    public static TYPE: string  = "moof";
    public static CHILDREN: string[] = [
        traf.TYPE,
        mfhd.TYPE,
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
            return `${moof.TYPE}: ${stringifyBox(this)}`;
        }
        return `${moof.TYPE}`;
    }
}

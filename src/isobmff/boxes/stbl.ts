import { IBox, stringifyBox } from "./box";

export interface Istbl extends IBox { }

/**
 * ISO/IEC 14496-12:2012
 * 8.7.1
 *
 * 
 */
export class stbl implements Istbl {

    public static TYPE: string = "stbl";
    public static CHILDREN: string[] = [

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
            return `${stbl.TYPE}: ${stringifyBox(this)}`;
        }
        return `${stbl.TYPE}`;
    }
}
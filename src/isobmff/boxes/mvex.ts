import { IBox, stringifyBox } from "./box";

export interface IMVEX extends IBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.8.1
 *
 * Movie Extends Box
 */
export class MVEX implements IMVEX {

    public static TYPE: string = "mvex";
    public static CHILDREN: string[] = [
        // mehd
        // trex
        // leva
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
            return `${MVEX.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MVEX.TYPE}`;
    }
}
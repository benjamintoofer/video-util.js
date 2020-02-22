import { IBox, stringifyBox } from "./box";
import { dinf } from "./dinf";

export interface Iminf extends IBox { }

/**
 * ISO/IEC 14496-12:2012
 * 8.4.4
 *
 * Media Information Box
 */
export class minf implements Iminf {

    public static TYPE: string = "minf";
    public static CHILDREN: string[] = [
        // vmhd
        // smhd
        // hmhd
        // nmhd
        dinf.TYPE,
        // stbl
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
            return `${minf.TYPE}: ${stringifyBox(this)}`;
        }
        return `${minf.TYPE}`;
    }
}
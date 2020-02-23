import { IBox, stringifyBox } from "./box";
import { DINF} from "./DINF";

export interface IMINF extends IBox { }

/**
 * ISO/IEC 14496-12:2012
 * 8.4.4
 *
 * Media Information Box
 */
export class MINF implements IMINF {

    public static TYPE: string = "minf";
    public static CHILDREN: string[] = [
        // VMHD
        // SMHD
        // hmhd
        // nmhd
        DINF.TYPE,
        // STBL
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
            return `${MINF.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MINF.TYPE}`;
    }
}
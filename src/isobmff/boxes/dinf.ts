import { IBox, stringifyBox } from "./box";

export interface Idinf extends IBox { }

/**
 * ISO/IEC 14496-12:2012
 * 8.7.1
 *
 * Data Information Box
 */
export class dinf implements Idinf {

    public static TYPE: string = "dinf";
    public static CHILDREN: string[] = [
        // dref
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
            return `${dinf.TYPE}: ${stringifyBox(this)}`;
        }
        return `${dinf.TYPE}`;
    }
}
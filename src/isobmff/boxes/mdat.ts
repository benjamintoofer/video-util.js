/**
 * Media Data Box
 */
import { IBox, stringifyBox } from "./box";

export interface IMDAT extends IBox {
    data: DataView;
}

export class MDAT implements IMDAT {
    public static TYPE: string = "mdat";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public data: DataView;

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, dv: DataView) {
        this.type = box.type;
        this.size = box.size;
        this.data = new DataView(dv.buffer, dv.byteOffset + 8, this.size - 8);

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);
    }

    public toString(detail: boolean = false): string {
        if (detail) {
            return `${MDAT.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MDAT.TYPE}`;
    }
} 
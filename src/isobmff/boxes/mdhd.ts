
import { IBox, stringifyBox, IFullBox, parseFullBox } from "./box";

export interface Imdhd extends IFullBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.4.2
 * 
 * Media Header Box
 */

export class mdhd implements Imdhd {

    public static TYPE: string = "mdhd";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);
    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${mdhd.TYPE}: ${stringifyBox(this)}`;
        }
        return `${mdhd.TYPE}`;
    }
}
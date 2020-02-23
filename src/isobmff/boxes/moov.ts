import { IBox, stringifyBox } from "./box";
import { MVHD } from "./MVHD";
import { TRAK } from "./TRAK";
import { MVEX } from "./MVEX";
import { UDTA } from "./UDTA";

export interface IMOOV extends IBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.2.1
 *
 * Movie Box
 */
export class MOOV implements IMOOV {

    public static TYPE: string = "moov";
    public static CHILDREN: string[] = [
        MVHD.TYPE,
        TRAK.TYPE,
        MVEX.TYPE,
        UDTA.TYPE,
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
            return `${MOOV.TYPE}: ${stringifyBox(this)}`;
        }
        return `${MOOV.TYPE}`;
    }

    public static containsBox(box: string): boolean {
        return MOOV.CHILDREN.indexOf(box) !== -1;
    }
}
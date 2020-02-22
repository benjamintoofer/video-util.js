import { IBox, stringifyBox } from "./box";
import { mvhd } from "./mvhd";
import { trak } from "./trak";
import { mvex } from "./mvex";
import { udta } from "./udta";

export interface Imoov extends IBox {}

/**
 * ISO/IEC 14496-12:2012
 * 8.2.1
 *
 * Movie Box
 */
export class moov implements Imoov {

    public static TYPE: string = "moov";
    public static CHILDREN: string[] = [
        mvhd.TYPE,
        trak.TYPE,
        mvex.TYPE,
        udta.TYPE,
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
            return `${moov.TYPE}: ${stringifyBox(this)}`;
        }
        return `${moov.TYPE}`;
    }

    public static containsBox(box: string): boolean {
        return moov.CHILDREN.indexOf(box) !== -1;
    }
}
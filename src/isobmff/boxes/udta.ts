import { IBox, stringifyBox } from "./box";

export interface IUDTA extends IBox { }

/**
 * ISO/IEC 14496-12:2012
 * 8.8.1
 *
 * User Data Box
 */
export class UDTA implements IUDTA {

    public static TYPE: string = "udta";
    public static CHILDREN: string[] = [
        // meta
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
            return `${UDTA.TYPE}: ${stringifyBox(this)}`;
        }
        return `${UDTA.TYPE}`;
    }
}
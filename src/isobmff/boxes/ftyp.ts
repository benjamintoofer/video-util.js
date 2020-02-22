import { IBox, byteToString, stringifyBox } from "./box";

export interface Iftyp extends IBox {
    majorBrand: string;             // 32 bit unsigned
    minorVersion: number;           // 32 bit unsigned
    compatibleBrands: string[];     // 32 bit unsigned []
}

/**
 * ISO/IEC 14496-12:2012
 * 4.3
 * 
 * Fragment Type Box
 */
export class ftyp implements Iftyp {

    public static TYPE: string = "ftyp";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;

    public getAbsoluteOffset: () => number;

    public majorBrand: string;
    public minorVersion: number;
    public compatibleBrands: string[] = [];

    constructor(box: IBox, dv: DataView) {
        this.type = box.type;
        this.size = box.size;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let byteOffset = 8;
        this.majorBrand = byteToString(dv.getUint32(byteOffset));
        byteOffset += 4;

        this.minorVersion = dv.getUint32(byteOffset);
        byteOffset += 4;

        while (byteOffset < this.size) {
            this.compatibleBrands.push(byteToString(dv.getUint32(byteOffset)));
            byteOffset += 4;
        }
    }


    public toString(detail: boolean = false): string {
        if (detail) {
            return `${ftyp.TYPE}: ${stringifyBox(this)}`;
        }
        return `${ftyp.TYPE}`;
    }
}

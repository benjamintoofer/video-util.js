import { IBox, stringifyBox, IFullBox, parseFullBox } from "./box";

export interface Ivmhd extends IFullBox { 
    /**
     * specifies a composition mode for this video track, from the following enumerated set, 
     * which may be extended by derived specifications: 
     * 
     * copy = 0 copy over the existing image
     */
    graphicsMode: number;       // 16 bit unsigned
    /**
     * is a set of 3 colour values (red, green, blue) available for use by graphics mode
     */
    opColor: number[];          // 16 bit unsigned [3]
}

/**
 * ISO/IEC 14496-12:2012
 * 8.4.5.2
 *
 * Video Media Header Box
 */
export class vmhd implements Ivmhd {

    public static TYPE: string = "vmhd";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public getAbsoluteOffset: () => number;

    public graphicsMode: number = 0;
    public opColor: number[] = [0, 0, 0];


    constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let byteOffset = 12;
        this.graphicsMode = dv.getUint16(byteOffset);
        byteOffset += 2;

        for (let i = 0; i < 3; i++) {
            this.opColor[i] = dv.getUint16(byteOffset);
            byteOffset += 2;
        }
    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${vmhd.TYPE}: ${stringifyBox(this)}`;
        }
        return `${vmhd.TYPE}`;
    }
}
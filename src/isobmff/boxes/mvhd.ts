import { IBox, stringifyBox, IFullBox, parseFullBox } from "./box";

export interface Imvhd extends IFullBox {
    creationTime: number;
    modificationTime: number;
    timescale: number;
    duration: number;
    rate: number;
    volume: number;
    matrix: number[];
    nextTrackId: number;
}

/**
 * ISO/IEC 14496-12:2012
 * 8.2.2
 *
 * Movie Header Box
 */
export class mvhd implements Imvhd {

    public static TYPE: string = "mvhd";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public getAbsoluteOffset: () => number;

    public creationTime: number;
    public modificationTime: number;
    public timescale: number;
    public duration: number;
    public rate: number;
    public volume: number;
    public matrix: number[];
    public nextTrackId: number;

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
            return `${mvhd.TYPE}: ${stringifyBox(this)}`;
        }
        return `${mvhd.TYPE}`;
    }
}
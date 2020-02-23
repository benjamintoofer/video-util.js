import { IBox, stringifyBox, IFullBox, parseFullBox, getUint53 } from "./box";
// TODO (Ben Toofer): Finish parse

const enum tk_flags {
    TRACK_ENABLED =     0x000001,
    TRACK_IN_MOVIE =    0x000002,
    TRACK_IN_PREVIEW =  0x000004,
}

export interface ITKHD extends IFullBox {
    creationTime: number;
    modificationTime: number;
    trackId: number;
    duration: number;
    /**
     * specifies the front-to-back ordering of video tracks; tracks with lower numbers are
     * closer to the viewer. 0 is the normal value, and -1 would be in front of track 0, and
     * so on.
     */
    layer: number;
    alternateGroup: number;
    volume: number;
    /**
     * provides a transformation matrix for the video; (u,v,w) are restricted here to (0,0,1),
     * hex (0,0,0x40000000).
     */
    matrix: number[];
    width: number;
    height: number;
}

/**
 * ISO/IEC 14496-12:2012
 * 8.3.2
 *
 * Track Header Box Box
 */
export class TKHD implements ITKHD {

    public static TYPE = "tkhd";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public getAbsoluteOffset: () => number;

    public creationTime: number;
    public modificationTime: number;
    public trackId: number;
    public duration: number;
    public layer = 0;
    public alternateGroup = 0;
    public volume = 0;
    public matrix: number[] = [
        0x00010000, 0x0, 0x0,
        0x0, 0x00010000, 0x0,
        0x0, 0x0, 0x40000000,
    ];
    public width: number;
    public height: number;

    constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let offset = 12;
        if (this.version) {
            this.creationTime = getUint53(dv, offset);
            offset += 8;

            this.modificationTime = getUint53(dv, offset);
            offset += 8;

            this.trackId = dv.getUint32(offset);
            offset += 4;
            // Skip 32 bit reserved
            offset += 4;

            this.duration = getUint53(dv, offset);
            offset += 8;
        } else {
            this.creationTime = dv.getUint32(offset);
            offset += 4;

            this.modificationTime = dv.getUint32(offset);
            offset += 4;

            this.trackId = dv.getUint32(offset);
            offset += 4;
            // Skip 32 bit reserved
            offset += 4;

            this.duration = dv.getUint32(offset);
            offset += 4;
        }
    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${TKHD.TYPE}: ${stringifyBox(this)}`;
        }
        return `${TKHD.TYPE}`;
    }
}
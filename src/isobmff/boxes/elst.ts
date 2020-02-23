import { IBox, stringifyBox, IFullBox, parseFullBox, getUint53, getInt53 } from "./box";

interface IEdit {
    segmentDuration: number;
    mediaTime: number;                  
    mediaRateInteger: number;
    mediaRateFraction: number;
}

export interface IELST extends IFullBox {
    entryCount: number;         // 32 bit unsigned
    edits: IEdit[];
}

/**
 * ISO/IEC 14496-12:2012
 * 8.6.6
 * 
 * Edit List Box
 */
export class ELST implements IELST {

    public static TYPE: string = "elst";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public entryCount: number;
    public edits: IEdit[] = [];

    public getAbsoluteOffset: () => number;

    constructor(box: IBox, dv: DataView) {
        const fullBox = parseFullBox(dv);
        this.type = fullBox.type;
        this.size = fullBox.size;
        this.version = fullBox.version;
        this.flags = fullBox.flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let offset = 12;
        this.entryCount = dv.getUint32(offset);
        offset += 4;

        for (let i = 0; i < this.entryCount; i++) {
            const edit: IEdit  = {} as IEdit;
            if (this.version) {
                edit.segmentDuration = getUint53(dv, offset);
                offset += 8;
                
                edit.mediaTime = getInt53(dv, offset);
                offset += 8;
            } else {
                edit.segmentDuration = dv.getUint32(offset);
                offset += 4;

                edit.mediaTime = dv.getUint32(offset);
                offset += 4;
            }

            edit.mediaRateInteger = dv.getUint16(offset);
            offset += 2;

            edit.mediaRateFraction = dv.getUint16(offset);
            offset += 2;

            this.edits.push(edit);
        }

    }

    public toString(detail: boolean): string {
        if (detail) {
            return `${ELST.TYPE}: ${stringifyBox(this)}`;
        }
        return `${ELST.TYPE}`;
    }
}
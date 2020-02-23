
import { IBox, stringifyBox } from "./box";
import { ELST } from "./ELST";

export interface IEDTS extends IBox {

}

/**
 * ISO/IEC 14496-12:2012
 * 8.6.5
 *
 * Edit Box maps the presentation time-line to the media time-line as it is stored in the file.
 * The Edit Box is a container for the edit lists. 
 * 
 * The Edit Box is optional. In the absence of
 * this box, there is an implicit one-to-one mapping of these time-lines, and the presentation
 * of a track starts at the beginning of the presentation. An empty edit is used to offset the
 * start time of a track.
 */

export class EDTS implements IEDTS {

    public static TYPE: string = "edts";
    public static CHILDREN: string[] = [
        ELST.TYPE
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
            return `${EDTS.TYPE}: ${stringifyBox(this)}`;
        }
        return `${EDTS.TYPE}`;
    }
}
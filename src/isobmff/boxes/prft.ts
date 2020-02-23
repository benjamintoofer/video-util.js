import { IFullBox, IBox, parseFullBox, getUint53, stringifyBox } from "./box";

 export interface IPRFT extends IFullBox {
    referenceTrackID: number;       // 32 bit unsigned
    ntpTimestamp: number;           // 64 bit unsigned
    mediaTime: number;              // if version == 0 ? 32 bit unsigned : 64 bit unsigned
 }

 /**
  * ISO/IEC 14496-12:2012 
  * 8.16.5
  * 
  * Producer Reference Time Box supplies relative wall-clock times at which movie fragments, or
  * files containing movie fragments (such as segments) were produced. When these files are both produced
  * and consumed in real time, this can provide clients with information to enable consumption and
  * production to proceed at equivalent rates, thus avoiding possible buffer overflow or underflow.
  */
 export class PRFT implements IPRFT {

    public static TYPE: string = "prft";
    public static CHILDREN: string[] = [];

    public type: string;
    public size: number;
    public version: number;
    public flags: number;

    public referenceTrackID: number;
    public ntpTimestamp: number;
    public mediaTime: number;

    public getAbsoluteOffset: () => number;

    constructor(private box: IBox, dv: DataView) {
        const fullBox = parseFullBox(dv);
        this.type = fullBox.type;
        this.size = fullBox.size;
        this.version = fullBox.version;
        this.flags = fullBox.flags;

        this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let offset = 12;

        this.referenceTrackID = dv.getUint32(offset);
        offset += 4;

        this.ntpTimestamp = getUint53(dv, offset);
        offset += 8;

        if (this.version) {
            this.mediaTime = getUint53(dv, offset);
        } else {
            this.mediaTime = dv.getUint32(offset);
        }

    }

    public toString(detail: boolean): string {
        if  (detail) {
            return `${PRFT.TYPE}: ${stringifyBox(this)}`;
        }
    }
 }
/**
 * Track Fragment Run Box
 */
import { IBox, IFullBox, parseFullBox } from "./box";

const enum tr_flags {
    DATA_OFFSET_PRESENT =                       0x000001,
    /**
     * this over-rides the default flags for the first sample only. This makes it possible to 
     * record a group of frames where the first is a key and the rest are difference frames,
     * without supplying explicit flags for every sample. If this flag and field are used, sample-flags
     * shall not be present.
     */
    FIRST_SAMPLE_FLAGS_PRESENT =                0x000004,
    /**
     * indicates that each sample has its own duration, otherwise the default is used.
     */
    SAMPLE_DURATION_PRESENT =                   0x000100,
    /**
     * each sample has its own size, otherwise the default is used.
     */
    SAMPLE_SIZE_PRESENT =                       0x000200,
    /**
     * each sample has its own flags, otherwise the default is used.
     */
    SAMPLE_FLAGS_PRESENT =                      0x000400,
    /**
     * each sample has a composition time offset (e.g. as used for I/P/B video in MPEG).
     */
    SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT =    0x000800

}

export interface ISample {
    sampleDuration?: number                     // 32 bit unsigned
    sampleSize?: number                         // 32 bit unsigned
    sampleFlags?: number                        // 32 bit unsigned
    sampleCompositionTimeOffset?: number        // if version = 0 ? 32 bit unsigned : 32 bit signed
}

 export interface Itrun extends IFullBox {
     sampleCount: number        // 32 bit unsigned
     // Optional Fields
     dataOffset?: number        // 32 bit signed
     firstSampleFlags?: number  // 32 bit unsigned
     samples?: ISample[]  
 }

 export class trun implements Itrun {
     public static TYPE: string = "trun";
     public static CHILDREN: string[] = [];

     public type: string;
     public size: number;
     public version: number;
     public flags: number;

     public getAbsoluteOffset: () => number;

     public sampleCount: number;
     public dataOffset?: number;
     public firstSampleFlags?: number;
     public samples?: ISample[] = [];

     constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

         this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

         let offset = 12;

         this.sampleCount = dv.getUint32(offset);
         offset += 4;

         if (this.flags & tr_flags.DATA_OFFSET_PRESENT) {
             this.dataOffset = dv.getInt32(offset);
             offset += 4;
         }

         if (this.flags & tr_flags.FIRST_SAMPLE_FLAGS_PRESENT) {
             this.firstSampleFlags = dv.getUint32(offset);
             offset += 4;
         }

         for (let i = 0; i < this.sampleCount; i++) {
             const sample: ISample = {};
             if (this.flags & tr_flags.SAMPLE_DURATION_PRESENT) {
                 sample.sampleDuration = dv.getUint32(offset);
                 offset += 4;
             }

             if (this.flags & tr_flags.SAMPLE_SIZE_PRESENT) {
                 sample.sampleSize = dv.getUint32(offset);
                 offset += 4;
             }

             if (this.flags & tr_flags.SAMPLE_FLAGS_PRESENT) {
                 sample.sampleFlags = dv.getUint32(offset);
                 offset += 4;
             }

             if (this.flags & tr_flags.SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT) {
                 if (this.version) {
                    sample.sampleCompositionTimeOffset = dv.getInt32(offset);
                 } else {
                     sample.sampleCompositionTimeOffset = dv.getUint32(offset);
                 }
                 offset += 4;
             }
             this.samples.push(sample);
         }
     }

     public toString(): string {
        return JSON.stringify(this);
     }
 }

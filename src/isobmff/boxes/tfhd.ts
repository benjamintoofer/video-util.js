/**
 * Track Fragment Header Box
 */
import { IFullBox , IBox, parseFullBox, getUint53, stringifyBox } from "./box";

const enum tf_flags {
    /**
     * indicates the presence of the base-data-offset field. This provides an explicit anchor
     * for the data offsets in each track run (see below). If not provided, the base-data- offset
     * for the first track in the movie fragment is the position of the first byte of the enclosing
     * Movie Fragment Box, and for second and subsequent track fragments, the default is the end of
     * the data defined by the preceding fragment. Fragments 'inheriting' their offset in this way
     * must all use the same data-reference (i.e., the data for these tracks must be in the same file).
     */
    BASE_DATA_OFFSET_PRESENT =          0x000001,
    /**
     * indicates the presence of this field, which over-rides, in this fragment, the
     *  default set up in the Track Extends Box.
     */
    SAMPLE_DESCRIPTION_INDEX_PRESENT =  0x000002,
    DEFAULT_SAMPLE_DURATION_PRESENT =   0x000008,
    DEFAULT_SAMPLE_SIZE_PRESENT =       0x000010,
    DEFAULT_SAMPLE_FLAGS_PRESENT =      0x000020,
    /**
     * this indicates that the duration provided in either default-sample-duration, or by the 
     * default-duration in the Track Extends Box, is empty, i.e. that there are no samples for
     * this time interval. It is an error to make a presentation that has both edit lists in the
     * Movie Box, and empty- duration fragments.
     */
    DURATION_IS_EMPTY =                 0x010000,
    /**
     * Required from iso5 and on. If BASE_DATA_OFFSET_PRESENT, DEFAULT_BASE_IS_MOOF will
     * be set to indicate base-data-offset for this track fragment is the position of the 
     * first byte of the enclosing Movie Fragment Box (moof)
     */
    DEFAULT_BASE_IS_MOOF =              0x020000,   
}

 export interface Itfhd extends IFullBox {
     trackID: number;                   // 32 bit unsigned
     // Optional Fields
     baseDataOffset?: number;           // 64 bit unsigned
     sampleDescriptionIndex?: number;   // 32 bit unsigned
     defaultSampleDuration?: number;    // 32 bit unsigned
     defaultSampleSize?: number;        // 32 bit unsigned
     defaultSampleFlags?: number;       // 32 bit unsigned
     durationIsEmpty?: boolean;
     defaultBaseIfMoof?: boolean;      
 }

 export class tfhd implements Itfhd {
     
    public static TYPE: string ="tfhd";
    public static CHILDREN: string[] = [];

     public type: string;
     public size: number;
     public version: number;
     public flags: number;

     public getAbsoluteOffset: () => number;

     public trackID: number;
     public baseDataOffset?: number;
     public sampleDescriptionIndex?: number;
     public defaultSampleDuration?: number;
     public defaultSampleSize?: number;
     public defaultSampleFlags?: number;
     public durationIsEmpty?: boolean;
     public defaultBaseIfMoof?: boolean;


     constructor(box: IBox, dv: DataView) {
        const { type, size, version, flags } = parseFullBox(dv);
        this.type = type,
        this.size = size;
        this.version = version;
        this.flags = flags;

         this.getAbsoluteOffset = box.getAbsoluteOffset.bind(box);

        let offset = 12;

        this.trackID = dv.getUint32(offset);
        offset += 4;

        if (this.flags & tf_flags.BASE_DATA_OFFSET_PRESENT) {
            this.baseDataOffset = getUint53(dv, offset);
            offset += 8;
        }

        if (this.flags & tf_flags.SAMPLE_DESCRIPTION_INDEX_PRESENT) {
            this.sampleDescriptionIndex = dv.getUint32(offset);
            offset += 4;
        }

        if (this.flags * tf_flags.DEFAULT_SAMPLE_DURATION_PRESENT) {
            this.defaultSampleDuration = dv.getUint32(offset);
            offset += 4;
        }

        if (this.flags & tf_flags.DEFAULT_SAMPLE_SIZE_PRESENT) {
            this.defaultSampleSize = dv.getUint32(offset);
            offset += 4;
        }

        if (this.flags & tf_flags.DEFAULT_SAMPLE_FLAGS_PRESENT) {
            this.defaultSampleFlags = dv.getUint32(offset);
            offset += 4;
        }

        if (this.flags & tf_flags.DURATION_IS_EMPTY) {
            this.durationIsEmpty = true;
        }

        if (this.flags & tf_flags.DEFAULT_BASE_IS_MOOF) {
            this.defaultBaseIfMoof = true;
        }
    }

     public toString(detail: boolean): string {
        if (detail) {
            return `${tfhd.TYPE}: ${stringifyBox(this)}`;
        }
        return tfhd.TYPE;
     }
 }


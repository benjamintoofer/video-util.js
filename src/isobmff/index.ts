import { boxFactory, boxMap } from "./boxes/index";
import { IBox } from "./boxes/box";
import { ITRUN, TRUN } from "./boxes/TRUN";
import { IMDAT, MDAT } from "./boxes/MDAT";
import { ITFHD, TFHD } from "./boxes/TFHD";
import { IMOOF, MOOF } from "./boxes/MOOF";

export type ISOTree = { [x: string]: IBox };

export const getBoxAsJSON = (offset: number, segment: ArrayBuffer): IBox => {
    const parsedBox = boxFactory(offset, segment);
    let localBox = {...parsedBox};

    const boxClass = boxMap[parsedBox.type];
    if (boxClass.CHILDREN.length > 0) {

        let childOffset = offset + 8;
        for (let i = 0; i < boxClass.CHILDREN.length; i++) {
            const childBox = getBoxAsJSON(childOffset, segment);
            localBox = {
                ...localBox,
                [childBox.type]:{...childBox},
            };
            childOffset += childBox.size;
        }
    }
    return localBox;
};

export const findBox = <T extends IBox>(boxName: string, segment: ArrayBuffer, detail: boolean = false): T[] => {
    let offset = 0;
    let foundBoxes: T[] = [];
    while (offset < segment.byteLength) {
        const parsedBox = boxFactory<T>(offset, segment);
        if (parsedBox.type === boxName) {
            foundBoxes = [...foundBoxes, parsedBox];
        }

        const boxClass = boxMap[parsedBox.type];
        if (boxClass.CHILDREN.length > 0) {
            const start = offset + 8;
            const end = offset + parsedBox.size;
            const foundChildrenBoxes = findBox<T>(boxName, segment.slice(start, end), detail);
            foundBoxes = [...foundBoxes, ...foundChildrenBoxes];
            
        }
        offset += parsedBox.size;
    }

    return foundBoxes;
};

export const viewISOTreeAsJSON = (segment: ArrayBuffer): ISOTree  => {
    let offset = 0;
    let tree: { [x: string]: IBox } = {};
    const boxesSeen: { [box: string]: number } = {};

    while (offset < segment.byteLength) {
        const parsedBox = getBoxAsJSON(offset, segment);
        if (boxesSeen[parsedBox.type] === undefined) {
            boxesSeen[parsedBox.type] = 0;
        } else {
            boxesSeen[parsedBox.type]++;
        }
        const count = boxesSeen[parsedBox.type];
        tree = {
            ...tree,
            [`${parsedBox.type}-${count}`]: { ...parsedBox }
        };
        offset += parsedBox.size;
    }
    return tree;
};

export const extractCaptions = (segment: ArrayBuffer) => {
    const TRUNs = findBox<ITRUN>(TRUN.TYPE, segment);
    const MDATs = findBox<IMDAT>(MDAT.TYPE, segment);
    const TFHDs = findBox<ITFHD>(TFHD.TYPE, segment);
    const {
        defaultSampleDuration: sampleDuration,
        defaultSampleSize: sampleSize,
        baseDataOffset,
        defaultBaseIfMoof
    } = TFHDs[0];
    if (defaultBaseIfMoof) {
        
        console.log(TFHDs[0]);
        // const { } = TFHD[0]
        // const MOOFs = findBox<IMOOF>(MOOF.TYPE, segment);

    }
    if (MDATs.length !== TRUNs.length) {
        console.warn("number of MDATs is not equal to number of TRUNs");
        return;
    }
    TRUNs[0].samples.forEach((sample) => {
        console.log(JSON.stringify(sample));
    });
};

const NalUnitTypeMap: { [x: number]: string } = {
    0: "Unspecified",
    1: "Coded slice of a non-IDR picture",
    2: "Coded slice data partion A",
    3: "Coded slice data partion B",
    4: "Coded slice data partion C",
    5: "Coded slice of an IDR picture",
    6: "SEI",
    7: "SPS",
    8: "PPS",
    9: "Access Unit Delimeter",
    10: "End of sequence",
    11: "End of stream"
};

// eslint-disable-next-line @typescript-eslint/camelcase
const emulation_prevention_three_byte = 0x000003;

const isEmulationPreventionThreeByte = (threeByte: number): boolean => {
    return threeByte === emulation_prevention_three_byte;
};

const next24Bits = (dv: DataView, offset: number): number => {
    const threeByte = dv.getUint16(offset) * Math.pow(2, 8);
    return dv.getUint8(offset + 2) + threeByte;
};

const parseExpGolomb = (data: ArrayBuffer) => {
    let leadingZeroBits = -1;
    for (let b = 0; !b; leadingZeroBits++) {
        b = data[0];
    }
};

const slice_header = (nalUnitType: number) => {
    // first_mb_in_slice        ue(v)
    // slice_type               ue(v)
    // pic_parameter_set_id     ue(v)
    // frame_num                u(v)
};

const slice_layer_without_partitioning_rbsp = (rbsp: ArrayBuffer, nalUnitType: number) => {
    const start = rbsp.byteLength - 2;
    const end = start + 1;
    console.log(rbsp.slice(start - 1, end));
    slice_header(nalUnitType);
};

/**
 * This funciton is extracting the RBSP data while discarding all the emulation_prevention_three_bytes
 * @param {ArrayBuffer} nalUnit The NAL Unit frmo which the rbsp will be extracted from
 */
const discardEmulationPreventionBytesFromRBSP = (nalUnit: ArrayBuffer): ArrayBuffer => {
    const dv = new DataView(nalUnit);
    let numBytesInRBSP = 0;
    const rbspWithoutPreventionThreeByte = [];
    let offset = 0;

    while (offset < dv.byteLength) {
        if (offset + 2 < dv.byteLength && isEmulationPreventionThreeByte(next24Bits(dv, offset))){
            rbspWithoutPreventionThreeByte[numBytesInRBSP++] = dv.getUint8(offset++);
            rbspWithoutPreventionThreeByte[numBytesInRBSP++] = dv.getUint8(offset++);
            offset++;
        } else {
            rbspWithoutPreventionThreeByte[numBytesInRBSP++] = dv.getUint8(offset++);
        }
    }
    return Uint8Array.from(rbspWithoutPreventionThreeByte).buffer;
};
/**
 * 
 * @param nalHeader 8 bit
 */
const parseNALHeader = (nalHeader: number) => {
    const forbiddenZerioBit = (nalHeader & 0x80) >>> 7;
    const nalRefIDC = (nalHeader & 0x60) >>> 5;
    const type = nalHeader & 0x1f;

    console.log(`RefIDC: ${nalRefIDC} - ${NalUnitTypeMap[type]}`);
    return {
        forbiddenZerioBit,
        nalRefIDC,
        type,
    };
};

const parseNalUnit = (nalUnit: ArrayBuffer) => {
    const dv = new DataView(nalUnit);
    const header = dv.getUint8(0);
    const nalHeader = parseNALHeader(header);
    if (nalHeader.type === 1 || nalHeader.type === 5) {
        const start = dv.byteOffset + 1;
        const end = start + nalUnit.byteLength - 1;
        const extractedRbspData = discardEmulationPreventionBytesFromRBSP(nalUnit.slice(start, end));
        slice_layer_without_partitioning_rbsp(extractedRbspData,nalHeader.type);
    }

};

export const parseNALUnits = (segment: ArrayBuffer) => {
    const MDATs = findBox<IMDAT>(MDAT.TYPE, segment);
    const MDATBox = MDATs[0].data;
    
    let offset = 0;
    const index = 0;
    while (offset < MDATBox.byteLength) {
        const length = MDATBox.getUint32(offset);
        offset += 4;
        const start = MDATBox.byteOffset + offset;
        const end = start + length;
        const nalUnit = MDATBox.buffer.slice(start, end);
        parseNalUnit(nalUnit);
        // const header = MDATBox.getUint8(offset);
        // parseNALHeader(header);
        offset += length;
        // REMOVE THIS
        // if (index > 2){
        //     break;
        // }
        // index++;
    }
};




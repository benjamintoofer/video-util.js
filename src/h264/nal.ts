import { findBox } from "../isobmff";
import { IMDAT, MDAT } from "../isobmff/boxes/MDAT";
import { parseExpGolomb } from "./util";

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

const sliceTypeMap: { [x: number]: string } = {
    0: "P slice",
    1: "B slice",
    2: "I slice",
    3: "SP slice",
    4: "SI slice",
    5: "P slice",
    6: "B slice",
    7: "I slice",
    8: "SP slice",
    9: "SI slice",
};

const slice_header = (nalUnitType: number, rbsp: ArrayBuffer): void => {
    // first_mb_in_slice        ue(v)
    // slice_type               ue(v)
    // pic_parameter_set_id     ue(v)
    // frame_num                u(v)
    const first_mb_in_slice = parseExpGolomb(0, rbsp);
    const slice_type = parseExpGolomb(first_mb_in_slice.bitOffset, rbsp);
    const pic_parameter_set_id = parseExpGolomb(slice_type.bitOffset, rbsp);
    // console.warn(`MACROBLOCK ADDRESS: ${first_mb_in_slice.codeNum}, ${first_mb_in_slice.bitOffset}`);
    console.warn(`NAL UNIT- ${nalUnitType} SLICE TYPE: ${sliceTypeMap[slice_type.codeNum]} PPS: ${pic_parameter_set_id.codeNum}`);
};

const slice_layer_without_partitioning_rbsp = (rbsp: ArrayBuffer, nalUnitType: number): void => {
    const start = rbsp.byteLength - 2;
    const end = start + 1;
    // console.log(rbsp.slice(start - 1, end));
    slice_header(nalUnitType, rbsp);
};

const rbsp_trailing_bits = (rbsp: ArrayBuffer): ArrayBuffer => {
    const dv = new DataView(rbsp);
    // console.log(dv.getUint8(dv.byteLength - 1).toString(2));
    return rbsp;
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
        if (offset + 2 < dv.byteLength && isEmulationPreventionThreeByte(next24Bits(dv, offset))) {
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

const parseNalUnit = (nalUnit: ArrayBuffer): void => {
    const dv = new DataView(nalUnit);
    const header = dv.getUint8(0);
    const nalHeader = parseNALHeader(header);
    const start = dv.byteOffset + 1;
    const end = start + nalUnit.byteLength - 1;
    const extractedRbspData = discardEmulationPreventionBytesFromRBSP(nalUnit.slice(start, end));
    const temp = rbsp_trailing_bits(extractedRbspData);
    if (nalHeader.type === 10) {
        console.warn("END OF SEQUENCE");
    }
    if (nalHeader.type === 1 || nalHeader.type === 5) {
        // NOTE (benjamintooofer@gmail.com): Make sure to omit the trailing rbsp bit
        slice_layer_without_partitioning_rbsp(extractedRbspData, nalHeader.type);
    }

};

export const parseNALUnits = (segment: ArrayBuffer): void => {
    const mdats = findBox<IMDAT>(MDAT.TYPE, segment);
    const MDATBox = mdats[0].data;
    let offset = 0;

    while (offset < MDATBox.byteLength) {
        const length = MDATBox.getUint32(offset);
        offset += 4;
        const start = MDATBox.byteOffset + offset;
        const end = start + length;
        const nalUnit = MDATBox.buffer.slice(start, end);
        parseNalUnit(nalUnit);
        offset += length;
    }

    
};
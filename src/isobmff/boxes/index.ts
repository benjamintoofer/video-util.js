import { IBox, parseBox } from "./box";
import { STYP } from "./STYP";
import { PRFT } from "./PRFT";
import { SIDX } from "./SIDX";
import { FTYP } from "./FTYP";
import { MOOV } from "./MOOV";
import { MOOF } from "./MOOF";
import { MFHD } from "./MFHD";
import { MDAT } from "./MDAT";
import { TRUN } from "./TRUN";
import { TRAF } from "./TRAF";
import { TFDT } from "./TFDT";
import { TFHD } from "./TFHD";
import { MVHD } from "./MVHD";
import { ELST } from "./ELST";
import { EDTS } from "./EDTS";
import { TRAK } from "./TRAK";
import { TKHD } from "./TKHD";
import { MDIA} from "./mdia";
import { MVEX } from "./MVEX";
import { UDTA } from "./UDTA";
import { MDHD } from "./MDHD";
import { HDLR } from "./HDLR";
import { MINF } from "./MINF";
import { DINF} from "./DINF";
import { VMHD } from "./VMHD";
import { STBL } from "./STBL";
import { SMHD } from "./SMHD";

type BoxClassType = 
    typeof STYP |
    typeof PRFT |
    typeof SIDX |
    typeof FTYP |
    typeof TRUN |
    typeof MOOV |
    typeof MOOF |
    typeof MFHD |
    typeof MVHD |
    typeof MDAT |
    typeof TRAF |
    typeof TFDT |
    typeof TFHD |
    typeof TRAK |
    typeof TKHD |
    typeof MDIA|
    typeof MVEX |
    typeof UDTA |
    typeof MDHD |
    typeof HDLR |
    typeof MINF |
    typeof DINF|
    typeof VMHD |
    typeof STBL |
    typeof SMHD |
    typeof EDTS |
    typeof ELST;

export const boxMap: { [x: string]: BoxClassType | undefined } = {
    [STYP.TYPE]: STYP,
    [PRFT.TYPE]: PRFT,
    [SIDX.TYPE]: SIDX,
    [FTYP.TYPE]: FTYP,
    [MOOV.TYPE]: MOOV,
    [MOOF.TYPE]: MOOF,
    [MFHD.TYPE]: MFHD,
    [MVHD.TYPE]: MVHD,
    [MDAT.TYPE]: MDAT,
    [TRUN.TYPE]: TRUN,
    [TRAF.TYPE]: TRAF,
    [TFDT.TYPE]: TFDT,
    [TFHD.TYPE]: TFHD,
    [EDTS.TYPE]: EDTS,
    [ELST.TYPE]: ELST,
    [TRAK.TYPE]: TRAK,
    [TKHD.TYPE]: TKHD,
    [mdia.TYPE]: mdia,
    [MVEX.TYPE]: MVEX,
    [UDTA.TYPE]: UDTA,
    [MDHD.TYPE]: MDHD,
    [HDLR.TYPE]: HDLR,
    [MINF.TYPE]: MINF,
    [DINF.TYPE]: DINF,
    [VMHD.TYPE]: VMHD,
    [STBL.TYPE]: STBL,
    [SMHD.TYPE]: SMHD,
};

export const boxFactory = <T extends IBox>(offset: number, data: ArrayBuffer): T => {
    const dv = new DataView(data, offset);
    const box = parseBox(dv);
    if (boxMap[box.type] === undefined) {
        console.error(`No class implementation for ${box.type}`);
        return box as T;
    }
    return new boxMap[box.type](box, dv) as T;
};

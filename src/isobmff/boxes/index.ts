import { IBox, parseBox } from "./box";
import { STYP } from "./styp";
import { PRFT } from "./prft";
import { SIDX } from "./sidx";
import { FTYP } from "./ftyp";
import { MOOV } from "./moov";
import { MOOF } from "./moof";
import { MFHD } from "./mfhd";
import { MDAT } from "./mdat";
import { TRUN } from "./trun";
import { TRAF } from "./traf";
import { TFDT } from "./tfdt";
import { TFHD } from "./tfhd";
import { MVHD } from "./mvhd";
import { ELST } from "./elst";
import { EDTS } from "./edts";
import { TRAK } from "./trak";
import { TKHD } from "./tkhd";
import { MDIA} from "./mdia";
import { MVEX } from "./mvex";
import { UDTA } from "./udta";
import { MDHD } from "./mdhd";
import { HDLR } from "./hdlr";
import { MINF } from "./minf";
import { DINF} from "./dinf";
import { VMHD } from "./vmhd";
import { STBL } from "./stbl";
import { SMHD } from "./smhd";

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
    [MDIA.TYPE]: MDIA,
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

import { IBox, parseBox } from "./box";
import { styp } from "./styp";
import { prft } from "./prft";
import { sidx } from "./sidx";
import { ftyp } from "./ftyp";
import { moov } from "./moov";
import { moof } from "./moof";
import { mfhd } from "./mfhd";
import { mdat } from "./mdat";
import { trun } from "./trun";
import { traf } from "./traf";
import { tfdt } from "./tfdt";
import { tfhd } from "./tfhd";
import { mvhd } from "./mvhd";
import { elst } from "./elst";
import { edts } from "./edts";
import { trak } from "./trak";
import { tkhd } from "./tkhd";
import { mdia } from "./mdia";
import { mvex } from "./mvex";
import { udta } from "./udta";
import { mdhd } from "./mdhd";
import { hdlr } from "./hdlr";
import { minf } from "./minf";
import { dinf } from "./dinf";
import { vmhd } from "./vmhd";
import { stbl } from "./stbl";
import { smhd } from "./smhd";

type BoxClassType = 
    typeof styp |
    typeof prft |
    typeof sidx |
    typeof ftyp |
    typeof trun |
    typeof moov |
    typeof moof |
    typeof mfhd |
    typeof mvhd |
    typeof mdat |
    typeof traf |
    typeof tfdt |
    typeof tfhd |
    typeof trak |
    typeof tkhd |
    typeof mdia |
    typeof mvex |
    typeof udta |
    typeof mdhd |
    typeof hdlr |
    typeof minf |
    typeof dinf |
    typeof vmhd |
    typeof stbl |
    typeof smhd |
    typeof edts |
    typeof elst;

export const boxMap: { [x: string]: BoxClassType | undefined } = {
    [styp.TYPE]: styp,
    [prft.TYPE]: prft,
    [sidx.TYPE]: sidx,
    [ftyp.TYPE]: ftyp,
    [moov.TYPE]: moov,
    [moof.TYPE]: moof,
    [mfhd.TYPE]: mfhd,
    [mvhd.TYPE]: mvhd,
    [mdat.TYPE]: mdat,
    [trun.TYPE]: trun,
    [traf.TYPE]: traf,
    [tfdt.TYPE]: tfdt,
    [tfhd.TYPE]: tfhd,
    [edts.TYPE]: edts,
    [elst.TYPE]: elst,
    [trak.TYPE]: trak,
    [tkhd.TYPE]: tkhd,
    [mdia.TYPE]: mdia,
    [mvex.TYPE]: mvex,
    [udta.TYPE]: udta,
    [mdhd.TYPE]: mdhd,
    [hdlr.TYPE]: hdlr,
    [minf.TYPE]: minf,
    [dinf.TYPE]: dinf,
    [vmhd.TYPE]: vmhd,
    [stbl.TYPE]: stbl,
    [smhd.TYPE]: smhd,
}

export const boxFactory = <T extends IBox>(offset: number, data: ArrayBuffer): T => {
    const dv = new DataView(data, offset);
    const box = parseBox(dv);
    if (boxMap[box.type] === undefined) {
        console.error(`No class implementation for ${box.type}`);
        return box as T;
    }
    return new boxMap[box.type](box, dv) as T;
}

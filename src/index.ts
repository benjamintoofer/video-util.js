import { 
    viewISOTreeAsJSON, findBox, extractCaptions, parseNALUnits
} from "./isobmff";
import * as fs from "fs";
import * as path from "path";
import { IELST } from "./isobmff/boxes/ELST";
import { ITRUN } from "./isobmff/boxes/TRUN";

// const segmentPath = path.join(__dirname, "../segments/chunk-stream_t_1-40517.m4s");
// fs.readFile(segmentPath, null, (err, data)=> {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     extractCaptions(data.buffer);
// });

// const initHeaderPath = path.join(__dirname, "../segments/init-stream0.m4s");
// fs.readFile(initHeaderPath, null, (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     const ELST = findBox<IELST>("ELST", data.buffer)[0];
//     console.log(ELST.edits);
// });

const initHeaderPath2 = path.resolve(__dirname, "../segments/cea-608/v_1.m4s");
fs.readFile(initHeaderPath2, null, (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // const TRUN = findBox<ITRUN>("TRUN", data.buffer)[0];
    // console.log(TRUN);
    parseNALUnits(data.buffer);
});

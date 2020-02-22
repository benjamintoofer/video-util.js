import { 
    viewISOTreeAsJSON, findBox, extractCaptions, parseNALUnits
} from "./isobmff";
import * as fs from "fs";
import * as path from 'path';
import { Ielst } from "./isobmff/boxes/elst";
import { Itrun } from "./isobmff/boxes/trun";

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

//     const elst = findBox<Ielst>("elst", data.buffer)[0];
//     console.log(elst.edits);
// });

const initHeaderPath2 = path.join(__dirname, "../segments/cea-608/v_1.m4s");
fs.readFile(initHeaderPath2, null, (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // const trun = findBox<Itrun>("trun", data.buffer)[0];
    // console.log(trun);
    parseNALUnits(data.buffer);
});

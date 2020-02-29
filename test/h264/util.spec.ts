import "mocha";
import { expect } from "chai";

import { CEA_608_V_1_MP4 } from "../assets/index";
import { readBits, parseExpGolomb } from "../../src/h264/util";
import { base64ToArrayBuffer } from "../helper.spec";

describe("H.246 Util", () => {

    describe("readBits", () => {

        const cea608VideoSegment = base64ToArrayBuffer(CEA_608_V_1_MP4);
        it ("read bits 0-32, 0-4, 4-8, 8-12, 12-16, 16-20, 20-24, 24-28, 28-32", () => {
            const BIT_OFFSET = 32;
            // 0-32
            expect(readBits(BIT_OFFSET, cea608VideoSegment, 32)).to.eql(0x73747970);
            // 0-4
            expect(readBits(BIT_OFFSET, cea608VideoSegment, 4)).to.eql(0x7);
            // 4-8
            expect(readBits(BIT_OFFSET + 4, cea608VideoSegment, 4)).to.eql(0x3);
            // 8-12
            expect(readBits(BIT_OFFSET + 8, cea608VideoSegment, 4)).to.eql(0x7);
            // 12-16
            expect(readBits(BIT_OFFSET + 12, cea608VideoSegment, 4)).to.eql(0x4);
            // 16-20
            expect(readBits(BIT_OFFSET + 16, cea608VideoSegment, 4)).to.eql(0x7);
            // 20-24
            expect(readBits(BIT_OFFSET + 20, cea608VideoSegment, 4)).to.eql(0x9);
            // 24-28
            expect(readBits(BIT_OFFSET + 24, cea608VideoSegment, 4)).to.eql(0x7);
            // 28-32
            expect(readBits(BIT_OFFSET + 28, cea608VideoSegment, 4)).to.eql(0x0);
        });
    });

    describe("parseExpGolomb", () => {
        it.only("TEST", () => {
            const data = new Uint8Array([141, 3, 148, 0, 0, 0, 0, 0]);
            console.warn(data.buffer);
            let res = parseExpGolomb(0, data.buffer);
            console.log(res);
            res = parseExpGolomb(res.bitOffset, data.buffer);
            console.log(res);
            res = parseExpGolomb(res.bitOffset, data.buffer);
            console.log(res);
        });
    });
});

// 1110011011101000111100101110000

import { boxFactory, boxMap } from "./boxes/index";
import { IBox } from "./boxes/box";
import { ITRUN, TRUN } from "./boxes/TRUN";
import { IMDAT, MDAT } from "./boxes/MDAT";
import { ITFHD, TFHD } from "./boxes/TFHD";

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
        if (boxClass && boxClass.CHILDREN.length > 0) {
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

export const extractCaptions = (segment: ArrayBuffer): void => {
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

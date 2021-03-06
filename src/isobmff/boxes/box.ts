export const byteToString = (num: number): string => {
    let str = "";
    let temp = num;

    while (temp > 0) {
        const char = String.fromCharCode(temp & 0xFF);
        temp = temp >> 0x8;
        str += char;
    }
    return [...str].reverse().join("");
};

interface IBoxParser<T> {
    parse: (dv: DataView) => T;
}

class Box {
    public  static parse(dv: DataView ): IBox {
        return {
            size: dv.getUint32(0),
            type: byteToString(dv.getUint32(4)),
            getAbsoluteOffset: (): number => dv.byteOffset
        };
    }
}

class FullBox {
    public static parse(dv: DataView): IFullBox {
        const versionAndFlags = dv.getUint32(8);
        return {
            ...Box.parse(dv),
            version: (versionAndFlags >> 24) & 0xFF,
            flags: versionAndFlags & 0xFFFFFF,
        };
    }
}



interface IToString {
    toString: (detail: boolean) => string;
}

export interface IBox extends IToString {
    type: string;   // 32 bit unsigned
    size: number;   // 32 bit unsigned
    getAbsoluteOffset(): number;
}

export interface IFullBox extends IBox {
    version: number;    // 8 bit unsigned
    flags: number;      // 24 bit unsigned
}

const parse = <T>(parser: IBoxParser<T>) => (dv: DataView): T => {
    return parser.parse(dv);
};

export const parseFullBox = parse<IFullBox>(FullBox);

export const parseBox = parse<IBox>(Box);

export const getUint53 = (dv: DataView, offset: number): number => {
    let byteOffset = offset;
    const upper32 = dv.getUint32(byteOffset);
    byteOffset += 4;
    const lower32 = dv.getUint32(byteOffset);
    const upper21 = (upper32 & 0x1FFFFF);
    const total = (upper21 * Math.pow(2, 32)) + lower32;
    return total;
};

export const getInt53 = (dv: DataView, offset: number): number => {
    let byteOffset = offset;
    const upper32 = dv.getInt32(byteOffset);
    byteOffset += 4;
    const lower32 = dv.getInt32(byteOffset);

    if (upper32 === -1 && lower32 === -1) {
        return -1;
    }

    const upper21 = (upper32 & 0x1FFFFF);
    const total = (upper21 * Math.pow(2, 32)) + lower32;
    return total;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typeReplacer = (key: string, value: any): any => {
    if (key === "type") {
        return undefined;
    }
    return value;
};

export const stringifyBox = (box: IBox): string => {
    return JSON.stringify(box, typeReplacer, 2);
};



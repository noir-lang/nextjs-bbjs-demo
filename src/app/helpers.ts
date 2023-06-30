import {
    BarretenbergApiAsync,
    Crs,
    RawBuffer,
    newBarretenbergApiAsync,
} from "@aztec/bb.js/dest/browser";
import { main } from "./constants";
import { gunzipSync } from "zlib";

// Maximum we support.
const MAX_CIRCUIT_SIZE = 2 ** 19;
const RECURSION = true;

const CLOCK_EMOJIS = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];

export function getClock(index: number) {
    return CLOCK_EMOJIS[index % CLOCK_EMOJIS.length];
}

export function getBytecode() {
    const buffer = Buffer.from(main.bytecode, "base64");
    const decompressed = gunzipSync(buffer);
    return decompressed;
}

export async function computeCircuitSize(api: BarretenbergApiAsync) {
    const bytecode = getBytecode();
    const [exact, total, subgroup] = await api.acirGetCircuitSizes(
        new RawBuffer(bytecode)
    );
    return { exact, total, subgroup };
}

export function numToUInt32BE(n: number, bufferSize = 4) {
    const buf = new Uint8Array(bufferSize);
    new DataView(buf.buffer).setUint32(0, n, false);
    return buf;
}

function concatenateTypedArrays(a: any, b: any) {
    var result = new Uint8Array(a.byteLength + b.byteLength);
    result.set(new Uint8Array(a), 0);
    result.set(new Uint8Array(b), a.byteLength);
    return result;
}

async function getWitness(witnessPath: string) {
    const response = await fetch(witnessPath);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = new Uint8Array(await response.arrayBuffer());
    return concatenateTypedArrays(numToUInt32BE(data.length / 32), data);

}

export async function getGates(api: BarretenbergApiAsync) {
    const parsed = main;
    if (parsed.gates) {
        return +parsed.gates;
    }
    const { total } = await computeCircuitSize(api);
    const jsonData = main;
    jsonData.gates = total;
    return total;
}

async function init() {
    const api = await newBarretenbergApiAsync();

    const circuitSize = await getGates(api);
    const subgroupSize = Math.pow(2, Math.ceil(Math.log2(circuitSize)));
    if (subgroupSize > MAX_CIRCUIT_SIZE) {
        throw new Error(`Circuit size of ${subgroupSize} exceeds max supported of ${MAX_CIRCUIT_SIZE}`);
    }
    // Plus 1 needed! (Move +1 into Crs?)
    const crs = await Crs.new(subgroupSize + 1);

    // Important to init slab allocator as first thing, to ensure maximum memory efficiency.
    await api.commonInitSlabAllocator(subgroupSize);

    // Load CRS into wasm global CRS state.
    // TODO: Make RawBuffer be default behaviour, and have a specific Vector type for when wanting length prefixed.
    await api.srsInitSrs(new RawBuffer(crs.getG1Data()), crs.numPoints, new RawBuffer(crs.getG2Data()));

    const acirComposer = await api.acirNewAcirComposer(subgroupSize);
    return { api, acirComposer, circuitSize: subgroupSize };
}

async function initLite() {
    const api = await newBarretenbergApiAsync(1);

    // Plus 1 needed! (Move +1 into Crs?)
    const crs = await Crs.new(1);

    // Load CRS into wasm global CRS state.
    await api.srsInitSrs(new RawBuffer(crs.getG1Data()), crs.numPoints, new RawBuffer(crs.getG2Data()));

    const acirComposer = await api.acirNewAcirComposer(0);
    return { api, acirComposer };
}

export async function getProof() {
    const { api, acirComposer } = await init();
    try {
        const bytecode = getBytecode();
        const witness = await getWitness('/witness.tr');
        return await api.acirCreateProof(acirComposer, new RawBuffer(bytecode), new RawBuffer(witness), RECURSION);
    } finally {
        await api.destroy();
    }
}

export async function getVk() {
    const { api, acirComposer } = await init();
    try {
        const bytecode = getBytecode();
        await api.acirInitProvingKey(acirComposer, new RawBuffer(bytecode));
        return await api.acirGetVerificationKey(acirComposer);
    }
    finally {
        await api.destroy();
    }
}

export async function getVerification(proof: Uint8Array, vk: Uint8Array) {
    const { api, acirComposer } = await initLite();
    try {
        await api.acirLoadVerificationKey(acirComposer, new RawBuffer(vk));
        return await api.acirVerifyProof(acirComposer, proof, RECURSION);
    } finally {
        await api.destroy();
    }
}

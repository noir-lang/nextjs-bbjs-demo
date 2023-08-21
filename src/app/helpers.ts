import {
    BarretenbergApiAsync,
    Crs,
    RawBuffer,
} from "@aztec/bb.js/dest/browser";
import { main } from "./constants";
import { gunzipSync } from "zlib";
import { Ptr } from "@aztec/bb.js/dest/browser/types";


const MAX_CIRCUIT_SIZE = 2 ** 19;
const RECURSION = true;

const CLOCK_EMOJIS = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];

export async function sleep(timeout: number) {
    return new Promise((resolve: (_?: unknown) => void) => {
        setTimeout(() => resolve(), timeout);
    });
}

export async function init(api: BarretenbergApiAsync, circuitSize: number) {
    const subgroupSize = Math.pow(2, Math.ceil(Math.log2(circuitSize)));
    if (subgroupSize > MAX_CIRCUIT_SIZE) {
        throw new Error(`Circuit size of ${subgroupSize} exceeds max supported of ${MAX_CIRCUIT_SIZE}`);
    }
    console.log(`circuit size: ${circuitSize}`);
    console.log(`subgroup size: ${subgroupSize}`);
    console.log('loading crs...');
    const crs = await Crs.new(subgroupSize + 1);
    await api.commonInitSlabAllocator(subgroupSize);
    await api.srsInitSrs(new RawBuffer(crs.getG1Data()), crs.numPoints, new RawBuffer(crs.getG2Data()));
    const acirComposer = await api.acirNewAcirComposer(subgroupSize);
    console.log('done.')
    return { api, acirComposer, circuitSize: subgroupSize };
}

export function getClock(index: number) {
    return CLOCK_EMOJIS[index % CLOCK_EMOJIS.length];
}

export function getBytecode() {
    const buffer = Buffer.from(main.bytecode, "base64");
    const decompressed = gunzipSync(buffer);
    return decompressed;
}

export async function computeCircuitSize(api: BarretenbergApiAsync) {
    console.log(`computing circuit size...`);
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

export async function getProof(api: BarretenbergApiAsync, acirComposer: Ptr) {
    const bytecode = getBytecode();
    console.log(`getting witness...`);
    const witness = await getWitness('/witness.tr');
    console.log(`creating proof...`);
    const proof = await api.acirCreateProof(acirComposer, new RawBuffer(bytecode), new RawBuffer(witness), RECURSION);
    console.log(`done.`);
    console.log({ proof })
    return proof;
}

export async function getVerification(api: BarretenbergApiAsync, acirComposer: Ptr, proof: Uint8Array) {
    console.log(`verifying...`);
    const verification = await api.acirVerifyProof(acirComposer, proof, RECURSION);
    console.log(`done.`)
    console.log({ verification })
    return verification;
}

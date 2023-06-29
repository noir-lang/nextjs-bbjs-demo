"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { proxy } from "comlink";
import {
  createWorker,
  getRemoteBarretenbergWasm,
} from "@aztec/bb.js/dest/browser/barretenberg_wasm/browser/index";

import * as bbjs from "@aztec/bb.js/dest/browser";
import { BarretenbergApiAsync } from "@aztec/bb.js/dest/browser/factory";
import { Buffer32, Fr } from "@aztec/bb.js/dest/browser/types";
import { BarretenbergApiSync } from "@aztec/bb.js/dest/browser/barretenberg_api";
import { BarretenbergBinderSync } from "@aztec/bb.js/dest/browser/barretenberg_binder";

import styles from "./page.module.css";

const DEMO_INPUT = Buffer.from(
  "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789"
);

const TEST_BUFFER = new Uint8Array([
  0x44, 0xdd, 0xdb, 0x39, 0xbd, 0xb2, 0xaf, 0x80, 0xc1, 0x47, 0x89, 0x4c, 0x1d,
  0x75, 0x6a, 0xda, 0x3d, 0x1c, 0x2a, 0xc2, 0xb1, 0x00, 0x54, 0x1e, 0x04, 0xfe,
  0x87, 0xb4, 0xa5, 0x9e, 0x12, 0x43,
]);

function blake2sSync(api: BarretenbergApiSync) {
  const expected = Buffer32.fromBuffer(TEST_BUFFER);
  const result = api.blake2s(DEMO_INPUT);
  return { result, expected };
}

async function blake2sAsync(api: BarretenbergApiAsync) {
  const expected = Buffer32.fromBuffer(TEST_BUFFER);
  const result = await api.blake2s(DEMO_INPUT);
  return { result, expected };
}

function blake2FieldSync(api: BarretenbergApiSync) {
  const expected = Fr.fromBufferReduce(TEST_BUFFER);
  const result = api.blake2sToField(DEMO_INPUT);
  return { result, expected };
}

async function blake2FieldAsync(api: BarretenbergApiAsync) {
  const expected = Fr.fromBufferReduce(TEST_BUFFER);
  const result = await api.blake2sToField(DEMO_INPUT);
  return { result, expected };
}

export default function Home() {
  const [title, setTitle] = useState<string>("single thread");

  const [result, setResult] = useState<{
    result: Buffer32;
    expected: Buffer32;
  }>();

  const [fieldResult, setFieldResult] = useState<{
    result: Fr;
    expected: Fr;
  }>();

  useEffect(() => {
    const asyncRun = async () => {
      const NUM_THREADS = 2;
      const worker = createWorker();
      const wasm = getRemoteBarretenbergWasm(worker);
      // gets hanged here
      await wasm.init(
        NUM_THREADS,
        proxy(() => {})
      );
      const api = new BarretenbergApiAsync(worker, wasm);
      setResult(await blake2sAsync(api));
      setFieldResult(await blake2FieldAsync(api));
    };

    const syncRun = async () => {
      const bbWasm = await bbjs.BarretenbergWasm.new();
      const bbBinderSync = new BarretenbergBinderSync(bbWasm);
      const bbApi = new BarretenbergApiSync(bbBinderSync);
      setResult(blake2sSync(bbApi));
      setFieldResult(blake2FieldSync(bbApi));
    };

    (async function () {
      if (title === "single thread") {
        syncRun();
      } else {
        asyncRun();
      }
    })();
  }, [title]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            setTitle((prevTitle) =>
              prevTitle === "single thread" ? "multithread" : "single thread"
            );
            setResult(undefined);
            setFieldResult(undefined);
          }}
        >
          {title}
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        {result ? (
          <div>
            blake2s: {result.result.buffer}
            <br />
            expected: {result.expected.buffer}
            <br />
            match?:{" "}
            {result.result.buffer.toString() ===
            result.expected.buffer.toString()
              ? "TRUE"
              : "FALSE"}
          </div>
        ) : (
          "Loading..."
        )}
        <br />
        {fieldResult ? (
          <div>
            blake2sToField: {fieldResult.result.toString()}
            <br />
            expected: {fieldResult.expected.toString()}
            <br />
            match?:{" "}
            {fieldResult.expected.toString() === fieldResult.result.toString()
              ? "TRUE"
              : "FALSE"}
          </div>
        ) : (
          "Loading..."
        )}
      </div>
      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}

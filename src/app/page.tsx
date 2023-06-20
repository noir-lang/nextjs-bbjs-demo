"use client";

import Image from "next/image";
import styles from "./page.module.css";
// for some reason, importing newBarretenbergApiSync doesnt work
import { BarretenbergBinderSync } from "@aztec/bb.js/dest/barretenberg_binder";
import { BarretenbergApiSync } from "@aztec/bb.js/dest/barretenberg_api";
import * as bbjs from "@aztec/bb.js/dest/barretenberg_wasm";
import { useEffect, useState } from "react";
import { Buffer32, Fr } from "@aztec/bb.js/dest/types";
import { BarretenbergApiAsync } from "@aztec/bb.js";

const DEMO_STRING =
  "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";

function blake2sSync(api: BarretenbergApiSync) {
  const input = Buffer.from(DEMO_STRING);
  const expected = Buffer32.fromBuffer(
    new Uint8Array([
      0x44, 0xdd, 0xdb, 0x39, 0xbd, 0xb2, 0xaf, 0x80, 0xc1, 0x47, 0x89, 0x4c,
      0x1d, 0x75, 0x6a, 0xda, 0x3d, 0x1c, 0x2a, 0xc2, 0xb1, 0x00, 0x54, 0x1e,
      0x04, 0xfe, 0x87, 0xb4, 0xa5, 0x9e, 0x12, 0x43,
    ])
  );
  const result = api.blake2s(input);
  return { result, expected };
}

function blake2FieldSync(api: BarretenbergApiSync) {
  const input = Buffer.from(DEMO_STRING);
  const expected = Fr.fromBufferReduce(
    new Uint8Array([
      0x44, 0xdd, 0xdb, 0x39, 0xbd, 0xb2, 0xaf, 0x80, 0xc1, 0x47, 0x89, 0x4c,
      0x1d, 0x75, 0x6a, 0xda, 0x3d, 0x1c, 0x2a, 0xc2, 0xb1, 0x00, 0x54, 0x1e,
      0x04, 0xfe, 0x87, 0xb4, 0xa5, 0x9e, 0x12, 0x43,
    ])
  );
  const result = api.blake2sToField(input);
  return { result, expected };
}

// async function blake2sAsync(api: BarretenbergApiAsync) {
//   const input = Buffer.from(DEMO_STRING);
//   const expected = Buffer32.fromBuffer(
//     new Uint8Array([
//       0x44, 0xdd, 0xdb, 0x39, 0xbd, 0xb2, 0xaf, 0x80, 0xc1, 0x47, 0x89, 0x4c,
//       0x1d, 0x75, 0x6a, 0xda, 0x3d, 0x1c, 0x2a, 0xc2, 0xb1, 0x00, 0x54, 0x1e,
//       0x04, 0xfe, 0x87, 0xb4, 0xa5, 0x9e, 0x12, 0x43,
//     ])
//   );
//   const result = await api.blake2s(input);
//   return { result, expected };
// }

// async function blake2FieldAsync(api: BarretenbergApiAsync) {
//   const input = Buffer.from(DEMO_STRING);
//   const expected = Fr.fromBufferReduce(
//     new Uint8Array([
//       0x44, 0xdd, 0xdb, 0x39, 0xbd, 0xb2, 0xaf, 0x80, 0xc1, 0x47, 0x89, 0x4c,
//       0x1d, 0x75, 0x6a, 0xda, 0x3d, 0x1c, 0x2a, 0xc2, 0xb1, 0x00, 0x54, 0x1e,
//       0x04, 0xfe, 0x87, 0xb4, 0xa5, 0x9e, 0x12, 0x43,
//     ])
//   );
//   const result = await api.blake2sToField(input);
//   return { result, expected };
// }

export default function Home() {
  const [result, setResult] = useState<{
    result: Buffer32;
    expected: Buffer32;
  }>();

  const [fieldResult, setFieldResult] = useState<{
    result: Fr;
    expected: Fr;
  }>();

  useEffect(() => {
    (async function () {
      // for sync:
      const bbWasm = await bbjs.BarretenbergWasm.new();
      const bbBinderSync = new BarretenbergBinderSync(bbWasm);
      const bbApi = new BarretenbergApiSync(bbBinderSync);
      setResult(blake2sSync(bbApi));
      setFieldResult(blake2FieldSync(bbApi));

      // for async:
      // const threads = 1;
      // const { wasm, worker } = await bbjs.BarretenbergWasm.newWorker(threads);
      // const bbApi = new BarretenbergApiAsync(worker, wasm);
      // setResult(await blake2sAsync(bbApi));
      // setFieldResult(await blake2FieldAsync(bbApi));
    })();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
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
        {`blake2s ${DEMO_STRING}:`}
        <br />
        <br />
        {result ? (
          <div>
            blake2s: {result.result.buffer}
            <br />
            expected: {result.expected.buffer}
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

/**
bb verify -k vk -p proof
*/

import { useEffect, useState } from "react";
import { newBarretenbergApiAsync } from "@aztec/bb.js/dest/browser";
import {
  getGates,
  getVk,
  getProof,
  getVerification,
  getClock,
} from "./helpers";

const NUM_THREADS = 5;

export function Recursion() {
  const [gates, setGates] = useState<number | undefined>(undefined);
  const [proof, setProof] = useState<Uint8Array | undefined>(undefined);
  const [vk, setVk] = useState<Uint8Array | undefined>(undefined);
  const [processing, setProcessing] = useState<boolean>(true);
  const [verification, setVerification] = useState<boolean | undefined>(
    undefined
  );
  const [loader, setLoader] = useState<number>(0);

  useEffect(() => {
    (async function () {
      const api = await newBarretenbergApiAsync(NUM_THREADS);
      try {
        const _gates = await getGates(api);
        setGates(_gates);
        await api.destroy();
        const _proof = await getProof();
        console.log({ _proof });
        setProof(_proof);
        const _vk = await getVk();
        console.log({ _vk });
        setVk(_vk);
        const _verification = await getVerification(_proof, _vk);
        setVerification(_verification);
        console.log({ _verification });
      } finally {
        setProcessing(false);
      }
    })();

    setInterval(() => setLoader((prevLoader) => prevLoader + 1), 1000);
  }, []);
  return (
    <>
      <div
        style={{
          margin: "auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            marginBottom: "10px",
            fontSize: "18px",
            fontWeight: 600,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "self-end",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {processing ? (
            <>
              Processing...<div>{getClock(loader)}</div>
            </>
          ) : (
            <>
              {verification === true
                ? "Verification Succeeded :)"
                : "Verification Failed :("}
            </>
          )}
        </span>
        {verification !== undefined && <span></span>}
        {gates && <span>Gates: {gates}</span>}
        {proof && <span>Proof: [{proof.toString()?.slice(0, 50)}...]</span>}
        {vk && <span>Vk: [{vk?.toString().slice(0, 50)}...]</span>}
      </div>
    </>
  );
}

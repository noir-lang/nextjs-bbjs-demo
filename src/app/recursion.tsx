import { useEffect, useState } from "react";
import { newBarretenbergApiAsync } from "@aztec/bb.js/dest/browser";
import {
  getGates,
  getVk,
  getProof,
  getClock,
  getVerification,
} from "./helpers";
import styles from "./page.module.css";

const NUM_THREADS = 5;

export function Recursion() {
  const [gates, setGates] = useState<number | undefined>(undefined);
  const [proof, setProof] = useState<Uint8Array | undefined>(undefined);
  const [vk, setVk] = useState<Uint8Array | undefined>(undefined);
  const [processing, setProcessing] = useState<boolean>(true);
  const [verification, setVerification] = useState<boolean | undefined>(
    undefined
  );
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    (async function () {
      const intervalRef = setInterval(
        () => setSeconds((prevSeconds) => prevSeconds + 1),
        1000
      );
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
      } finally {
        setProcessing(false);
        clearInterval(intervalRef);
      }
    })();
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
              Processing...<div>{getClock(seconds)}</div>
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
        {gates && <span>{gates} gates</span>}
        {proof && <span>proof [{proof.toString()?.slice(0, 50)}...]</span>}
        {vk && <span>vk [{vk?.toString().slice(0, 50)}...]</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className={styles.grid}>made in valencia ❤️</div>
        <div>{processing ? <>{seconds}s</> : <>done in {seconds}s</>}</div>
      </div>
    </>
  );
}

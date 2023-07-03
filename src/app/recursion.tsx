import { useState } from "react";
import {
  BarretenbergApiAsync,
  newBarretenbergApiAsync,
} from "@aztec/bb.js/dest/browser";
import { init, getGates, getClock, getVerification, getProof } from "./helpers";
import styles from "./page.module.css";
import { Ptr } from "@aztec/bb.js/dest/browser/types";

const NUM_THREADS = 5;

enum LoadingPhase {
  NONE,
  API,
  PROOF,
  VERIFICATION,
}

interface InitalisedAPI {
  api: BarretenbergApiAsync;
  acirComposer: Ptr;
  circuitSize: number;
}

export function Recursion() {
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(
    LoadingPhase.NONE
  );
  const [initialisedAPI, setInitialisedAPI] = useState<
    InitalisedAPI | undefined
  >();
  const [proof, setProof] = useState<Uint8Array | undefined>(undefined);
  const [verification, setVerification] = useState<boolean | undefined>(
    undefined
  );
  const [seconds, setSeconds] = useState<number>(0);
  const [partialSeconds, setPartialSeconds] = useState<number>(0);

  async function initAPI() {
    const timerRef = startTimer();
    try {
      setLoadingPhase(LoadingPhase.API);
      const api = await newBarretenbergApiAsync(NUM_THREADS);
      const gates = await getGates(api);
      const _initalisedAPI = await init(api, gates);
      setInitialisedAPI(_initalisedAPI);
    } finally {
      setLoadingPhase(LoadingPhase.NONE);
      stopTimer(timerRef);
    }
  }

  async function loadProof() {
    if (!initialisedAPI) return;
    const timerRef = startTimer();
    try {
      setLoadingPhase(LoadingPhase.PROOF);
      const proof = await getProof(
        initialisedAPI?.api,
        initialisedAPI?.acirComposer
      );
      setProof(proof);
    } finally {
      setLoadingPhase(LoadingPhase.NONE);
      stopTimer(timerRef);
    }
  }

  async function loadVerification() {
    if (!initialisedAPI || !proof) return;
    const timerRef = startTimer();
    try {
      setLoadingPhase(LoadingPhase.VERIFICATION);
      const verification = await getVerification(
        initialisedAPI?.api,
        initialisedAPI?.acirComposer,
        proof
      );
      setVerification(verification);
    } finally {
      setLoadingPhase(LoadingPhase.NONE);
      stopTimer(timerRef);
    }
  }

  function startTimer() {
    setPartialSeconds(0);
    return setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      setPartialSeconds((prevSeconds) => prevSeconds + 1);
    }, 100);
  }

  function stopTimer(intervalRef: NodeJS.Timer) {
    clearInterval(intervalRef);
  }

  return (
    <>
      <div className={styles.recursionWrapper}>
        {!initialisedAPI && (
          <span className={styles.toptext}>
            <input
              type="button"
              className={styles.button}
              value={
                loadingPhase !== LoadingPhase.NONE
                  ? "initalising..."
                  : "init api"
              }
              onClick={initAPI}
              disabled={loadingPhase !== LoadingPhase.NONE}
            />
          </span>
        )}
        {initialisedAPI && (
          <div className={styles.actions}>
            <input
              type="button"
              className={styles.button}
              value={
                loadingPhase === LoadingPhase.PROOF
                  ? "proving..."
                  : `prove${proof ? " ✅" : ""}`
              }
              onClick={loadProof}
              disabled={loadingPhase !== LoadingPhase.NONE}
            />

            {proof && (
              <input
                type="button"
                className={styles.button}
                value={
                  loadingPhase === LoadingPhase.VERIFICATION
                    ? "verifying..."
                    : `verify${
                        verification
                          ? " ✅"
                          : verification === false
                          ? " ❌"
                          : ""
                      }`
                }
                onClick={loadVerification}
                disabled={loadingPhase !== LoadingPhase.NONE}
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.grid}>made in valencia ❤️</div>
        <div className={styles.timer}>
          total: {formatTime(seconds)}s {`//`} partial:{" "}
          {formatTime(partialSeconds)}s {`//`} {getClock(seconds)}
        </div>
      </div>
    </>
  );
}

const formatTime = (time: number) => {
  return (time / 10).toFixed(1);
};

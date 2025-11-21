import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const SYMBOLS = ['🍒', '🍎', '🍌', '🍋'];
const SYMBOL_HEIGHT = 120; // must match CSS .symbol height
const LOOPS = 20; // how many cycles before landing (creates long continuous scroll)

interface SlotMachineProps {
  onSpin: () => void;
  isSpinning: boolean;
  onOpenModal?: () => void;
}

export default function SlotMachine({ onSpin, isSpinning, onOpenModal }: SlotMachineProps) {
  const [finalIndices, setFinalIndices] = useState<number[]>([0, 0, 0]);
  const [landingShifts, setLandingShifts] = useState<number[]>([0, 0, 0]);
  const trackSymbols = Array.from({ length: LOOPS + 3 }).flatMap(() => SYMBOLS);
  const reelsRef = useRef<Array<HTMLDivElement | null>>([]);

  // When spin starts compute landing shifts for each reel (but don't declare final result yet)
  useEffect(() => {
    if (!isSpinning) return;

    const shifts = [0, 1, 2].map(() => {
      const finalIndex = Math.floor(Math.random() * SYMBOLS.length);
      return (SYMBOLS.length * LOOPS + finalIndex) * SYMBOL_HEIGHT;
    });
    setLandingShifts(shifts);
    // finalIndices will be set when each reel's animation actually ends
  }, [isSpinning]);

  const onReelAnimationEnd = (reelIndex: number) => {
    const totalShift = landingShifts[reelIndex] ?? 0;
    if (!totalShift) return;
    const computedIndex = Math.round((totalShift / SYMBOL_HEIGHT) % SYMBOLS.length);
    setFinalIndices((prev) => {
      const copy = [...prev];
      copy[reelIndex] = computedIndex;
      return copy;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.machine} data-final={finalIndices.join(',')}>
        <div className={styles.frame}>
          <div className={styles.reelsContainer}>
            {[0, 1, 2].map((reelIndex) => {
              const shift = landingShifts[reelIndex] ?? 0;
              const style: any = {};
              if (isSpinning) {
                style['--shift'] = `-${shift}px`;
                style['--delay'] = `${reelIndex}s`;
              } else {
                // keep final position visible after spin
                style.transform = `translateY(-${shift}px)`;
              }

              return (
                <div key={reelIndex} className={styles.reelWrapper}>
                  <div
                    ref={(el) => (reelsRef.current[reelIndex] = el)}
                    className={`${styles.reel} ${isSpinning ? styles.spinning : ''}`}
                    style={style}
                    onAnimationEnd={() => onReelAnimationEnd(reelIndex)}
                  >
                    {trackSymbols.map((symbol, idx) => (
                      <div key={idx} className={styles.symbol}>
                        {symbol}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className={styles.spinButton}
          onClick={() => {
            if (!isSpinning) onSpin();
          }}
          disabled={isSpinning}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5264 4 16.7792 5.17107 18.2454 7M20 12C20 16.4183 16.4183 20 12 20C9.47362 20 7.22075 18.8289 5.75463 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 3V7H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21V17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {onOpenModal && (
          <button className={styles.coinsButton} onClick={onOpenModal} aria-label="Open coins modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "25px", height: "25px" }}  >
  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>

          </button>
        )}
      </div>
    </div>
  );
}

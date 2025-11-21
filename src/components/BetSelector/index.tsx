import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

interface BetSelectorProps {
  selectedBet: number;
  onBetChange: (bet: number) => void;
}

const ALL_BETS = [1, 2, 5, 10, 15, 18, 20, 25, 30, 35, 40, 50, 75, 100, 150, 200, 300, 500];
const VISIBLE_COUNT = 7;

export default function BetSelector({ selectedBet, onBetChange }: BetSelectorProps) {
  // Infinite looping carousel using clones at both ends
  const CLONE_COUNT = VISIBLE_COUNT;
  const extendedBets = [
    ...ALL_BETS.slice(-CLONE_COUNT),
    ...ALL_BETS,
    ...ALL_BETS.slice(0, CLONE_COUNT),
  ];

  const initialIndex = CLONE_COUNT; // position that corresponds to ALL_BETS[0]
  const [index, setIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // measure item width
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const [itemWidth, setItemWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const w = firstItemRef.current?.offsetWidth ?? 0;
      const gap = 12;
      setItemWidth(w + gap);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const goTo = (i: number) => {
    setIndex(i);
    setIsTransitioning(true);
  };

  const handlePrev = () => goTo(index - 1);
  const handleNext = () => goTo(index + 1);

  const onTrackTransitionEnd = () => {
    setIsTransitioning(false);
    const L = ALL_BETS.length;
    if (index >= L + CLONE_COUNT) {
      setIndex(CLONE_COUNT);
    } else if (index < CLONE_COUNT) {
      setIndex(L + CLONE_COUNT - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Seleccione su apuesta</div>
      <div className={styles.selector}>
        <button
          className={styles.arrow}
          onClick={handlePrev}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.bets} style={{ width: itemWidth ? `${itemWidth * VISIBLE_COUNT}px` : undefined }}>
          <div
            className={styles.track}
            ref={trackRef}
            onTransitionEnd={onTrackTransitionEnd}
            style={{
              transform: `translateX(-${index * itemWidth}px)`,
              transition: isTransitioning ? undefined : 'none',
            }}
          >
            {extendedBets.map((bet, idx) => (
              <button
                key={`${bet}-${idx}`}
                ref={idx === initialIndex ? firstItemRef : undefined}
                className={`${styles.betButton} ${selectedBet === bet ? styles.selected : ''}`}
                onClick={() => onBetChange(bet)}
              >
                ${bet}
              </button>
            ))}
          </div>
        </div>

        <button
          className={styles.arrow}
          onClick={handleNext}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

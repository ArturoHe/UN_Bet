import { useState } from 'react';
import { useEffect } from "react";
import BetSelector from '../../components/BetSelector';
import BetModal from '../../components/BetModal';
import LeftPanel from '../../components/LeftPanel';
import styles from './styles.module.css';
import SlotMachine from '../../components/SlotMachine';

type Props = { title: string };

export default function SlotMachinePage({ title }: Props) {
  useEffect(() => {
      document.title = title;
    }, []);
  
  const [winnings, setWinnings] = useState(10000);
  const [balance, setBalance] = useState(10500);
  const [selectedBet, setSelectedBet] = useState(20);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpin = () => {
    // Start spinning: reels will start staggered (0s, +1s, +2s) and each spin ~7s
    // Total time until all reels finish = 2s delay + 7s duration = 9s
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 9000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}><LeftPanel winnings={winnings} balance={balance} /></div>
      
      <div className={styles.content}>
        <div className={styles.centerArea}>
          <SlotMachine onSpin={handleSpin} isSpinning={isSpinning} onOpenModal={() => setIsModalOpen(true)} />
        </div>
        <BetSelector
            selectedBet={selectedBet}
            onBetChange={setSelectedBet}
          />
      </div>

      <BetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBetSelect={setSelectedBet}
        selectedBet={selectedBet}
      />
    </div>
  );
}

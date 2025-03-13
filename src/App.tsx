import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const WORD_LENGTH = 5;

const Line = ({ guess }: LineProps) => {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    tiles.push(
      <div key={i} className="tile">
        {char}
      </div>,
    );
  }
  return <div className="line">{tiles}</div>;
};

type LineProps = {
  guess: string;
};

const App = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<Array<string | null>>(
    new Array(6).fill(null),
  );
  const [currGuess, setCurrentGuess] = useState<string>('');

  const getRandomWord = async () => {
    const res = await axios.get(
      'https://random-word-api.vercel.app/api?words=1&length=5',
    );
    setWord(res.data);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    setCurrentGuess(currGuess + e.key);
  };

  useEffect(() => {
    getRandomWord();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currGuess]);

  return (
    <div className="container">
      <div className="board">
        {guesses.map((guess, index) => {
          const isCurrGuess = index === guesses.findIndex(val => val == null);
          console.log('isCurrGuess', isCurrGuess);
          return (
            <Line key={index} guess={isCurrGuess ? currGuess : (guess ?? '')} />
          );
        })}
      </div>
    </div>
  );
};

export default App;

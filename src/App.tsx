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
        <h2 className="letter">{char && char.toUpperCase()}</h2>
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
  const [hasWon, setHasWon] = useState<boolean>(false);

  const getRandomWord = async () => {
    const res = await axios.get(
      'https://random-word-api.vercel.app/api?words=1&length=5',
    );
    setWord(res.data[0]);
  };

  const checkGuess = () => {
    if (currGuess === word) {
      setHasWon(true);
      return;
    } else {
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[newGuesses.findIndex(val => val == null)] = currGuess;
        return newGuesses;
      });
      setCurrentGuess('');
      console.log('Word:', word);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (hasWon) return;

    const isLetter = /^[a-zA-Z]$/.test(e.key);
    const isBackspace = e.key === 'Backspace';
    const isEnter = e.key === 'Enter';
    const isGuessComplete = currGuess.length === WORD_LENGTH;

    if (isLetter && !isGuessComplete) {
      setCurrentGuess(currGuess + e.key);
      return;
    }

    if (isBackspace) {
      setCurrentGuess(currGuess.slice(0, -1));
      return;
    }

    if (isEnter && isGuessComplete) {
      checkGuess();
    }
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currGuess]);

  return (
    <div className="container">
      <div className="board">
        {guesses.map((guess, index) => {
          const isCurrGuess = index === guesses.findIndex(val => val == null);
          return (
            <Line key={index} guess={isCurrGuess ? currGuess : (guess ?? '')} />
          );
        })}
      </div>
    </div>
  );
};

export default App;

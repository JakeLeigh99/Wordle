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

  const getRandomWord = async () => {
    const res = await axios.get(
      'https://random-word-api.vercel.app/api?words=1&length=5',
    );
    setWord(res.data[0]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // if key pressed is a letter
    if (/^[a-zA-Z]$/.test(e.key)) {
      if (currGuess.length !== WORD_LENGTH) setCurrentGuess(currGuess + e.key);
    } else {
      if (e.key === 'Backspace') {
        setCurrentGuess(currGuess.slice(0, -1));
        return;
      }
      if (currGuess.length === WORD_LENGTH && e.key === 'Enter') {
        console.log('check guess', currGuess, word);
        if (currGuess === word) {
          console.log('Correct guess');
          return;
        } else {
          setGuesses(prev => {
            const newGuesses = [...prev];
            newGuesses[newGuesses.findIndex(val => val == null)] = currGuess;
            return newGuesses;
          });
          setCurrentGuess('');
        }
        return;
      } else {
        console.log('Not enough letters');
      }
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

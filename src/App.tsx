import { useEffect, useState } from 'react';
import './App.css';
import { WORD_LENGTH } from './constants';
import words from './data/words.json';
import { Line } from './Line/Line';

const App = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<Array<string | null>>(
    new Array(6).fill(null),
  );
  const [currGuess, setCurrentGuess] = useState<string>('');
  const [hasWon, setHasWon] = useState<boolean>(false);

  const [gameMessage, setGameMessage] = useState('');

  const getRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  };

  const updateGuess = (message?: string) => {
    setGuesses(prev => {
      const newGuesses = [...prev];
      newGuesses[newGuesses.findIndex(val => val == null)] = currGuess;
      return newGuesses;
    });
    setCurrentGuess('');
    message && setGameMessage(message);
  };

  const checkGuess = () => {
    if (!words.includes(currGuess)) {
      setGameMessage('Not a real word!');
      setCurrentGuess('');
      return;
    }
    if (currGuess === word) {
      updateGuess('Well done!');
      setHasWon(true);
      return;
    } else {
      updateGuess();
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

    if (isEnter) {
      const actualGuesses = guesses.filter(guess => guess != null);
      if (actualGuesses.length === 5) {
        setGameMessage(`Game over! The word was: ${word}`);
        setHasWon(true);
        return;
      }
      if (isGuessComplete) {
        checkGuess();
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
        {gameMessage && <h1>{gameMessage}</h1>}
        {guesses.map((guess, index) => {
          const isCurrGuess = index === guesses.findIndex(val => val == null);
          return (
            <Line
              key={index}
              guess={isCurrGuess ? currGuess : (guess ?? '')}
              isFinal={!isCurrGuess && guess != null}
              word={word}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;

import { useEffect, useState } from 'react';
import './App.css';
import words from './data/words.json';

const WORD_LENGTH = 5;

type LETTER = {
  char: string | null;
  isInWord: boolean;
  isInCorrectPlace: boolean;
};

type GUESS = Array<LETTER>;

const Line = ({ guess }: LineProps) => {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i];
    tiles.push(
      <div key={i} className="tile">
        <h2 className="letter">{letter.char && letter.char.toUpperCase()}</h2>
      </div>,
    );
  }
  return <div className="line">{tiles}</div>;
};

type LineProps = {
  guess: GUESS;
};

const App = () => {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<GUESS[]>(
    new Array(6).fill(null).map(() =>
      new Array(5).fill(null).map(() => ({
        char: null,
        isInWord: false,
        isInCorrectPlace: false,
      })),
    ),
  );
  const [currGuess, setCurrentGuess] = useState<GUESS>(
    new Array(5).fill({
      char: null,
      isInWord: false,
      isInCorrectPlace: false,
    }),
  );
  const [hasWon, setHasWon] = useState<boolean>(false);

  const getRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  };

  const checkGuess = () => {
    const formattedGuess: GUESS = currGuess.map((letter, index) => ({
      char: letter.char,
      isInWord: word.includes(letter.char!),
      isInCorrectPlace: word[index] === letter.char,
    }));

    setGuesses(prev => {
      const newGuesses = [...prev];
      newGuesses[newGuesses.findIndex(val => val == null)] = formattedGuess;
      return newGuesses;
    });

    const isGuessCorrect = formattedGuess.every(
      ({ isInCorrectPlace }) => isInCorrectPlace,
    );

    if (isGuessCorrect) {
      setHasWon(true);
      return;
    } else {
      setCurrentGuess(
        new Array(5).fill({
          char: null,
          isInWord: false,
          isInCorrectPlace: false,
        }),
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (hasWon) return;

    const isLetter = /^[a-zA-Z]$/.test(e.key);
    const isBackspace = e.key === 'Backspace';
    const isEnter = e.key === 'Enter';
    const isGuessComplete = currGuess.every(guess => guess.char != null);

    if (isLetter && !isGuessComplete) {
      setCurrentGuess(prev =>
        prev.map((letter, index) =>
          letter.char === null &&
          index === prev.findIndex(val => val.char === null)
            ? { char: e.key, isInWord: false, isInCorrectPlace: false }
            : letter,
        ),
      );
      return;
    }

    if (isBackspace) {
      setCurrentGuess(prev =>
        prev.map((letter, index) =>
          index === prev.findIndex(val => val.char != null)
            ? { ...letter, char: null }
            : letter,
        ),
      );
      return;
    }

    if (isEnter && isGuessComplete) {
      checkGuess();
    }

    console.log('currGuess:', currGuess);
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
          // const isCurrGuess = index === guesses.findIndex(val => val == null);
          const isCurrGuess =
            index ===
            guesses
              .map(guess => guess.map(letter => letter.char))
              .findIndex(val => val.includes(null));
          return <Line key={index} guess={isCurrGuess ? currGuess : guess} />;
        })}
      </div>
    </div>
  );
};

export default App;

import { WORD_LENGTH } from '../constants';
import './Line.css';

const Line = ({ guess, word, isFinal }: LineProps) => {
  const tiles = [];
  let colour = '';

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    const isInWord = word.includes(char);
    const isInCorrectPlace = char === word[i];

    if (isFinal) {
      if (!isInWord) {
        colour = 'darkGrey';
      }
      if (isInCorrectPlace) {
        colour = 'green';
      }
      if (isInWord && !isInCorrectPlace) {
        colour = 'orange';
      }
    }
    tiles.push(
      <div key={i} className={`tile ${colour}`}>
        <h2 className="letter">{char && char.toUpperCase()}</h2>
      </div>,
    );
  }
  return <div className="line">{tiles}</div>;
};

type LineProps = {
  guess: string;
  word: string;
  isFinal: boolean;
};

export { Line };

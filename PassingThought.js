import React, { useState } from 'react';
import { generateId, getNewExpirationTime } from './utilities';

export function AddThoughtForm(props) {
  const [text, setText] = useState('');
  

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.length > 0) {
    const thought = {
      id: generateId(),
      text: text,
      expiresAt: getNewExpirationTime()
    };
    props.addThought(thought);
    setText('');
    };
  };

  return (
    <form className="AddThoughtForm">
      <input
        value={text}
        onChange={handleTextChange}
        onSubmit={handleSubmit}
        type="text"
        aria-label="What's on your mind?"
        placeholder="What's on your mind?"
      />
      <input type="submit" value="Add" />
    </form>
  );
}
App.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AddThoughtForm } from './AddThoughtForm';
import { Thought } from './Thought';
import { generateId, getNewExpirationTime } from './utilities';

function App() {
  const [thoughts, setThoughts] = useState([
    {
      id: generateId(),
      text: 'This is a place for your passing thoughts.',
      expiresAt: getNewExpirationTime(),
    },
    {
      id: generateId(),
      text: "They'll be removed after 15 seconds.",
      expiresAt: getNewExpirationTime(),
    },
  ]);

 const addThought = (thought) => {
    setThoughts((thoughts) => [thought, ...thoughts]);
  };

  const removeThought = (thoughtIdToRemove) => {
    setThoughts((thoughts) => thoughts.filter((thought) => 
       thought.id !== thought.thoughtIdToRemove
     ));
  }; 

  return (
    <div className="App">
      <header>
        <h1>Passing Thoughts</h1>
      </header>
      <main>
        <AddThoughtForm
        addThought={addThought}
         />
        <ul className="thoughts">
          {thoughts.map((thought) => (
            <Thought 
            key={thought.id} 
            thought={thought}
            removeThought={removeThought} />
          ))}
        </ul>
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
Thought.js
import React, {useEffect} from 'react';

export function Thought(props) {
  const { thought, removeThought } = props;

  const timeRemaining = thought.expiresAt - Date.now();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      removeThought(thought.id)
    }, timeRemaining );
    return () => {
      clearTimeout(timeoutId)
      };
  }, [thought])

  const handleRemoveClick = () => {
    removeThought(thought.id);
  };

  return (
    <li className="Thought">
      <button
        aria-label="Remove thought"
        className="remove-button"
        onClick={handleRemoveClick}
      >
        &times;
      </button>
      <div className="text">{thought.text}</div>
    </li>
  );
}
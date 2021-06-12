import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import "./EntityHighlighter.scss";

const StyledInput = styled.div`
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 14px;
  background: none;
  border: 1px solid;
  height: 166px;
  width: 756px;
  resize: auto;
  overflow: auto;
  border: 2px solid black;
  text-align: left;
`;

const colors = [
  { name: "blue", bg: "#0074d9" },
  { name: "navy", bg: "#001f3f" },
  { name: "lime", bg: "#01ff70" },
  { name: "teal", bg: "#39cccc" },
  { name: "olive", bg: "#3d9970" },
  { name: "fuchsia", bg: "#f012be" },
  { name: "red", bg: "#ff4136" },
  { name: "green", bg: "#2ecc40" },
  { name: "orange", bg: "#ff851b" },
  { name: "maroon", bg: "#85144b" },
  { name: "purple", bg: "#b10dc9" },
  { name: "yellow", bg: "#ffdc00" },
  { name: "aqua", bg: "#7fdbff" },
];

const EntityHighlighter = ({
  defaultText,
  defaultEntities,
  onChangeText,
  onChangeEntities,
}) => {
  const [text, setText] = useState("");
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [currentSelection, setCurrentSelection] = useState("");
  const [clickedWordLabel, setClickedWordLabel] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    const result = [];
    defaultEntities.map((entity) => result.push(entity.word));
    setHighlightedWords(result);

    document.addEventListener("select", selectionChangeHandler, false);
    document.addEventListener("click", selectionChangeHandler, false);
    document.addEventListener("keydown", selectionChangeHandler, false);

    return () => {
      document.removeEventListener("select", selectionChangeHandler);
      document.removeEventListener("click", selectionChangeHandler);
      document.removeEventListener("keydown", selectionChangeHandler);
    };
  }, [defaultEntities]);

  useEffect(() => {
    changeHighlighterColors();
  });

  const changeHighlighterColors = () => {
    if (highlightedWords.length > 0) {
      const highlightedClasses = document.getElementsByClassName(
        "hightlighted-word"
      );

      let entityObj = {};
      defaultEntities.map((entity) => {
        entityObj[entity.word] = entity.label;
      });

      Array.from(highlightedClasses).map((className) => {
        const text = className.innerHTML;
        let color = "";
        if(highlightedWords.includes(text)) {
          color =
            colors[hashString(entityObj[text]) % colors.length].bg + "4D";
        } else {
          color = "yellow";
        }
        className.style.backgroundColor = color;
      });
    }
  };

  const selectionChangeHandler = (event) => {
    const target = event.target;

    if (
      target.id === "editable-div" ||
      target.parentNode.id === "highlighter"
    ) {
      const selectedWord = window.getSelection().toString();
      if (selectedWord.length > 0) {
        setCurrentSelection(selectedWord);
      } else {
        setCurrentSelection("");
      }
    }
  };

  const hashString = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i += 1) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }

    return hash > 0 ? hash : -hash;
  };

  const deleteEntity = () => {
    const entities = [...defaultEntities];
    const deleted = entities.findIndex((e) => e.word === clickedWordLabel.word);
    entities.splice(deleted, 1);
    onChangeEntities(entities);

    const updatedHighlightedWords = highlightedWords.filter(
      (word) => word !== clickedWordLabel.word
    );
    setHighlightedWords(updatedHighlightedWords);
    setClickedWordLabel({word: "", label: ""});
  };

  const handleButtonClick = () => {
    const entities = [...defaultEntities];
    onChangeEntities(
      entities.concat({
        word: currentSelection,
        label: text,
      })
    );
    setCurrentSelection("");
    onChangeText(inputRef.current.innerText);
  };

  const handleClick = (e) => {
    if (highlightedWords.includes(e.target.innerText)) {
      const val = defaultEntities.filter(entity => e.target.innerText === entity.word)
      setClickedWordLabel(val[0]); 
    } else {
      setClickedWordLabel({word: "", label: ""});
    }
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <StyledInput id="editable-div" ref={inputRef} contentEditable onBlur={(e) => onChangeText(e.target.innerText)}>
          <Highlighter
            id="highlighter"
            highlightClassName="hightlighted-word"
            searchWords={[...highlightedWords, currentSelection]}
            autoEscape
            caseSensitive
            textToHighlight={defaultText}
            onClick={handleClick}
          />
        </StyledInput>
      </div>
      <br />
      {currentSelection && (
        <div>
          <div>Selected Word: {currentSelection}</div>
          <br />
          <input
            type="text"
            placeholder="Entity label"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={!currentSelection.length}
          />
          <button
            onClick={handleButtonClick}
            disabled={!currentSelection.length || text.length === 0}
          >
            Add Entity Label
          </button>
        </div>
      )}
      {!currentSelection.length && clickedWordLabel.word && (
        <div style={{ marginTop: 10 }}>
          <span>
            {clickedWordLabel.word}
            ({clickedWordLabel.label})
            <button
              style={{
                border: "0 none",
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
              onClick={deleteEntity}
            >
              <span role="img" aria-label="Delete">
                🗑️
              </span>
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default EntityHighlighter;

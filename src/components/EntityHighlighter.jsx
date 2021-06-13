import React, { useState, useEffect, useRef } from "react";
import Highlighter from "react-highlight-words";

import {
  StyledInput,
  StyledDeleteEntityDiv,
  StyledDeleteButton,
} from "./StyledComponents";
import { colors, hashString } from "../utils.js";
import "./EntityHighlighter.scss";

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

  /* 
    - will be executed first time and then whenever "defaultEntities" change
    - adds "eventlisteners" when component mounted
    - will remove "eventlisteners" when component unmounted 
  */
  useEffect(() => {
    const result = [];
    defaultEntities &&
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

  // will be called everytime
  useEffect(() => {
    changeHighlighterColors();
  });

  // function called to customize highlighter color for entities
  const changeHighlighterColors = () => {
    if (highlightedWords.length > 0) {
      const highlightedClasses = document.getElementsByClassName(
        "hightlighted-word"
      );

      let entityObj = {};
      defaultEntities.forEach((entity) => {
        entityObj[entity.word] = entity.label;
      });

      Array.from(highlightedClasses).forEach((className) => {
        const text = className.innerHTML;
        let color = "";
        if (highlightedWords.includes(text)) {
          color = colors[hashString(entityObj[text]) % colors.length].bg + "4D";
        } else {
          color = "yellow";
        }
        className.style.backgroundColor = color;
      });
    }
  };

  // callback for "click", "select", "keydown" events for document (text area)
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

    // onChangeText(inputRef.current.innerText);
  };

  // function to delete entity for existing entities
  const deleteEntity = () => {
    const entities = [...defaultEntities];
    const deleted = entities.findIndex((e) => e.word === clickedWordLabel.word);
    entities.splice(deleted, 1);
    onChangeEntities(entities);

    const updatedHighlightedWords = highlightedWords.filter(
      (word) => word !== clickedWordLabel.word
    );
    setHighlightedWords(updatedHighlightedWords);
    setClickedWordLabel({ word: "", label: "" });
  };

  // function to add new entities with labels and save text area changes on focus lost/blur
  const handleAddEntity = () => {
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

  // function called when highlighter text area clicked to show entity-label pair for deletion
  const handleClick = (e) => {
    if (highlightedWords.includes(e.target.innerText)) {
      const val = defaultEntities.filter(
        (entity) => e.target.innerText === entity.word
      );
      setClickedWordLabel(val[0]);
    } else {
      setClickedWordLabel({ word: "", label: "" });
    }
  };

  const handleBlur = (e) => {
    onChangeText(e.target.innerText);
  };

  return (
    <div>
      <span>Please click outside text area to save text changes</span>
      <div>
        <StyledInput
          data-testid="input"
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
        >
          {defaultText && (
            <Highlighter
              id="highlighter"
              data-testid="highlighter-test"
              highlightClassName="hightlighted-word"
              searchWords={[...highlightedWords, currentSelection]}
              autoEscape
              caseSensitive
              textToHighlight={defaultText}
              onClick={handleClick}
            />
          )}
        </StyledInput>
      </div>
      <br />
      {currentSelection && (
        <div>
          <div>Selected Word: {currentSelection}</div>
          <br />
          <input
            type="text"
            data-testid="input-field"
            placeholder="Entity label"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={!currentSelection.length}
          />
          <button
            onClick={handleAddEntity}
            disabled={!currentSelection.length || text.length === 0}
          >
            Add Entity Label
          </button>
        </div>
      )}
      {!currentSelection.length && clickedWordLabel.word && (
        <StyledDeleteEntityDiv>
          <span>
            {clickedWordLabel.word}({clickedWordLabel.label})
            <StyledDeleteButton onClick={deleteEntity}>
              <span role="img" aria-label="Delete">
                🗑️
              </span>
            </StyledDeleteButton>
          </span>
        </StyledDeleteEntityDiv>
      )}
    </div>
  );
};

export default EntityHighlighter;

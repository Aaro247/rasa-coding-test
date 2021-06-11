import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const StyledZeroPosHighlightText = styled.div`
  color: transparent;
  pointer-events: none;
  padding: 0px;
  white-space: pre-wrap;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 14px;
  text-align: left;
  position: absolute;
  top: 4px;
  left: 4px;
`;

const StyledInput = styled.textarea`
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 14px;
  background: none;
  border: 1px solid;
  width: 100%;
  resize: none;
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
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [text, setText] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    document.addEventListener("select", selectionChangeHandler, false);
    document.addEventListener("click", selectionChangeHandler, false);
    document.addEventListener("keydown", selectionChangeHandler, false);
    return () => {
      document.removeEventListener("select", selectionChangeHandler);
      document.removeEventListener("click", selectionChangeHandler);
      document.removeEventListener("keydown", selectionChangeHandler);
    };
  }, []);

  const selectionChangeHandler = (event) => {
    const target = event.target;

    if (target === inputRef.current) {
      setSelectionStart(inputRef.current.selectionStart);
      setSelectionEnd(inputRef.current.selectionEnd);
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

  const handleTextChange = (event) => {
    const text = event.target.value;
    const entities = [];

    // update the entity boudaries

    defaultEntities.forEach((oldEntity) => {
      const oldSelection = defaultText.substr(
        oldEntity.start,
        oldEntity.end - oldEntity.start
      );

      const findClosestStart = (lastMatch) => {
        if (lastMatch == null) {
          const index = text.indexOf(oldSelection);
          if (index === -1) {
            return index;
          }
          return findClosestStart(index);
        }
        const from = lastMatch + oldSelection.length;
        const index = text.indexOf(oldSelection, from);
        if (index === -1) {
          return lastMatch;
        }
        const prevDiff = Math.abs(oldEntity.start - lastMatch);
        const nextDiff = Math.abs(oldEntity.start - index);
        if (prevDiff < nextDiff) {
          return lastMatch;
        }
        return findClosestStart(index);
      }
      const start = findClosestStart();
      if (start === -1) {
        return;
      }

      entities.push({
        ...oldEntity,
        start,
        end: start + oldSelection.length,
      });
    });

    onChangeText(text);
    onChangeEntities(entities);
  };

  const findEntities = (index) => {
    return defaultEntities.filter((e) => e.start <= index && e.end > index);
  };

  const renderEntityHighlight = (text, entity, key) => {
    const start = text.substr(0, entity.start);
    const value = text.substr(entity.start, entity.end - entity.start);
    const end = text.substr(entity.end);
    const color = colors[hashString(entity.label) % colors.length].bg;
    return (
      <StyledZeroPosHighlightText key={key}>
        <span>{start}</span>
        <span style={{ opacity: 0.3, backgroundColor: color }}>{value}</span>
        <span>{end}</span>
      </StyledZeroPosHighlightText>
    );
  };

  const deleteEntity = (entity) => {
    const entities = defaultEntities;
    const deleted = entities.findIndex(
      (e) =>
        e.start === entity.start &&
        e.end === entity.end &&
        e.label === entity.label
    );
    entities.splice(deleted, 1);
    onChangeEntities(entities);
  };

  const handleButtonClick = () => {
    onChangeEntities(
      defaultEntities.concat({
        start: selectionStart,
        end: selectionEnd,
        label: text,
      })
    );
  };

  console.log(selectionStart);
  console.log(selectionEnd);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <StyledInput
          ref={inputRef}
          onChange={(event) => handleTextChange(event)}
          value={defaultText}
          rows={10}
        />
        {defaultEntities.map((entity, index) =>
          renderEntityHighlight(defaultText, entity, index)
        )}
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Entity label"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={selectionStart === selectionEnd}
        />
        <button
          onClick={handleButtonClick}
          disabled={selectionStart === selectionEnd}
        >
          Add entity for selection
        </button>
      </div>
      {selectionStart === selectionEnd &&
        findEntities(selectionStart).length > 0 && (
          <div style={{ marginTop: 10 }}>
            {findEntities(selectionStart).map((e, i) => (
              <span key={i}>
                {defaultText.substring(e.start, e.end)} ({e.label})
                <button
                  style={{
                    border: "0 none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => deleteEntity(e)}
                >
                  <span role="img" aria-label="Delete">
                    🗑️
                  </span>
                </button>
              </span>
            ))}
          </div>
        )}
    </div>
  );
};

export default EntityHighlighter;

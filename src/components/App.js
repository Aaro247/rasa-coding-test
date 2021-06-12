import React, { useState } from "react";
import styled from "styled-components";

import logo from "./rasa.svg";
import EntityHighlighter from "./EntityHighlighter";

const StyledApp = styled.div`
  text-align: center;
  padding: 2em;
  width: 60%;
  margin: 0 auto;
  color: black;
  max-width: 750px;
  min-width: 250px;
`;

const StyledLogo = styled.img`
  height: 5vmin;
`;

const App = () => {
  const defautText =
    "Venture first mover advantage learning curve market ecosystem funding stealth disruptive social proof scrum project growth hacking niche market user experience graphical user interface.";
  const defaultEntities = [
    { word: "first mover advantage", label: "very important" },
    { word: "funding", label: "very important" },
    { word: "growth hacking", label: "important" },
    { word: "user experience", label: "nonsense" },
    { word: "graphical user interface", label: "nonsense" },
  ];

  const [text, setText] = useState(defautText);
  const [entities, setEntities] = useState(defaultEntities);

  return (
    <StyledApp>
      <header>
        <StyledLogo src={logo} alt="Rasa" />
        <h1>Entity Highlighting</h1>
      </header>
      <section>
        <p>
          Rasa is writing a new natural language classifier to sort useful
          concepts in tech from meaningless jargon{" "}
          <span role="img" aria-label="Hell yeah">
            💯
          </span>
          . You are writing the interface to help us train the classifier! One
          of the important parts of the interface is what we call the
          EntityHighlighter, which allows the user to highlight and identify
          parts of a string. Try clicking existing highlights, or adding some of
          your own by selecting some text and filling the form.
        </p>
        <p>
          However, the code is in a bit of a mess and a nightmare to maintain -{" "}
          <span role="img" aria-label="Oh no">
            😱
          </span>{" "}
          everyone is afraid of touching it! Your task is to refactor{" "}
          <code>EntityHighlighter.js</code> and fix any bugs you find.
        </p>
      </section>
      <section>
        <EntityHighlighter
          defaultText={text}
          defaultEntities={entities}
          onChangeText={setText}
          onChangeEntities={setEntities}
        />
      </section>
    </StyledApp>
  );
};

export default App;

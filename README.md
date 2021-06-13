![Rasa](/src/components/rasa.svg)

# Rasa Frontend Take Home Task

Clone this repo, run `npm install` and start the project using `npm start`. 
The instructions for completing the task can be found in the site that will launch.

------------------------------------------------------------

**Functionality changes / Bug fixes made**
1) Text area (editable div) made resizable.
2) The default text can be edited and saved by losing focus or bluring the text area.
3) Selected word will be highlighted (yellow) along with its other occurrences.
4) Option to enter label will be shown only when word(entity) is selected.
5) "Add Entity Label" button will be enabled only when label text present.
6) All occurrences of entity will be removed from entity list (unhighlighted) once deleted.

*Code level changes*
1) React hooks implemented instead of classes.
2) Styled Components used for CSS-in-JS.
3) "react-highlight-word" package installed from npm for highlighting entities.
4) "node-sass" package installed for SCSS.
5) Updated "react" and "react-dom" packages to the latest 17.0.2 to support JSX file extension.

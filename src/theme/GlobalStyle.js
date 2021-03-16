import { createGlobalStyle } from "styled-components";

let mainColor = "white";
let secondaryColor = "#19A2FF"; // #19A2FF Close enough
let extraColor = "black";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${mainColor};
    color: ${extraColor};
    font-family: Helvetica, Sans-Serif, Open-Sans;
    transition: all 0.5s linear;
  }

  nav {
    background: ${secondaryColor};
    color: ${secondaryColor};
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  a {
    color: #19a2ff;
    cursor: pointer;
  }

  button {
    border: 0;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    background-color: ${secondaryColor};
    color: ${mainColor};
    font-family: Helvetica, Sans-Serif, Open-Sans;
  }

  button.btn {
    // Bootstrap button styles can be overwritten here. Try changing the variant of the button first!
    // Might need to use !important
  }
  
  button:disabled {
    cursor: default;
  }

  div .sideBar {
    border: 2px ${secondaryColor} solid;
  }

  div .fileDisplay {
    border: ${extraColor} solid 2px;
  }

  div .pageContainer {
    width: 100%;
    border: ${secondaryColor} 2px solid;
    padding: 8px;
    display: flex;
    flex-flow: row;
    min-height: 85vh;
  }

  div .pageContent {
    border: ${secondaryColor} 2px solid;
    padding: 4px;
    display: flex;
    flex-grow: 100;
    min-height: 85vh;
  }

  div .containerFooter {
    bottom: 4px;
    display: flex;
    margin: 8px;
    flex-direction: row-reverse;
  }
`;

export default GlobalStyle
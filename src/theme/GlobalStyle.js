import { createGlobalStyle } from "styled-components";
import Background from "../images/logs.jpg";

// The sites main colors. As many elements should be affected by these as possible.
// Avoid using the RGB variables if possible. Box shadow needs opacity and therefore needs RGB values.
let mainColor = "white";
let mainColorRgb = "255 255 255";
let secondaryColor = "#4E3E22"; // #007AFD old blue color, #302718 old brown color
let secondaryColorRgb = "78 62 34";
let extraColor = "black";
let extraColorRgb = "0 0 0";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${mainColor};
    background: url(${Background}) no-repeat fixed;
    background-size: 100%;
    color: ${extraColor};
    font-family: Helvetica, Sans-Serif, Open-Sans;
    transition: all 0.5s linear;
  }

  div.App {
    background: ${mainColor};
    padding: 1rem;
    min-height: 100vh;
  }

  nav {
    background: ${secondaryColor};
    color: ${secondaryColor};
    margin-bottom: 1rem;
  }

  a {
    cursor: pointer;
  }

  button {
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    background-color: ${secondaryColor};
    color: ${mainColor};
    font-family: Helvetica, Sans-Serif, Open-Sans;
  }

  button.btn {

  }

  button.btn:focus {
    // Bootstrap button styles can be overwritten here. Try changing the variant of the button first!
    // Might need to use !important
    box-shadow: 0 0 0.1rem 0.2rem rgb(${secondaryColorRgb} / 25%);
  }

  button:disabled {
    cursor: default;
  }

  .form-control:focus {
    border-color: ${secondaryColor};
    box-shadow: 0 0 0.1rem 0.2rem rgb(${secondaryColorRgb} / 25%);
  }

  div.sideBar {
    border: 2px ${secondaryColor} solid;
  }

  div.fileDisplay {
    border: ${extraColor} solid 2px;
    color: ${extraColor};
  }

  div.fileDisplay:hover {
    box-shadow: 0 0 0.1rem 0.2rem rgb(${secondaryColorRgb} / 25%);
  }

  a.fileDisplayLink:hover {
    text-decoration: none;
  }

  div.pageContainer {
    width: 100%;
    border: ${secondaryColor} 2px solid;
    padding: 8px;
    display: flex;
    flex-flow: row;
    min-height: 85vh;
  }

  div.pageContent {
    border: ${secondaryColor} 2px solid;
    padding: 4px;
    display: flex;
    flex-grow: 100;
    min-height: 85vh;
  }

  div.containerFooter {
    bottom: 4px;
    display: flex;
    margin: 8px;
    flex-direction: row-reverse;
    position: sticky;
  }
`;

export default GlobalStyle
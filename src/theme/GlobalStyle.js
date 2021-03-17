import { createGlobalStyle } from "styled-components";
import Background from "../images/logs.jpg";

// The sites main colors. As many elements should be affected by these as possible.
// Avoid using the RGB variables if possible. Box shadow needs opacity and therefore needs RGB values.
let mainColor = "white";
let mainColorRgb = "255 255 255";
let secondaryColor = "#302718"; // #007AFD old color
let secondaryColorRgb = "48 39 24";
let extraColor = "black";
let extraColorRgb = "0 0 0";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${mainColor};
    background-image: url(${Background});
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
    color: blue;
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
  
  button.insetFocus:focus {
    // Bootstrap button styles can be overwritten here. Try changing the variant of the button first!
    // Might need to use !important
    box-shadow: inset 0 0 0.5rem 0.2rem rgb(${secondaryColorRgb} / 25%);
  }
  
  button:disabled {
    cursor: default;
  }
  
  .form-control:focus {
    border-color: ${secondaryColor};
    box-shadow: 0 0 0 0.2rem rgb(${secondaryColorRgb} / 25%);
  }

  div.sideBar {
    border: 2px ${secondaryColor} solid;
  }

  div.fileDisplay {
    border: ${extraColor} solid 2px;
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
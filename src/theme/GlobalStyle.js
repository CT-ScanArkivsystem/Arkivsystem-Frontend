import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background: #ffffff;
    color: #000000;
    font-family: Helvetica, Sans-Serif, Open-Sans;
    transition: all 0.50s linear;
  }

  a {
    color: blue;
    cursor: pointer;
  }

  button {
    border: 0;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    background-color: #007afd;
    color: #ffffff;
    font-family: Helvetica, Sans-Serif, Open-Sans;
  }

  button:disabled {
    cursor: default;
  }

  button.btn {
    background-color: #007afd;
    color: white;
  }

  div .pageContainer {
    width: 100%;
    border: #007afd 2px solid;
    padding: 8px;
    display: flex;
    flex-flow: row;
    min-height: 85vh;
  }
`;

export default GlobalStyle
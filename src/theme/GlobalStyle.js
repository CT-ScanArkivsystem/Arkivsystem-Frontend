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

  button.btn {
    background-color: #007afd;
    color: white;
  }
`;

export default GlobalStyle
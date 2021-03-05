import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background: #ffffff;
    color: #000000;
    font-family: Open-Sans;
    transition: all 0.50s linear;
  }

  a {
    color: blue;
    cursor: pointer;
  }

  button {
    border: 0;
    display: inline-block;
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 5px;
    cursor: pointer;
    background-color: #1064EA;
    color: #FFFFFF;
    font-family: Open-Sans;
  }

  button.btn {
    background-color: blue;
    color: white;
  }
`;

export default GlobalStyle
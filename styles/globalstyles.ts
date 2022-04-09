import { createGlobalStyle } from "styled-components"
import { breakpoints } from "../styles/breakpoints"

export const GlobalStyles = createGlobalStyle`

/* #003594 */

:root {
  --primary: #1b262c;
  --secondary: #869397;
  --tertiary: #041E42;
  --cuatro: #0085a3;
  --cinco: #5661ff;
  --seis: #d38558;
  --transparent-light: rgba(0,0,0,0);
  --transparent-dark: rgba(0,0,0,.4);
  --white: #fff;
  --wrapper-width: 1015px;
  --wrapper-width-narrow: 400px;
  --font-primary: monospace, sans-serif;
  --font-secondary: 'Bebas Neue', cursive;
}

  * {
    box-sizing: border-box;
    font-family: monospace, sans-serif;  
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: 1rem;

    @media ${breakpoints.xs} {
      font-size: 2rem;
    }
    @media ${breakpoints.sm} {
      font-size: 2.75rem;
    }
  }

  h1,h2,h3,h4,h5,h6,button {
    font-family: var(--font-secondary);
    margin: 0;
    padding: 0;
    //border: 1px solid hotpink;
  }

  p {
    font-size: 0.7rem;
    @media ${breakpoints.sm} {
      font-size: .8rem;
    }
  }

  /* Links */

  a {
    text-decoration: none;
  }



  /* End Links */

  ul{
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
  }

  li{
    list-style: none;
  }


  hr {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 3px solid var(--primary);
    color: orangered;
    border-radius: 8px;
  }

`

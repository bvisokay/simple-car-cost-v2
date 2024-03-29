import { createGlobalStyle } from "styled-components"
import { breakpoints } from "../styles/breakpoints"

export const GlobalStyles = createGlobalStyle`

/* Colors from Bootstrap */

:root {
  --blue: #007bff;
  --alt-blue: #007bff95;
  --indigo: #6610f2;
  --alt-indigo: #6610f295;
  --purple: #6f42c1;
  --alt-purple: #6f42c195;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --alt-teal: #20c99795;
  --cyan: #17a2b8;
  --alt-cyan: #17a2b895;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --alt-primary: #007bff90;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #212529;
  --wrapper-width: 1015px;
  --wrapper-width-narrow: 600px;
  --wrapper-width-very-narrow: 400px;
  /* --font-primary: monospace, sans-serif; */
  --font-primary: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  --font-secondary: 'Oswald', sans-serif;
  --roundness: .3875rem;
  --box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  --border-width: 2px;
}

  * {
    box-sizing: border-box;
    font-family: var(--font-primary);  
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: linear-gradient(white, whitesmoke);
    //background-size: cover;
    //background-repeat: no-repeat;
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

  h1,h2,h3,h4,h5,h6 {
    font-family: var(--font-secondary);
    margin: 0;
    padding: 0;
    //border: 1px solid hotpink;
    font-weight: 400;
  }

  h2 {
    transform-origin: top left;
    font-weight: 600;
    font-size: 1.5rem;

    @media ${breakpoints.xs} {
      font-size: 1.875rem;
    }
    @media ${breakpoints.md} {
      font-size: 2rem;
    }
  }

  p {
    font-weight: 100;
    color: var(--gray);
    line-height: 1.25;
    font-size: .75rem;
    letter-spacing: -.2px;

    @media ${breakpoints.xs} {
      font-size: .875rem;
    }
    @media ${breakpoints.md} {
      font-size: 1.15rem;
    }
  }

  p.small {
    font-family: var(--font-primary);
    font-size: 0.675rem;
    color: gray;

    @media ${breakpoints.sm} {
      font-size: 0.875rem;
    }
  }


  /* Links */

  a {
    text-decoration: none;
    color: var(--primary);

    :hover {
      text-decoration: underline;
    }

    :visited {
      color: var(--indigo);
    }
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
    border-bottom: var(--border-width) solid var(--primary);
    color: orangered;
    border-radius: var(--roundness);
  }

  .white {
    color: #fff;
  }

  .liveValidateMessage {
  font-size: .75rem;
  top: .1rem;
  position: absolute;
  z-index: 1;
  padding-top: 7px;
  padding-bottom: 20px;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  background: #ffd7d4;
  border-top-left-radius: var(--roundness);
  border-top-right-radius: var(--roundness);
  color: crimson;
}

.liveValidateMessage--visible {
  opacity: 1;
  transform: translateY(0);
}

.liveValidateMessage-enter {
  opacity: 0;
  transform: translateY(100%);
}

.liveValidateMessage-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: 0.33s opacity ease-in-out, 0.33s transform ease-in-out;
}

.liveValidateMessage-exit {
  opacity: 1;
  transform: translateY(0);
}

.liveValidateMessage-exit-active {
  opacity: 0;
  transform: translateY(100%);
  transition: 0.33s opacity ease-in-out, 0.33s transform ease-in-out;
}

/* Flash Messaging  */

.floating-alert {
  display: none;
  position: absolute;
  z-index: 999;
  /* top: 38px; */
  top: 9rem;
  left: 50%;
  transform: translateX(-50%);
  -moz-animation: floatingAlert ease-in 5s forwards;
  -webkit-animation: floatingAlert ease-in 5s forwards;
  -o-animation: floatingAlert ease-in 5s forwards;
  animation: floatingAlert ease-in 5s forwards;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  background-color: var(--orange);
  border: var(--border-width) solid var(--yellow);
  border-radius: var(--roundness);
  padding: .5rem 1rem;
  color: white;
  font-weight: bold;
}

.floating-alerts .floating-alert:last-of-type {
  display: block;
}

@keyframes floatingAlert {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }

  9% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  91% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  100% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }
}

@-webkit-keyframes floatingAlert {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }

  9% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  91% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  100% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }
}


/* End Flash Messaging  */

`

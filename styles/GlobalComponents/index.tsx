import styled from "styled-components"
//import { breakpoints } from "../breakpoints"

export const Wrapper = styled.div`
  max-width: var(--wrapper-width);
  margin: 0 auto;
`
export const Display = styled.h2`
  font-size: 3rem;
`

export const LeadMuted = styled.p`
  font-size: 1.25rem;
  color: #6c757d;
  font-weight: 300;
`

type ColorProps = {
  color?: string
}

export const Btn = styled.button<ColorProps>`
  cursor: pointer;
  background-color: ${props => (props.color ? `${props.color}` : "var(--primary)")};
  border: 1px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.2rem;
  margin: 0.2rem;
  padding: 0.25rem 0.5rem;
  color: #fff;
  font-size: 1rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-family-sans-serif);

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: 2px solid #999;
    color: #555;
  }

  :focus {
    outline: 2px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
  }
`

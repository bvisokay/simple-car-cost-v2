import styled from "styled-components"
import { breakpoints } from "../breakpoints"

/* Used for Btn and SectionTitle */
type ColorProps = {
  color?: string
}

export const Wrapper = styled.div`
  max-width: var(--wrapper-width-narrow);
  margin: 0 auto;
`

export const WrapperNarrow = styled.div`
  max-width: var(--wrapper-width-narrow);
  margin: 0 auto;
`

export const Display = styled.h2`
  line-height: 1.1;
  font-size: 2rem;
  padding-top: 1rem;
  text-align: center;

  @media ${breakpoints.md} {
    padding-top: 2rem;
    font-size: 2.75rem;
  }
`

export const SectionTitle = styled.h2<ColorProps>`
  font-weight: 700;
  margin: 0.5rem 0;
  color: ${props => (props.color ? `${props.color}` : "var(--dark)")};
  text-align: center;
  font-family: var(--font-family-monospace);
  letter-spacing: -1.5px;
  text-transform: uppercase;
`

export const LeadMuted = styled.p`
  font-size: 1.25rem;
  color: #6c757d;
  font-weight: 300;
  text-align: center;
  margin: 2rem auto;

  @media ${breakpoints.md} {
    max-width: 500px;
  }
`

export const Btn = styled.button<ColorProps>`
  cursor: pointer;
  background-color: ${props => (props.color ? `${props.color}` : "var(--primary)")};
  border: 1px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.2rem;
  margin: 0.2rem;
  padding: 0.25rem 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-family-sans-serif);

  @media ${breakpoints.md} {
    font-size: 1rem;
  }

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: 2px solid #999;
    color: #555;
  }

  :focus {
    outline: 2px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
    box-shadow: 0 0 0 0.1rem ${props => (props.color ? `${props.color}` : "var(--primary)")};
  }
`

export const BtnWide = styled.button<ColorProps>`
  width: 100%;
  cursor: pointer;
  background-color: ${props => (props.color ? `${props.color}` : "var(--primary)")};
  border: 1px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  margin: 1rem 0;
  padding: 0.5rem 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-family-sans-serif);

  @media ${breakpoints.md} {
    font-size: 1rem;
  }

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: 2px solid #999;
    color: #555;
  }

  :focus {
    outline: 2px solid ${props => (props.color ? `${props.color}` : "var(--primary)")};
    box-shadow: 0 0 0 0.1rem ${props => (props.color ? `${props.color}` : "var(--primary)")};
  }
`

export const FormControl = styled.div`
  //border: 1px solid var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem auto;
  padding: 0.35rem 0.25rem;
  color: var(--primary);
  font-weight: bold;
  position: relative;
  z-index: 2;

  input {
    padding: 0.6rem 0.5rem;
  }

  label {
    font-size: 1rem;
    padding: 0;
    color: var(--primary);
  }

  textarea {
    line-height: 1.75;
    resize: none;
  }

  select {
    padding: 0.75rem 0;
  }

  input,
  textarea,
  select {
    margin-top: 0.5rem;
    min-width: 160px;
    width: 100%;
    position: relative;
    z-index: 2;
    border-radius: 0.5rem;
    border: 2px solid var(--secondary);

    @media ${breakpoints.sm} {
      min-width: 275px;
    }

    :focus {
      outline: 1px solid var(--secondary);
    }
    :active {
      outline: 1px solid var(--secondary);
    }
  }
`

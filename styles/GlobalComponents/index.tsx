import styled from "styled-components"
import { breakpoints } from "../breakpoints"

/* Used for Btn and SectionTitle */
type ColorProps = {
  color?: string
  bgColor?: string
  hoverColor?: string
  hoverBg?: string
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
  padding: 1.25rem 0;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;

  @media ${breakpoints.xs} {
    padding-top: 1.65rem;
    font-size: 2.75rem;
  }

  @media ${breakpoints.md} {
    padding-top: 2rem;
    font-size: 2.75rem;
  }
`

export const Section = styled.div`
  margin: 1rem auto;
`

export const SectionNarrow = styled.section`
  padding: 1rem;
  margin: 0.5rem auto;
  width: 100%;
  max-width: var(--wrapper-width-narrow);
  border: var(--border-width) solid var(--tertiary);
  //background: var(--transparent-dark);
  border-radius: var(--roundness);
`

export const SectionVeryNarrow = styled.section`
  padding: 1rem;
  margin: 0.5rem auto;
  width: 100%;
  max-width: var(--wrapper-width-very-narrow);
  border: var(--border-width) solid var(--tertiary);
  //background: var(--transparent-dark);
  border-radius: var(--roundness);
`

export const SectionTitle = styled.h2<ColorProps>`
  font-weight: 700;
  margin: 0.5rem 0;
  color: ${props => (props.color ? `${props.color}` : "var(--dark)")};
  text-align: center;
  font-family: var(--font-primary);
  letter-spacing: -1.5px;
  text-transform: uppercase;
  padding: 1.25rem 0;
`

export const LeadMuted = styled.p`
  margin: 1.25rem auto 3rem auto;
  font-size: 0.775rem;
  color: #6c757d;
  font-weight: 300;
  text-align: center;

  @media ${breakpoints.xs} {
    max-width: 600px;
    font-size: 1rem;
  }

  @media ${breakpoints.md} {
    max-width: 600px;
    font-size: 1.25rem;
  }
`

export const Btn = styled.button<ColorProps>`
  cursor: pointer;
  background-color: ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  border: var(--border-width) solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  box-shadow: var(--box-shadow);
  border-radius: var(--roundness);
  font-weight: 500;
  margin: 0.15rem;
  padding: 0.1rem 0.1rem;
  font-size: 0.5rem;
  color: #fff;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-primary);

  @media ${breakpoints.xs} {
    margin: 0.15rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.25rem;
  }

  @media ${breakpoints.md} {
    font-size: 0.875rem;
  }

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: var(--border-width) solid #999;
    color: #555;
  }

  :focus {
    outline: var(--border-width) solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
    box-shadow: 0 0 0 0.1rem ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  }

  :hover {
    background-color: ${props => (props.hoverBg ? `${props.hoverBg}` : props.bgColor ? `${props.bgColor}` : "var(--alt-primary)")};
    color: ${props => (props.hoverColor ? `${props.hoverColor}` : "var(--white)")};
    border: var(--border-width) solid ${props => (props.hoverBg ? `${props.hoverBg}` : `var(--alt-primary)`)};
  }
`

export const BtnWide = styled.button<ColorProps>`
  width: 100%;
  cursor: pointer;
  background-color: ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  border: var(--border-width) solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  box-shadow: var(--box-shadow);
  border-radius: var(--roundness);
  margin: 1rem 0;
  padding: 0.4rem 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media ${breakpoints.md} {
    font-size: 1.25rem;
  }

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: var(--border-width) solid #999;
    color: #555;
  }

  :focus {
    outline: 2px solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
    box-shadow: 0 0 0 0.1rem ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  }

  // hover color should default to white and pass in a non-white-color
  :hover {
    background-color: ${props => (props.hoverBg ? `${props.hoverBg}` : "transparent")};
    color: ${props => (props.hoverColor ? `${props.hoverColor}` : props.bgColor ? `${props.bgColor}` : "var(--primary)")};
    var(--border-width) solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  }
`

export const FormControl = styled.div`
  //border: 1px solid var(--secondary);
  border-radius: var(--roundness);
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
    font-size: 0.675rem;
    padding: 0;
    color: var(--primary);

    @media ${breakpoints.xs} {
      font-size: 0.875rem;
    }

    @media ${breakpoints.md} {
      font-size: 1rem;
    }
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
    border-radius: var(--roundness);
    border: var(--border-width) solid var(--secondary);

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

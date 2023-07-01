/**
 * Defines the Virtual DOM tree node types
 * Text: for empty or value based nodes
 * Element: Most HTML nodes (div, p, button, ul, etc.)
 * Fragment: Empty tags <></> used to house other elements within it
 */
export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

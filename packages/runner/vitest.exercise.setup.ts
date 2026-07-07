// Registers @testing-library/jest-dom matchers (toHaveTextContent, toHaveClass,
// toBeInTheDocument, ...) on vitest's expect for exercises that reuse the
// original Hexlet DOM tests. Resolved from the repo, so its bare imports work
// even though exercise tests run from a temp dir.
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

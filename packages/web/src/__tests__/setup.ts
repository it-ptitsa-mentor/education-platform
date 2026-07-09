// Extends vitest's expect with @testing-library/jest-dom matchers
// (toBeInTheDocument, toHaveClass, etc.)
import "@testing-library/jest-dom/vitest";

// Automatic cleanup after each test (required when not using vitest globals)
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);

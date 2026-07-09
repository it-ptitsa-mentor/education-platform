// Registers @testing-library/jest-dom matchers (toHaveTextContent, toHaveClass,
// toBeInTheDocument, ...) on vitest's expect for exercises that reuse the
// original Hexlet DOM tests. Resolved from the repo, so its bare imports work
// even though exercise tests run from a temp dir.
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

// Under jsdom, AbortController comes from jsdom while fetch/Request stay
// undici's: undici rejects jsdom's AbortSignal ("Expected signal to be an
// instance of AbortSignal"), which breaks RTK Query's fetchBaseQuery. Strip
// foreign signals in the Request constructor; abort propagation is not
// needed inside exercise tests.
const NativeRequest = globalThis.Request;
if (typeof NativeRequest === "function") {
  globalThis.Request = class extends NativeRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init && "signal" in init) {
        const { signal: _dropped, ...rest } = init;
        init = rest;
      }
      super(input, init);
    }
  };
}

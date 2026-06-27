import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientCreateForm } from "./client-create-form";

describe("client create form foundation", () => {
  it("renders disabled future-phase client fields", () => {
    const html = renderToStaticMarkup(<ClientCreateForm />);

    expect(html).toContain("Client Creation Disabled");
    expect(html).toContain("Read-only review is active.");
    expect(html).toContain("Do not enter real client data.");
    expect(html).toContain("Future client creation requires explicit approval");
    expect(html).toContain("Disabled - no save action");
    expect(html).toContain("disabled");
    expect(html).not.toContain("action=");
  });
});

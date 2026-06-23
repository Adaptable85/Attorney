import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientCreateForm } from "./client-create-form";

describe("client create form foundation", () => {
  it("renders disabled future-phase client fields", () => {
    const html = renderToStaticMarkup(<ClientCreateForm />);

    expect(html).toContain("Create Client Foundation");
    expect(html).toContain("Future phase only");
    expect(html).toContain("Live save remains disabled until production auth provider is selected");
    expect(html).toContain("disabled");
    expect(html).not.toContain("action=");
  });
});

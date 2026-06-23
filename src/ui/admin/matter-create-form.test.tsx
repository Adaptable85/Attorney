import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterCreateForm } from "./matter-create-form";

describe("matter create form foundation", () => {
  it("renders disabled future-phase matter fields", () => {
    const html = renderToStaticMarkup(<MatterCreateForm />);

    expect(html).toContain("Create Matter Foundation");
    expect(html).toContain("Future phase only");
    expect(html).toContain("Live save remains disabled until production auth provider is selected");
    expect(html).toContain("disabled");
    expect(html).not.toContain("action=");
  });
});

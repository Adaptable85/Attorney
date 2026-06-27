import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterCreateForm } from "./matter-create-form";

describe("matter create form foundation", () => {
  it("renders disabled future-phase matter fields", () => {
    const html = renderToStaticMarkup(<MatterCreateForm />);

    expect(html).toContain("Matter Creation Disabled");
    expect(html).toContain("Read-only review is active.");
    expect(html).toContain("Do not enter real matter data.");
    expect(html).toContain("Future matter creation requires explicit approval");
    expect(html).toContain("Disabled - no save action");
    expect(html).toContain("disabled");
    expect(html).not.toContain("action=");
  });
});

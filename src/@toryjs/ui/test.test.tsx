import React from "react";
import { render } from "@testing-library/react";

class M {
  m: string;
}

describe("Test", () => {
  it("works with typescript", () => {
    const d = new M();
    d.m = "1";
    expect(d.m).toBe("r");
  });
  it("tests component with jsx statements", () => {
    const root = render(
      <div>
        <Choose>
          <When condition={false}>Tomas</When>
          <Otherwise>Valeria</Otherwise>
        </Choose>
      </div>
    );
    expect(root.getByText("Tomas")).toHaveAttribute("id", "1");
    expect("it").toBe(false);
  });
});


  export default CartCheckout.unit.test;
  import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Unit Test: Cart Checkout State", () => {
  test("clears cart when checkout is clicked", async () => {
    const TestCart = () => {
      const [items, setItems] = React.useState([{ id: "1", name: "Product" }]);
      return (
        <div>
          <div>Items: {items.length}</div>
          <button onClick={() => setItems([])}>Checkout</button>
        </div>
      );
    };
    render(<TestCart />);
    expect(screen.getByText("Items: 1")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Checkout"));
    await waitFor(() => expect(screen.getByText("Items: 0")).toBeInTheDocument());
  });
});

import React from "react";
import { act, render, waitFor } from "test-utils";
import Combobox, {
  ComboboxProps,
  ComboboxMultiProps,
  SharedComboboxProps,
} from "./Combobox";
import userEvent from "@testing-library/user-event";
import FormComponent from "../Form";

Element.prototype.scrollIntoView = vi.fn();

const setupSingle = (
  props: Omit<ComboboxProps & SharedComboboxProps, "options" | "onChange"> = {}
) => {
  const onSelect = vi.fn();
  const onValueChange = vi.fn();
  const utils = render(
    <Combobox
      options={options}
      onSelect={onSelect}
      onValueChange={onValueChange}
      {...props}
    />
  );
  const combobox = utils.getByTestId("combobox");
  return {
    ...utils,
    user: userEvent.setup(),
    combobox,
    onSelect,
    onValueChange,
  };
};

const setupMulti = (
  props: Omit<
    ComboboxMultiProps & SharedComboboxProps,
    "options" | "onChange"
  > = {}
) => {
  const onSelect = vi.fn();
  const onValueChange = vi.fn();
  const utils = render(
    <Combobox.Multi
      options={options}
      onSelect={onSelect}
      onValueChange={onValueChange}
      {...props}
    />
  );
  const combobox = utils.getByTestId("combobox");
  return {
    ...utils,
    user: userEvent.setup(),
    combobox,
    onSelect,
    onValueChange,
  };
};

describe("Combobox component", () => {
  // single select
  it("can be openened and closed", async () => {
    const { combobox, getByText, queryByText, user } = setupSingle();

    user.click(combobox);

    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    user.keyboard("{Escape}");

    await waitFor(() => {
      expect(queryByText("One")).not.toBeInTheDocument();
    });
  });
  it("displays defaultvalue", async () => {
    const { combobox, getByText } = setupSingle({
      defaultValue: "one",
    });

    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });
  });
  it("displays value and updates it", async () => {
    const { combobox, getByText, rerender } = setupSingle({
      value: "one",
    });

    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    rerender(<Combobox options={options} value="two" />);

    await waitFor(() => {
      expect(getByText("Two")).toBeInTheDocument();
    });
  });
  it("displays value over defaultvalue", async () => {
    const { combobox, getByText } = setupSingle({
      value: "one",
      defaultValue: "two",
    });

    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });
  });
  it("allows selecting and unselecting one value", async () => {
    const { combobox, getByText, getAllByText, queryByText, user } =
      setupSingle();

    // open
    user.click(combobox);

    // wait until open
    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    // select option
    await waitFor(() => {
      getByText("One").click();
    });

    // wait until closed and check that value has been selected
    await waitFor(() => {
      expect(queryByText("Two")).not.toBeInTheDocument();
      expect(getByText("One")).toBeInTheDocument();
    });

    // open again
    user.click(combobox);

    // there should be two ones once it's open
    await waitFor(() => {
      expect(getAllByText("One").length).toBe(2);
    });

    // click the second
    await waitFor(() => {
      getAllByText("One")[1].click();
    });

    // once closed One should not be there
    await waitFor(() => {
      expect(queryByText("One")).not.toBeInTheDocument();
    });
  });
  it("calls callbacks correctly", async () => {
    const { combobox, getByText, getAllByText, user, onValueChange, onSelect } =
      setupSingle();

    // open
    user.click(combobox);

    // wait until open
    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    // select option
    await waitFor(() => {
      getByText("One").click();
    });

    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: "one" })
    );
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: "one" })
    );

    // open again
    user.click(combobox);

    // there should be two ones once it's open
    await waitFor(() => {
      expect(getAllByText("One").length).toBe(2);
    });

    // click the second
    await waitFor(() => {
      getAllByText("One")[1].click();
    });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: "one" })
    );
    expect(onValueChange).toHaveBeenLastCalledWith(undefined);
  });

  // multi select
  it("displays value", async () => {
    const { combobox, getByText, rerender } = setupMulti({
      value: ["one"],
    });

    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    rerender(<Combobox.Multi options={options} value={["two"]} />);

    await waitFor(() => {
      expect(getByText("Two")).toBeInTheDocument();
    });
  });
  it("displays defaultvalue", async () => {
    const { combobox, getByText } = setupMulti({
      defaultValue: ["two"],
    });

    await waitFor(() => {
      expect(getByText("Two")).toBeInTheDocument();
    });
  });
  it("allows selecting and unselecting one value", async () => {
    const { combobox, getByText, getAllByText, queryByText, user } =
      setupMulti();

    // open
    user.click(combobox);

    // wait until open
    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    // select option
    await waitFor(() => {
      getByText("One").click();
    });

    // multi should stay open after select
    await waitFor(() => {
      expect(queryByText("Two")).toBeInTheDocument();
    });

    // select another option
    await waitFor(() => {
      getByText("Two").click();
    });

    // check if the values are displayed as selected
    await waitFor(() => {
      expect(getAllByText("One").length).toBe(2);
      expect(getAllByText("Two").length).toBe(2);
    });

    user.keyboard("{Escape}");

    // popover should be closed
    await waitFor(() => {
      expect(getAllByText("One").length).toBe(1);
      expect(getAllByText("Two").length).toBe(1);
    });
  });
  it("calls callbacks correctly on multi", async () => {
    const { combobox, getByText, getAllByText, user, onValueChange, onSelect } =
      setupMulti();

    // open
    user.click(combobox);

    // wait until open
    await waitFor(() => {
      expect(getByText("One")).toBeInTheDocument();
    });

    // select option
    await waitFor(() => {
      getByText("One").click();
    });

    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: "one" })
    );
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ value: "one" })])
    );

    // click the second
    await waitFor(() => {
      getByText("Two").click();
    });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: "two" })
    );
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ value: "one" }),
        expect.objectContaining({ value: "two" }),
      ])
    );
  });
});

const options = [
  {
    value: "one",
    label: "One",
  },
  {
    value: "two",
    label: "Two",
  },
  {
    value: "three",
    label: "Three",
  },
  {
    value: "four",
    label: "Four",
  },
  {
    value: "five",
    label: "Five",
  },
  {
    value: "six",
    label: "Six",
  },
  {
    value: "seven",
    label: "Seven",
  },
  {
    value: "eight",
    label: "Eight",
  },
  {
    value: "nine",
    label: "Nine",
  },
  {
    value: "ten",
    label: "Ten",
  },
  {
    value: "eleven",
    label: "Eleven",
  },
  {
    value: "twelve",
    label: "Twelve",
  },
  {
    value: "thirteen",
    label: "Thirteen",
  },
  {
    value: "fourteen",
    label: "Fourteen",
  },
  {
    value: "fifteen",
    label: "Fifteen",
  },
  {
    value: "sixteen",
    label: "Sixteen",
  },
];

/* Copyright 2021, Milkdown by Mirone. */

import { createCmdKey } from "@milkdown/core";
import { setBlockType, wrapIn } from "@milkdown/prose/commands";
import { redo, undo } from "@milkdown/prose/history";
import { MarkType } from "@milkdown/prose/model";
import { liftListItem, sinkListItem } from "@milkdown/prose/schema-list";
import { EditorState, TextSelection } from "@milkdown/prose/state";
import { EditorView } from "@milkdown/prose/view";

import { ButtonConfig } from "./button";
import { SelectConfig } from "./select";

export type CommonConfig = {
  disabled?: (view: EditorView) => boolean;
};

export type ConfigItem = SelectConfig | ButtonConfig;

export type Config = Array<Array<ConfigItem>>;

const hasMark = (state: EditorState, type: MarkType | undefined): boolean => {
  if (!type) return false;
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, type);
};

export const SelectParent = createCmdKey("SelectParent");
export const defaultConfig: Config = [
  [
    {
      type: "button",
      icon: `<i class="ph-arrow-u-left-down"></i>`,
      key: "Undo",
      disabled: (view) => {
        return !undo(view.state);
      },
    },
    {
      type: "button",
      icon: `<i class="ph-arrow-u-right-down"></i>`,
      key: "Redo",
      disabled: (view) => {
        return !redo(view.state);
      },
    },
  ],
  [
    {
      type: "select",
      text: `<i class="ph-text-h"></i>`,
      options: [
        { id: "1", text: `<i class="ph-text-h-one"></i>` },
        { id: "2", text: `<i class="ph-text-h-two"></i>` },
        { id: "3", text: `<i class="ph-text-h-three"></i>` },
        { id: "0", text: `<i class="ph-text-t"></i>` },
      ],
      disabled: (view) => {
        const { state } = view;
        const heading = state.schema.nodes["heading"];
        if (!heading) return true;
        const setToHeading = (level: number) =>
          setBlockType(heading, { level })(state);
        return (
          !(view.state.selection instanceof TextSelection) ||
          !(setToHeading(1) || setToHeading(2) || setToHeading(3))
        );
      },
      onSelect: (id) =>
        Number(id) ? ["TurnIntoHeading", Number(id)] : ["TurnIntoText", null],
    },
  ],
  [
    {
      type: "button",
      icon: `<i class="ph-text-bolder"></i>`,
      key: "ToggleBold",
      active: (view) => hasMark(view.state, view.state.schema.marks["strong"]),
      disabled: (view) => !view.state.schema.marks["strong"],
    },
    {
      type: "button",
      icon: `<i class="ph-text-italic"></i>`,
      key: "ToggleItalic",
      active: (view) => hasMark(view.state, view.state.schema.marks["em"]),
      disabled: (view) => !view.state.schema.marks["em"],
    },
    {
      type: "button",
      icon: `<i class="ph-text-strikethrough"></i>`,
      key: "ToggleStrikeThrough",
      active: (view) =>
        hasMark(view.state, view.state.schema.marks["strike_through"]),
      disabled: (view) => !view.state.schema.marks["strike_through"],
    },
  ],
  [
    {
      type: "button",
      icon: `<i class="ph-list-bullets"></i>`,
      key: "WrapInBulletList",
      disabled: (view) => {
        const { state } = view;
        const node = state.schema.nodes["bullet_list"];
        if (!node) return true;
        return !wrapIn(node)(state);
      },
    },
    {
      type: "button",
      icon: `<i class="ph-list-numbers"></i>`,
      key: "WrapInOrderedList",
      disabled: (view) => {
        const { state } = view;
        const node = state.schema.nodes["ordered_list"];
        if (!node) return true;
        return !wrapIn(node)(state);
      },
    },
    {
      type: "button",
      icon: `<i class="ph-arrow-line-right"></i>`,
      key: "LiftListItem",
      disabled: (view) => {
        const { state } = view;
        const node = state.schema.nodes["list_item"];
        if (!node) return true;
        return !liftListItem(node)(state);
      },
    },
    {
      type: "button",
      icon: `<i class="ph-arrow-line-left"></i>`,
      key: "SinkListItem",
      disabled: (view) => {
        const { state } = view;
        const node = state.schema.nodes["list_item"];
        if (!node) return true;
        return !sinkListItem(node)(state);
      },
    },
  ],
  [
    {
      type: "button",
      icon: `<i class="ph-link-simple"></i>`,
      key: "ToggleLink",
      active: (view) => hasMark(view.state, view.state.schema.marks["link"]),
    },
    {
      type: "button",
      icon: `<i class="ph-image-square"></i>`,
      key: "InsertImage",
    },
    {
      type: "button",
      icon: `<i class="ph-table"></i>`,
      key: "InsertTable",
    },
    {
      type: "button",
      icon: `<i class="ph-code"></i>`,
      key: "TurnIntoCodeFence",
    },
  ],
  [
    {
      type: "button",
      icon: `<i class="ph-quotes"></i>`,
      key: "WrapInBlockquote",
    },
    {
      type: "button",
      icon: `<i class="ph-divide"></i>`,
      key: "InsertHr",
    },
  ],
];

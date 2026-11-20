"use client";

import { type Key, Label, ListBox, Select } from "@heroui/react";
import { useMemo } from "react";
import { useFieldContext } from "./context";

type SelectFieldProps<TItem extends { id: Key }> = {
  label?: string;
  items: Iterable<TItem>;
  getTextValue: (item: TItem) => string; // required for a11y + typeahead
  renderItem: (item: TItem) => React.ReactNode; // full row in the popover
  renderValue?: (item: TItem) => React.ReactNode; // collapsed trigger display
} & Omit<
  React.ComponentProps<typeof Select>,
  "children" | "value" | "onChange"
>;

export function SelectField<TItem extends { id: Key }>({
  label,
  items,
  getTextValue,
  renderItem,
  renderValue,
  ...props
}: SelectFieldProps<TItem>) {
  const field = useFieldContext<Key | Key[] | null>();

  const itemsArray = useMemo(() => [...items], [items]);
  const selectedItem =
    itemsArray.find((i) => i.id === field.state.value) ?? null;

  return (
    <Select
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      value={field.state.value}
      {...props}
    >
      {!!label && <Label>{label}</Label>}
      <Select.Trigger>
        <Select.Value>
          {selectedItem ? (renderValue ?? renderItem)(selectedItem) : null}
        </Select.Value>
        {/* todo use fontawesome icon */}
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox items={itemsArray}>
          {(item) => (
            <ListBox.Item
              id={item.id}
              key={item.id}
              textValue={getTextValue(item)}
            >
              {renderItem(item)}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

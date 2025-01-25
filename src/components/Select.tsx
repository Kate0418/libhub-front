import dynamic from "next/dynamic";
import { Props as ReactSelectProps, StylesConfig } from "react-select"; //ライブラリ
const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectProps<IsMulti extends boolean = false>
  extends Omit<ReactSelectProps, "onChange"> {
  isMulti?: IsMulti;
  isHidden?: boolean;
  onChange?: (e: IsMulti extends true ? SelectItem[] : SelectItem) => void;
}

const customStyles: StylesConfig = {
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  control: (provided) => ({
    ...provided,
    border: "none", // ボーダーを削除
    boxShadow: "none", // 通常時のボックスシャドウも削除
    borderRadius: 0,
    "&:hover": {
      border: "none", // ホバー時のボーダーも削除
    },
    backgroundColor: "black",
  }),
  // 他のスタイル設定は同じ
  option: (provided, state) => ({
    ...provided,
    color: "black",
    backgroundColor: state.isFocused ? "gray" : undefined,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1000,
    left: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export function Select<IsMulti extends boolean = false>(
  props: SelectProps<IsMulti>
) {
  const handleChange = (newValue: unknown) => {
    if (props.onChange) {
      if (props.isMulti) {
        (props.onChange as (e: SelectItem[]) => void)(newValue as SelectItem[]);
      } else {
        (props.onChange as (e: SelectItem) => void)(newValue as SelectItem);
      }
    }
  };

  return (
    <ReactSelect
      isClearable={true}
      className={`relative ${props.className}`}
      options={props.options}
      isMulti={props.isMulti}
      maxMenuHeight={120}
      styles={customStyles}
      value={props.value}
      onChange={handleChange}
      placeholder={props.placeholder || "選択なし"}
      menuPlacement="auto"
    />
  );
}

"use client";

// context/SelectTagsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// SelectTags の型定義（必要に応じて変更）
type SelectTags = string[];

// Context の型定義
interface SelectTagsContextType {
  selectTags: SelectTags;
  setSelectTags: React.Dispatch<React.SetStateAction<SelectTags>>;
}

// 初期値を空の配列に設定
const SelectTagsContext = createContext<SelectTagsContextType | undefined>(undefined);

export const useSelectTags = () => {
  const context = useContext(SelectTagsContext);
  if (!context) {
    throw new Error('useSelectTags must be used within a SelectTagsProvider');
  }
  return context;
};

interface SelectTagsProviderProps {
  children: ReactNode;
}

export const SelectTagsProvider = ({ children }: SelectTagsProviderProps) => {
  const [selectTags, setSelectTags] = useState<SelectTags>([]);

  return (
    <SelectTagsContext.Provider value={{ selectTags, setSelectTags }}>
      {children}
    </SelectTagsContext.Provider>
  );
};
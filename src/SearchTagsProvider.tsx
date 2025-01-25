"use client";

// context/SearchTagsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// SearchTags の型定義（必要に応じて変更）
type SearchTags = string[];

// Context の型定義
interface SearchTagsContextType {
  searchTags: SearchTags;
  setSearchTags: React.Dispatch<React.SetStateAction<SearchTags>>;
}

// 初期値を空の配列に設定
const SearchTagsContext = createContext<SearchTagsContextType | undefined>(undefined);

export const useSearchTags = () => {
  const context = useContext(SearchTagsContext);
  if (!context) {
    throw new Error('useSearchTags must be used within a SearchTagsProvider');
  }
  return context;
};

interface SearchTagsProviderProps {
  children: ReactNode;
}

export const SearchTagsProvider = ({ children }: SearchTagsProviderProps) => {
  const [searchTags, setSearchTags] = useState<SearchTags>([]);

  return (
    <SearchTagsContext.Provider value={{ searchTags, setSearchTags }}>
      {children}
    </SearchTagsContext.Provider>
  );
};
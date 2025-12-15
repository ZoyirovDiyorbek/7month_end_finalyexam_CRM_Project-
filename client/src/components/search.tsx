import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Input
      placeholder="Qidirish..."
      prefix={<SearchOutlined />}
      allowClear
      value={searchValue}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ maxWidth: 300 }}
    />
  );
};


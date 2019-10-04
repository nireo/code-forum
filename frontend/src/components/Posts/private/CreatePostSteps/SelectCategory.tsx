import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

interface CategoryInterface {
  category: string;
}

type Props = {
  categories: CategoryInterface;
  handleChange: any;
};

const SelectCategory: React.FC<Props> = ({ categories, handleChange }) => {
  return (
    <div>
      <InputLabel htmlFor="category-select">Category</InputLabel>
      <Select
        value={categories.category}
        onChange={handleChange}
        inputProps={{
          name: "category",
          id: "category-select"
        }}
      >
        <MenuItem value={"python"}>Python</MenuItem>
        <MenuItem value={"js"}>Javascript</MenuItem>
        <MenuItem value={"competetive"}>Competetive</MenuItem>
        <MenuItem value={"books"}>Books</MenuItem>
        <MenuItem value={"random"}>Random</MenuItem>
      </Select>
    </div>
  );
};

export default SelectCategory;

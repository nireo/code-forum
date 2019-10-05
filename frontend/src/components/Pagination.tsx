import React from "react";
import { Link } from "react-router";

type Props = {
  amountInPage: number;
  totalPosts: number;
  paginate: number;
};

const Pagination: React.FC<Props> = ({
  amountInPage,
  totalPosts,
  paginate
}) => {
  const amountOfPages: number[] = [];
  for (let i = 1; i <= Math.ceil(totalPosts / amountInPage); i++) {
    amountOfPages.push(i);
  }
  return (
    <div className="pagination">
      {amountOfPages.map(i => (
        <a href="#">{i}</a>
      ))}
    </div>
  );
};

export default Pagination;

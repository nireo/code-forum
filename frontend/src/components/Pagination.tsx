import React from "react";

type Props = {
  amountInPage: number;
  totalPosts: number;
  paginate: (pageNum: number) => void;
  currentPage: number;
};

const Pagination: React.FC<Props> = ({
  amountInPage,
  totalPosts,
  paginate,
  currentPage
}) => {
  const amountOfPages: number[] = [];
  for (let i = 1; i <= Math.ceil(totalPosts / amountInPage); i++) {
    amountOfPages.push(i);
  }
  return (
    <div className="pagination">
      {amountOfPages.map((i: number) => {
        if (i === currentPage) {
          return (
            <a key={i} className="active" onClick={() => paginate(i)} href="#">
              {i}
            </a>
          );
        } else {
          return (
            <a key={i} onClick={() => paginate(i)} href="#">
              {i}
            </a>
          );
        }
      })}
    </div>
  );
};

export default Pagination;

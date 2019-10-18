import { Report } from "../interfaces/report.interface";

const reducer = (state: Report[] = [], action: any) => {
  switch (action.type) {
    case "CLEAR_REPORTS":
      return [];
    default:
      return state;
  }
};

export const resetReports = () => {
  return { type: "CLEAR_REPORTS" };
};

export default reducer;

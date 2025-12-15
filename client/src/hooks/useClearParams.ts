import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export const useClearParams = () => {
  const pathName = useLocation();
  const [_, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    setSearchParams("");
  }, [pathName.pathname]);
};

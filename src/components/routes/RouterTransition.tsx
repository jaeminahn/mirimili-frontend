import { useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../molecules/Spinner";
import { useLoading } from "../../contexts/LoadingContext";

export default function RouterTransition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { loading, start, stop } = useLoading();

  useEffect(() => {
    if (navigationType === "PUSH" || navigationType === "POP") {
      start();
      const timeout = setTimeout(() => stop(), 400);
      return () => clearTimeout(timeout);
    }
  }, [location, navigationType, start, stop]);

  return loading ? <Spinner /> : null;
}

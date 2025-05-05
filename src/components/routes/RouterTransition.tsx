import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Spinner from "../molecules/Spinner";

export default function RouterTransition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigationType === "PUSH" || navigationType === "POP") {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [location, navigationType]);

  return loading ? <Spinner /> : null;
}

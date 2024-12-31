import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";

export default function NoMatch() {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return <button onClick={goBack}>NO MATCH</button>;
}

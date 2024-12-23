import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Icon } from "@iconify/react";

export default function BadgeButtons() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const onAccept = useCallback(() => {
    logout(() => {
      navigate("/");
    });
  }, []);

  return (
    <div className="flex items-center px-2 bg-gray-100 rounded-xl shrink-0 gap-x-2">
      <Link to="/users/id/scrapped">
        <Icon
          icon="fluent:bookmark-24-filled"
          className="text-lg text-gray-500"
        />
      </Link>
      <Link to="/users/id/alert">
        <Icon icon="fluent:alert-24-filled" className="text-lg text-gray-500" />
      </Link>
      <Link to="/users/id">
        <Icon
          icon="fluent:person-28-filled"
          className="text-lg text-gray-500"
        />
      </Link>
    </div>
  );
}

import { FC } from "react";
import {
  Link as RRLink,
  useMatch,
  LinkProps,
  useResolvedPath,
} from "react-router-dom";

const Link: FC<LinkProps> = ({ className: _className, to, ...props }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const active = match
    ? "text-emerald-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-emerald-600"
    : "";
  const className = ["relative flex items-center h-16 px-1", _className, active]
    .filter(Boolean)
    .join(" ");
  return <RRLink {...props} to={to} className={className} />;
};

interface HeaderButtonsProps {
  onItemClick?: () => void;
}

const HeaderButtons: FC<HeaderButtonsProps> = ({ onItemClick }) => {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-5 md:items-stretch">
      <Link
        className="hover:text-emerald-600"
        to="/post"
        onClick={onItemClick}
      >
        질문&답변
      </Link>
      <Link
        className="hover:text-emerald-600"
        to="/articles"
        onClick={onItemClick}
      >
        밀리팁
      </Link>
    </div>
  );
};

export default HeaderButtons;

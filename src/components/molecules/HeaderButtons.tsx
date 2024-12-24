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
  const className = [_className, match ? "text-emerald-600" : ""].join(" ");
  return <RRLink {...props} to={to} className={className} />;
};

export default function HeaderButtons() {
  const match = useMatch({ path: "/questions", end: true });
  console.log(match);

  return (
    <div className="flex items-center gap-5 text-gray-900">
      <Link className=" hover:text-emerald-600" to="/questions">
        질문&답변
      </Link>
      <Link className=" hover:text-emerald-600" to="/talks">
        커뮤니티
      </Link>
      <Link className=" hover:text-emerald-600" to="/articles">
        밀리Tip
      </Link>
      <div className="w-px h-3 bg-gray-900 shrink-0" />
      <Link className=" hover:text-emerald-600" to="/notices">
        공지
      </Link>
    </div>
  );
}

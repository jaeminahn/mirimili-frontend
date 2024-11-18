interface TagButtonProps {
  label: string;
}

export default function TagButton({ label }: TagButtonProps) {
  return (
    <button className="px-2 py-1 text-sm bg-gray-200 rounded-2xl">
      #{label}
    </button>
  );
}

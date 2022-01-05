interface Props {
  label: string;
  value: React.ReactNode;
}

export function StatBlock(props: Props) {
  const { label, value } = props;
  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm text-gray-500 truncate">{label}</dt>
      <dd className="mt-1 text-3xl text-gray-900">{value}</dd>
    </div>
  );
}

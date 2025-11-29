// components/customer/CustomerStatsCard.tsx
interface Props {
  title: string;
  value: string | number;
}

export default function CustomerStatsCard({ title, value }: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

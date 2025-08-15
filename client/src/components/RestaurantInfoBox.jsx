export default function RestaurantInfoBox({ info }) {
  return (
    <div className="text-sm text-gray-600">
      <p>
        <strong>Restaurant:</strong> {info.name}
      </p>
      <p>{info.address}</p>
    </div>
  );
}

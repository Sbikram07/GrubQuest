export default function OrderItemRow({ item }) {
  return (
    <div className="grid grid-cols-4 items-center text-sm py-2 border-t">
      <div className="flex items-center gap-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
        <span>{item.name}</span>
      </div>
      <p>₹{item.price}</p>
      <p>{item.quantity}</p>
      <p>₹{item.price * item.quantity}</p>
    </div>
  );
}

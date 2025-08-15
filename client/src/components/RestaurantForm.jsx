import { useState } from "react";

export default function RestaurantForm({
  initialData = {},
  onSubmit,
  closeForm,
}) {
  const [data, setData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    image: null,
    tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !data.tags.includes(tag)) {
      setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    // Send tags as array string — backend should parse with JSON.parse()
    formData.append("tags", JSON.stringify(data.tags));

    if (data.image) {
      formData.append("image", data.image);
    }

    await onSubmit(formData);
    if (closeForm) closeForm();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-4">
      <input
        name="name"
        value={data.name}
        onChange={handleChange}
        className="border-2 border-gray-400 shadow-lg rounded-lg h-10 px-2"
        placeholder="Restaurant Name"
      />
      <input
        name="description"
        value={data.description}
        onChange={handleChange}
        className="border-2 border-gray-400 shadow-lg rounded-lg h-10 px-2"
        placeholder="Description"
      />
      <input
        name="address"
        value={data.address}
        onChange={handleChange}
        className="border-2 border-gray-400 shadow-lg rounded-lg h-10 px-2"
        placeholder="Address"
      />
      <input
        type="file"
        className="border-2 border-gray-400 shadow-lg rounded-lg h-10 px-2 py-1"
        onChange={handleFileChange}
      />

      {/* Tags Input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border-2 border-gray-400 shadow-lg rounded-lg h-10 px-2 flex-grow"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-orange-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {data.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-orange-600 text-white rounded px-4 py-2"
      >
        {initialData?._id ? "Update" : "Create"} Restaurant
      </button>
    </form>
  );
}

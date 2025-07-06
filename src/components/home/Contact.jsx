import React from "react";

const Contact = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-md">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Contact Us</h2>

        <p className="text-gray-600 text-center mb-10">
          We'd love to hear from you! Whether you have a question about our service, a suggestion, or need assistance, we're here to help.
        </p>

        <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={5}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Tell us what’s on your mind..."
              required
            ></textarea>
          </div>

          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;


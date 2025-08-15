import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function AboutAndContact() {
  return (
    <div className="bg-slate-800 text-white px-6 py-12 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      {/* About Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">About GrubQuest</h2>
        <p className="text-gray-300 text-base sm:text-lg">
          GrubQuest is your one-stop destination for discovering great food from
          the best restaurants around you. Whether you're craving biryani,
          pizza, or a smoothie bowl, we connect food lovers with top-rated
          restaurants and lightning-fast delivery. Our mission is to serve
          hunger with convenience, trust, and delight.
        </p>
      </section>

      {/* Contact and Social Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-xl" />
              <span>support@grubquest.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-xl" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-xl" />
              <span>Kolkata, India – 700001</span>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-6 text-2xl text-white">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} GrubQuest™. All rights reserved.
      </footer>
    </div>
  );
}

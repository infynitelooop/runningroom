import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
//import aboutImage from "./path/to/your/image.jpg"; // Add your image path here

const AboutPage = () => {
  return (
    <div className=" p-8   bg-gray-100 min-h-screen">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
        <span className="text-1xl font-semibold text-headerColor">"Seamless Management for Railway Crew Stays"</span>
        </p>
        <p className="mb-4">
          At Tayaltech, we understand the challenges of managing running rooms efficiently. 
          Our platform is designed to simplify the entire process — from tracking bookings and occupancy to 
          ensuring every crew member has a smooth and comfortable stay.
          With real-time dashboards, automated alerts, and organized records, running room managers can focus 
          on what truly matters: providing reliable accommodations for the crew while keeping operations streamlined and hassle-free.

          We’re committed to helping railway organizations save time, reduce errors, and maintain control over 
          crew accommodations — all in one easy-to-use platform.
        </p>

















        <ul className="list-disc list-inside mb-4 text-sm px-6 py-2">
          <li className="mb-2">
            <strong>Effortless Booking Management</strong> – Track and manage crew stays from a single dashboard.
          </li>
          <li className="mb-2">
            <strong>Real-Time Occupancy Monitoring </strong> – See which rooms are available or occupied instantly.
          </li>
          <li className="mb-2">
            <strong>Automated Alerts & Notifications</strong> – Never miss a booking or overbook a room.
          </li>
          <li className="mb-2">
            <strong>Centralized Crew Records</strong> – Keep all accommodation history organized and easily accessible.
          </li>

          <li className="mb-2">
            <strong>Streamlined Operations</strong> – Reduce manual paperwork and administrative hassle.
          </li>
          <li className="mb-2">
            <strong>Enhanced Efficiency</strong> – Save time and improve the overall management workflow.
          </li>
          <li className="mb-2">
            <strong>Secure Data Handling</strong> – Ensure sensitive crew information stays protected.
          </li>
          <li className="mb-2">
            <strong>Reports & Analytics</strong> – Generate insights on room utilization and stay patterns.
          </li>



        </ul>
        <div className="flex space-x-4 mt-10">
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaFacebookF size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaTwitter size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaLinkedinIn size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaInstagram size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

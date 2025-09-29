import React from "react";
import { Link } from "react-router-dom";

const RegistrationSuccess = () => {
  return (
    <div className="min-h-[calc(100vh-74px)] flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg p-10 rounded-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Registration Successful!
        </h1>
        <p className="mb-6 text-gray-700">
          Your account has been created successfully. You can now proceed to login.
        </p>
        <Link
          to="/login"
          className="bg-customRed text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccess;

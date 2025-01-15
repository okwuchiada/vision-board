import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const LandingPage = () => {
  return (
    <div className="bg-white">
      <header className="bg-blue-500 text-white h-screen  py-6">
        <div className="w-full flex justify-between items-center px-10 py-8">
          <div className="font-bold text-2xl italic">Orama Board</div>
          <ul className="w-80 flex justify-between items-center">
            <li>About</li>
            <li>Features</li>
            <li>
              <Link
                href={"/auth/login"}
                className="bg-orange-500 px-6 py-2 rounded w-20 hover:bg-orange-600"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div className="h-full flex flex-col justify-center items-center">
          <div className=" mx-auto text-center">
            <h1 className="text-4xl font-bold">Welcome to Orama Board</h1>
            <p className="mt-2 text-lg">
              Your ultimate vision board for clarity, creativity, and growth.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-orange-500 mt-10 text-white rounded hover:bg-orange-600"
          >
            Get Started Now
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-10">
            {/* <!-- Feature 1 --> */}
            <div className="p-6 bg-white shadow-lg rounded">
              <h3 className="text-2xl font-bold text-blue-500">Visualize</h3>
              <p className="mt-4 text-gray-600">
                Use stunning visuals and templates to design a board that
                inspires.
              </p>
            </div>
            {/* <!-- Feature 2 --> */}
            <div className="p-6 bg-white shadow-lg rounded">
              <h3 className="text-2xl font-bold text-orange-500">Organize</h3>
              <p className="mt-4 text-gray-600">
                Arrange and prioritize your goals effortlessly with our smart
                tools.
              </p>
            </div>
            {/* <!-- Feature 3 --> */}
            <div className="p-6 bg-white shadow-lg rounded">
              <h3 className="text-2xl font-bold text-blue-500">Achieve</h3>
              <p className="mt-4 text-gray-600">
                Track your progress and celebrate every milestone along the way.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* <!-- Hero Section --> */}
      <section className="flex flex-col items-center justify-center bg-blue-100 h-[500px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Turn Your Dreams Into Reality
          </h2>
          <p className="mt-4 text-gray-700">
            With Orama Board, you can visualize, organize, and manifest your
            goals with ease. Start creating your personalized vision board
            today!
          </p>
          <div className="mt-8">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- Features Section --> */}

      {/* <!-- Call-to-Action Section --> */}
      {/* <section id="signup" className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Join Orama Board Today</h2>
          <p className="mt-4">
            Sign up and start bringing your vision to life.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-orange-500 rounded hover:bg-orange-600"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section> */}

      {/* <!-- Footer Section --> */}
      <footer className="bg-blue-700 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Orama Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

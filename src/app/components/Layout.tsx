import { ReactNode } from "react";
import Link from "next/link";
import React from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-purple-600">
            YourAsianMom
          </h1>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/lililiyabbayx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; 2024 YourAsianMom. Now go study!
        </div>
      </footer>
    </div>
  );
}

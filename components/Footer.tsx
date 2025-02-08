import React from "react";

// Reusable component for each section of links
const LinkList = ({ title, links }: { title: string; links: string[] }) => (
  <div className="col-span-1">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <ul className="mt-2 space-y-1">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-500">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  // Define link arrays for each section to avoid repetition
  const aboutLinks = ["How it works", "Featured", "Partnership", "Business Relation"];
  const communityLinks = ["Events", "Blog", "Podcast", "Invite a friend"];
  const socialsLinks = ["Discord", "Instagram", "Twitter", "Facebook"];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div>
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 px-8 py-10">
          {/* Logo and Vision */}
          <div className="col-span-1">
            <h1 className="text-2xl font-bold text-blue-500">Car Rental</h1>
            <p className="text-sm text-gray-600 mt-2">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* Reusable Sections */}
          <LinkList title="About" links={aboutLinks} />
          <LinkList title="Community" links={communityLinks} />
          <LinkList title="Socials" links={socialsLinks} />
        </div>

        {/* Bottom Section */}
        <div className="h-20 mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-4 px-8">
          <p className="text-sm text-gray-600">
            © 2024 Car Rental. All rights reserved
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500">
              Privacy & Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500">
              Terms & Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

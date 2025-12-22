import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-white">CareerNest</span>
            <p className="mt-4 text-sm text-slate-400">
              Connecting emerging talent with world-class opportunities. Your career journey starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-primary-500 transition-colors">Browse Internships</Link></li>
              <li><Link to="/jobs" className="hover:text-primary-500 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/recruiting" className="hover:text-primary-500 transition-colors">For Recruiters</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="hover:text-primary-500 transition-colors">Career Blog</Link></li>
              <li><Link to="/resume-guide" className="hover:text-primary-500 transition-colors">Resume Guide</Link></li>
              <li><Link to="/faq" className="hover:text-primary-500 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/omprakashkewatiya" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-colors" aria-label="GitHub"><FiGithub size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-colors" aria-label="Twitter"><FiTwitter size={20} /></a>
              <a href="https://linkedin.com/in/omprakashkewatiya" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-colors" aria-label="LinkedIn"><FiLinkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CareerNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

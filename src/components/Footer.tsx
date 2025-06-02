import React from 'react';
import { Github, Linkedin, Youtube, Instagram, Phone } from 'lucide-react';
const Footer: React.FC = () => {
  const socialLinks = [{
    name: 'GitHub',
    url: 'https://github.com/starboyonkar',
    icon: Github,
    hoverColor: 'hover:text-gray-900 hover:bg-gray-100'
  }, {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/onkar-chaugule',
    icon: Linkedin,
    hoverColor: 'hover:text-blue-600 hover:bg-blue-50'
  }, {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCpzZr2eg1lsB6yALzsBTUlQ',
    icon: Youtube,
    hoverColor: 'hover:text-red-600 hover:bg-red-50'
  }, {
    name: 'Instagram',
    url: 'https://instagram.com/onkar.chougule.73',
    icon: Instagram,
    hoverColor: 'hover:text-pink-600 hover:bg-pink-50'
  }, {
    name: 'Phone',
    url: 'tel:+919373261147',
    icon: Phone,
    hoverColor: 'hover:text-green-600 hover:bg-green-50'
  }];
  return <footer className="bg-borewell-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Company Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Borewell Services & Equipment</h3>
            <p className="text-borewell-100 text-sm">Professional borewell drilling and equipment services</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            {socialLinks.map(link => {
            const IconComponent = link.icon;
            return <a key={link.name} href={link.url} target={link.name === 'Phone' ? '_self' : '_blank'} rel={link.name === 'Phone' ? undefined : 'noopener noreferrer'} className={`
                    p-3 rounded-full bg-borewell-700 text-white 
                    transition-all duration-300 transform 
                    hover:scale-110 hover:shadow-lg
                    ${link.hoverColor}
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-borewell-800
                  `} aria-label={`Visit our ${link.name} profile`} title={link.name === 'Phone' ? 'Call us at +91 9373261147' : `Follow us on ${link.name}`}>
                  <IconComponent size={20} />
                </a>;
          })}
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-borewell-200">
            <p>📞 +91 9373261147 | 📧 Contact us for all your borewell needs</p>
          </div>

          {/* Copyright */}
          <div className="border-t border-borewell-600 pt-4 text-center text-xs text-borewell-300">
            <p>© {new Date().getFullYear()} Borewell Services & Equipment. All rights reserved.</p>
            <p className="mt-1 text-base">OnkarNova Technologies, Solapur</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
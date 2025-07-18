import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Shop: ['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'],
    Support: ['Size Guide', 'Shipping', 'Returns', 'FAQ', 'Contact'],
    Company: ['About Us', 'Careers', 'Press', 'Sustainability', 'Terms']
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com' }
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl tracking-wide mb-4">DevīCo</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Crafting elegant and sustainable fashion for the modern individual. 
              Every piece tells a story of quality, style, and conscious design.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 DevīCo. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
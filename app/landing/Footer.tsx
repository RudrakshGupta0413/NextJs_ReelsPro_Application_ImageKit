
import { Video, Mail, Phone, MapPin, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer id='footer' className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-slate-400/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Reels Pro App
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The ultimate platform for video creators. Upload, edit, and share your content with millions of viewers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all duration-300">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Integrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Mobile App</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Bug Reports</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                  <Mail className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">hello@reelspro.app</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
                  <MapPin className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl p-6 -mx-6">
          <p className="text-gray-400 text-sm">
            © 2024 Reels Pro App. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
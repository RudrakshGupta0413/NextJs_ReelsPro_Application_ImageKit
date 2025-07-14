
import { Upload, Edit, Share2, TrendingUp, Shield, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop your videos with support for all major formats. Lightning-fast upload speeds.',
      gradient: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-100'
    },
    {
      icon: Edit,
      title: 'Built-in Editor',
      description: 'Professional editing tools right in your browser. Add effects, transitions, and music.',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100'
    },
    {
      icon: Share2,
      title: 'Smart Sharing',
      description: 'Share across all platforms instantly. Optimize for each social media automatically.',
      gradient: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-100'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your performance with detailed analytics. Understand your audience better.',
      gradient: 'from-gray-600 to-slate-700',
      bgColor: 'from-gray-50 to-slate-100'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Your content is protected with enterprise-grade security and automatic backups.',
      gradient: 'from-slate-600 to-gray-700',
      bgColor: 'from-slate-50 to-gray-100'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with global CDN delivery. Your videos load instantly worldwide.',
      gradient: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-100'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-slate-200/30 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-700 to-gray-900 bg-clip-text text-transparent">
              Powerful Features
            </span>
            <br />
            <span className="text-gray-900">
              for Content Creators
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Everything you need to create, upload, and share amazing video content. 
            Built by creators, for creators.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/60 backdrop-blur-sm relative overflow-hidden`}
            >
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`h-1 w-12 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-slate-100 via-gray-50 to-blue-100 rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern for CTA */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to start creating?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of creators who are already using Reels Pro App to share their stories with the world.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-500/20">
                Get Started for Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
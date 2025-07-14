
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Tech Reviewer",
      followers: "2.3M",
      content: "Reels Pro App completely transformed my content creation process. The analytics are incredible and the upload speed is unmatched.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Chen",
      role: "Lifestyle Influencer",
      followers: "1.8M",
      content: "The built-in editor saved me hours of work. I can create professional-looking content directly in the app without any external tools.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Fitness Creator",
      followers: "987K",
      content: "Best platform for creators hands down. The revenue tracking and audience insights help me understand my community better than ever.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">What Creators</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Join thousands of successful creators who trust Reels Pro App to grow their audience and maximize their reach.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 relative hover:shadow-2xl transition-all duration-500 hover:bg-slate-800/70 group">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                <Quote className="h-12 w-12 text-gray-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-slate-600"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                  <p className="text-xs text-blue-400 font-medium">{testimonial.followers} followers</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-400">Creator Satisfaction Rate</div>
          </div>
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Customer Support</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Platform Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
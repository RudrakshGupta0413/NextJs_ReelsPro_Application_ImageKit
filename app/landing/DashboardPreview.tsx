
import { Play, TrendingUp, Users, Eye, Heart, BarChart3, Calendar, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-700 to-gray-900 bg-clip-text text-transparent">
              Your Creator
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Command Center
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Get a glimpse of our powerful dashboard that puts everything you need at your fingertips.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto">
          {/* Main Dashboard Container */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Creator Dashboard</h3>
                    <p className="text-gray-300 text-sm">Welcome back, Creator!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload Video</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                      Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">2.4M</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-indigo-500" />
                      Followers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">48.2K</div>
                    <p className="text-xs text-green-600">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-slate-500" />
                      Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">94.7%</div>
                    <p className="text-xs text-green-600">+5% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gray-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-gray-500" />
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">$12.8K</div>
                    <p className="text-xs text-green-600">+23% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Videos and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Videos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Play className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Videos
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "How to Create Viral Content", views: "245K", likes: "12.3K", time: "2 hours ago" },
                      { title: "Behind the Scenes Vlog", views: "189K", likes: "8.7K", time: "1 day ago" },
                      { title: "Product Review: Latest Tech", views: "156K", likes: "9.2K", time: "3 days ago" }
                    ].map((video, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{video.title}</h4>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {video.views}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {video.likes}
                            </span>
                            <span>{video.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions & Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                        <Upload className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="text-sm font-medium text-gray-900">Upload Video</div>
                        <div className="text-xs text-gray-500">Add new content</div>
                      </button>
                      <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-left">
                        <BarChart3 className="h-6 w-6 text-indigo-600 mb-2" />
                        <div className="text-sm font-medium text-gray-900">Analytics</div>
                        <div className="text-xs text-gray-500">View insights</div>
                      </button>
                    </div>

                    {/* Upcoming Schedule */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">Upcoming Schedule</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Live Stream</span>
                          <span className="text-gray-900 font-medium">Today 8:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">New Video Release</span>
                          <span className="text-gray-900 font-medium">Tomorrow 2:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Collaboration Call</span>
                          <span className="text-gray-900 font-medium">Friday 10:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Preview */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Manage Everything
                <span className="block text-blue-600">On the Go</span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access your creator dashboard from anywhere. Upload videos, check analytics, 
                engage with your audience, and schedule content directly from your mobile device.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Real-time analytics and performance tracking
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Quick video uploads with automatic optimization
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Instant notifications for comments and engagement
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    {/* Mobile Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Reels Pro</h4>
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Mobile Content */}
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">2.4M Views</div>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                          <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                          <div className="text-xs font-medium">48K Followers</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">Latest Video</div>
                            <div className="text-xs text-gray-500">245K views</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-12 h-8 bg-gradient-to-r from-slate-400 to-gray-500 rounded"></div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">Behind Scenes</div>
                            <div className="text-xs text-gray-500">189K views</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
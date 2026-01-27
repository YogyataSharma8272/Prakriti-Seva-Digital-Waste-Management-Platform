import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Trophy, 
  Leaf, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  Star,
  Target,
  Recycle,
  TreePine,
  Droplets,
  Flower
} from 'lucide-react';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Mock user data
  const userData = {
    name: 'Shri Ganesh Temple Committee',
    joinDate: 'January 2024',
    totalContributions: 47,
    rank: 'Eco Warrior',
    nextRank: 'Nature Guardian',
    rankProgress: 75
  };

  // Waste collection data over time
  const wasteData = [
    { month: 'Jan', flowers: 45, organic: 30, oil: 5, paper: 10, total: 90 },
    { month: 'Feb', flowers: 52, organic: 35, oil: 7, paper: 12, total: 106 },
    { month: 'Mar', flowers: 48, organic: 32, oil: 6, paper: 14, total: 100 },
    { month: 'Apr', flowers: 65, organic: 42, oil: 8, paper: 15, total: 130 },
    { month: 'May', flowers: 58, organic: 38, oil: 9, paper: 18, total: 123 },
    { month: 'Jun', flowers: 72, organic: 45, oil: 11, paper: 20, total: 148 }
  ];

  // Environmental impact data
  const impactData = [
    { category: 'Flowers Composted', value: 340, unit: 'kg', color: '#10b981', icon: Flower },
    { category: 'Trees Saved', value: 12, unit: 'trees', color: '#059669', icon: TreePine },
    { category: 'Water Saved', value: 2500, unit: 'liters', color: '#0891b2', icon: Droplets },
    { category: 'CO₂ Reduced', value: 185, unit: 'kg', color: '#7c3aed', icon: Leaf }
  ];

  // Waste type distribution
  const wasteTypeData = [
    { name: 'Flowers', value: 55, color: '#f59e0b' },
    { name: 'Organic', value: 25, color: '#10b981' },
    { name: 'Paper', value: 15, color: '#3b82f6' },
    { name: 'Oil/Ghee', value: 5, color: '#ef4444' }
  ];

  // User badges/achievements
  const badges = [
    {
      id: 'first-pickup',
      name: 'First Steps',
      description: 'Completed your first waste pickup',
      earned: true,
      date: '2024-01-15',
      icon: '🌱',
      rarity: 'common'
    },
    {
      id: 'monthly-contributor',
      name: 'Monthly Contributor',
      description: 'Consistent pickups for 6 months',
      earned: true,
      date: '2024-06-01',
      icon: '⭐',
      rarity: 'common'
    },
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Diverted 100+ kg from landfills',
      earned: true,
      date: '2024-05-20',
      icon: '🏆',
      rarity: 'rare'
    },
    {
      id: 'composting-champion',
      name: 'Composting Champion',
      description: 'Successfully composted 500kg of organic waste',
      earned: true,
      date: '2024-06-15',
      icon: '🌿',
      rarity: 'epic'
    },
    {
      id: 'nature-guardian',
      name: 'Nature Guardian',
      description: 'Save 25 trees through waste diversion',
      earned: false,
      date: null,
      icon: '🌳',
      rarity: 'legendary'
    },
    {
      id: 'zero-waste-temple',
      name: 'Zero Waste Temple',
      description: 'Achieve 100% waste diversion for 3 months',
      earned: false,
      date: null,
      icon: '♻️',
      rarity: 'legendary'
    }
  ];

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Recent activities
  const recentActivities = [
    {
      date: '2024-06-22',
      action: 'Waste Pickup',
      details: '25kg mixed temple waste collected',
      impact: '+3 environmental points',
      icon: Recycle
    },
    {
      date: '2024-06-18',
      action: 'Badge Earned',
      details: 'Composting Champion achievement unlocked',
      impact: '+50 points bonus',
      icon: Award
    },
    {
      date: '2024-06-15',
      action: 'Impact Milestone',
      details: 'Saved 10th tree through waste diversion',
      impact: 'Tree Saver badge progress',
      icon: TreePine
    },
    {
      date: '2024-06-10',
      action: 'Awareness Quiz',
      details: 'Completed "Composting Basics" quiz',
      impact: '+10 knowledge points',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 relative">
          {/* Sacred symbols background */}
          <div className="absolute top-0 right-10 text-6xl opacity-10" style={{ color: 'var(--saffron)' }}>🕉</div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--nature-green)' }}>
                मेरा डैशबोर्ड
              </h1>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">My Sacred Dashboard</h2>
              <p className="text-xl text-gray-700">Welcome back, {userData.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="px-4 py-2 text-white font-semibold" style={{ backgroundColor: 'var(--saffron)' }}>
                  <Trophy className="h-5 w-5 mr-2" />
                  {userData.rank}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Sacred service since {userData.joinDate}</p>
            </div>
          </div>
          
          {/* Inspirational Sanskrit Quote */}
          <div className="mt-8 bg-gradient-to-r from-nature-green/10 to-saffron/10 rounded-xl p-4 max-w-xl">
            <p className="text-lg font-bold mb-1" style={{ color: 'var(--saffron)' }}>
              "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
            </p>
            <p className="text-sm text-gray-600">
              You have the right to perform your actions, but not to the fruits of action
            </p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactData.map((metric, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.category}</p>
                    <p className="text-3xl font-bold" style={{ color: metric.color }}>
                      {metric.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{metric.unit}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-orange-100 p-3 rounded-full">
                    <metric.icon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Waste Collection Trends */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Waste Collection Trends</CardTitle>
              <CardDescription>Monthly breakdown of collected waste types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="flowers"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="Flowers (kg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="organic"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Organic (kg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="paper"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="Paper (kg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="oil"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    name="Oil/Ghee (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Distribution Pie Chart */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Waste Distribution</CardTitle>
              <CardDescription>Breakdown by waste type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">Achievements</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">Your Achievements</CardTitle>
                <CardDescription>
                  Badges earned through your environmental contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge) => (
                    <Card
                      key={badge.id}
                      className={`border-2 transition-all duration-200 ${
                        badge.earned 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <h3 className={`font-bold mb-2 ${
                          badge.earned ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {badge.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {badge.description}
                        </p>
                        <Badge className={`text-xs ${getBadgeColor(badge.rarity)}`}>
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </Badge>
                        {badge.earned && badge.date && (
                          <p className="text-xs text-gray-500 mt-2">
                            Earned: {new Date(badge.date).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-green-700">Rank Progress</CardTitle>
                  <CardDescription>
                    Progress towards next rank: {userData.nextRank}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Rank</span>
                      <Badge className="bg-green-100 text-green-800">
                        {userData.rank}
                      </Badge>
                    </div>
                    <Progress value={userData.rankProgress} className="h-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{userData.rankProgress}% complete</span>
                      <span className="text-green-600 font-medium">
                        {100 - userData.rankProgress}% to go
                      </span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Next Milestone</h4>
                      <p className="text-sm text-green-600">
                        Complete 3 more waste pickups to unlock {userData.nextRank} rank
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-green-700">Monthly Goals</CardTitle>
                  <CardDescription>Your progress this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Waste Collections</span>
                        <span className="text-sm text-gray-600">8/10</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Weight Diverted</span>
                        <span className="text-sm text-gray-600">148/200 kg</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Quiz Completions</span>
                        <span className="text-sm text-gray-600">2/3</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">Recent Activity</CardTitle>
                <CardDescription>Your latest contributions and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <activity.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{activity.action}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{activity.details}</p>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {activity.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Sacred Closing Message */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-nature-green/10 via-saffron/5 to-nature-green/10 rounded-2xl p-8 max-w-4xl mx-auto border-2" style={{ borderColor: 'var(--saffron-light)' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--nature-green)' }}>
              🙏 Blessed Service Recognition 🙏
            </h3>
            <p className="text-lg mb-4" style={{ color: 'var(--saffron)' }}>
              "सेवा परमो धर्मः"
            </p>
            <p className="text-gray-700 leading-relaxed">
              Service is the highest dharma. Your contributions to protecting Prakriti (Nature) 
              are acts of devotion that purify the soul and benefit all beings. May your sacred 
              service continue to inspire others on the path of environmental consciousness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
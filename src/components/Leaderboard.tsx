import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Gift, 
  Leaf, 
  Recycle, 
  Award,
  ShoppingBag,
  Coins
} from 'lucide-react';

// Mock data for leaderboard users
const leaderboardData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    points: 2850,
    rank: 1,
    badge: 'Dharma Guardian',
    wasteCollected: '145kg',
    level: 'Gold',
    avatar: 'RK'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    points: 2720,
    rank: 2,
    badge: 'Seva Champion',
    wasteCollected: '138kg',
    level: 'Gold',
    avatar: 'PS'
  },
  {
    id: 3,
    name: 'Amit Patel',
    points: 2650,
    rank: 3,
    badge: 'Prakriti Protector',
    wasteCollected: '132kg',
    level: 'Silver',
    avatar: 'AP'
  },
  {
    id: 4,
    name: 'Sunita Devi',
    points: 2480,
    rank: 4,
    badge: 'Temple Keeper',
    wasteCollected: '124kg',
    level: 'Silver',
    avatar: 'SD'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    points: 2350,
    rank: 5,
    badge: 'Eco Warrior',
    wasteCollected: '118kg',
    level: 'Silver',
    avatar: 'VS'
  },
  {
    id: 6,
    name: 'Kavita Joshi',
    points: 2180,
    rank: 6,
    badge: 'Green Devotee',
    wasteCollected: '109kg',
    level: 'Bronze',
    avatar: 'KJ'
  },
  {
    id: 7,
    name: 'Ravi Gupta',
    points: 2050,
    rank: 7,
    badge: 'Nature Friend',
    wasteCollected: '102kg',
    level: 'Bronze',
    avatar: 'RG'
  },
  {
    id: 8,
    name: 'Anita Verma',
    points: 1950,
    rank: 8,
    badge: 'Seva Helper',
    wasteCollected: '98kg',
    level: 'Bronze',
    avatar: 'AV'
  }
];

// Mock redemption products
const redeemableProducts = [
  {
    id: 1,
    name: 'Recycled Paper Notebooks (5 pack)',
    description: 'Handmade from temple waste paper',
    points: 500,
    image: 'notebook recycled paper',
    category: 'Stationery',
    inStock: true
  },
  {
    id: 2,
    name: 'Eco-friendly Diya Set',
    description: 'Clay diyas made from recycled temple materials',
    points: 750,
    image: 'clay diya lamp',
    category: 'Religious',
    inStock: true
  },
  {
    id: 3,
    name: 'Recycled Cloth Shopping Bags',
    description: 'Made from cleaned temple cloth waste',
    points: 400,
    image: 'cloth shopping bag',
    category: 'Utility',
    inStock: true
  },
  {
    id: 4,
    name: 'Organic Compost (2kg)',
    description: 'Premium compost from temple organic waste',
    points: 300,
    image: 'organic compost fertilizer',
    category: 'Garden',
    inStock: true
  },
  {
    id: 5,
    name: 'Recycled Incense Holder',
    description: 'Beautiful holders crafted from metal waste',
    points: 600,
    image: 'incense holder brass',
    category: 'Religious',
    inStock: false
  },
  {
    id: 6,
    name: 'Eco Kalash Set',
    description: 'Traditional brass kalash restored and polished',
    points: 1200,
    image: 'brass kalash traditional',
    category: 'Religious',
    inStock: true
  }
];

export function Leaderboard() {
  const [userPoints] = useState(2480); // Current user's points (4th place)
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4" style={{ color: 'var(--nature-green)' }} />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'Bronze':
        return 'bg-gradient-to-r from-amber-600 to-amber-800';
      default:
        return 'bg-gradient-to-r from-green-400 to-green-600';
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? redeemableProducts 
    : redeemableProducts.filter(product => product.category === selectedCategory);

  const categories = ['All', ...new Set(redeemableProducts.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Sanskrit Shloka */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Trophy className="h-8 w-8" style={{ color: 'var(--saffron)' }} />
            <h1 className="text-3xl" style={{ color: 'var(--nature-green)' }}>
              Seva Leaderboard
            </h1>
            <Trophy className="h-8 w-8" style={{ color: 'var(--saffron)' }} />
          </div>
          
          <div className="bg-gradient-to-r from-saffron/10 to-nature-green/10 p-4 rounded-lg mb-6">
            <p className="text-lg italic mb-2" style={{ color: 'var(--saffron)' }}>
              "यज्ञेन दत्तं तु पुनर्न दत्तं"
            </p>
            <p className="text-sm" style={{ color: 'var(--nature-green)' }}>
              "What is given in sacred service is truly given"
            </p>
          </div>

          {/* User's Current Points */}
          <Card className="max-w-md mx-auto mb-8 border-2" style={{ borderColor: 'var(--saffron)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback 
                      className="text-white" 
                      style={{ backgroundColor: 'var(--nature-green)' }}
                    >
                      YP
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>Your Progress</h3>
                    <p className="text-sm opacity-75">Rank #4</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Coins className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                    <span className="text-xl">{userPoints}</span>
                  </div>
                  <p className="text-xs opacity-75">Seva Points</p>
                </div>
              </div>
              <Progress value={75} className="mb-2" />
              <p className="text-xs text-center">520 points to Silver level!</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="leaderboard">🏆 Rankings</TabsTrigger>
            <TabsTrigger value="rewards">🎁 Rewards</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid gap-4 md:gap-6">
              {/* Top 3 Podium */}
              <Card className="p-6">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Star className="h-5 w-5" style={{ color: 'var(--saffron)' }} />
                    <span>Top Seva Champions</span>
                    <Star className="h-5 w-5" style={{ color: 'var(--saffron)' }} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {leaderboardData.slice(0, 3).map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`text-center p-4 rounded-lg ${
                          index === 0 ? 'bg-gradient-to-t from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                          index === 1 ? 'bg-gradient-to-t from-gray-50 to-gray-100 border-2 border-gray-300' :
                          'bg-gradient-to-t from-amber-50 to-amber-100 border-2 border-amber-300'
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback 
                            className={`text-white ${getLevelColor(user.level)}`}
                          >
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mb-1">{user.name}</h3>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <Coins className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                          <span>{user.points.toLocaleString()}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: 'var(--nature-green)', 
                            color: 'var(--nature-green)' 
                          }}
                        >
                          {user.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Full Rankings List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" style={{ color: 'var(--nature-green)' }} />
                    <span>Complete Rankings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboardData.map((user) => (
                    <div 
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        user.rank === 4 
                          ? 'bg-gradient-to-r from-saffron/10 to-nature-green/10 border-2 border-saffron/30' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full" 
                             style={{ backgroundColor: user.rank <= 3 ? 'var(--saffron)' : 'var(--nature-green)' }}>
                          <span className="text-white text-sm">#{user.rank}</span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback 
                            className={`text-white ${getLevelColor(user.level)}`}
                          >
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="flex items-center space-x-2">
                            <span>{user.name}</span>
                            {user.rank === 4 && (
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: 'var(--saffron)', 
                                  color: 'var(--saffron)' 
                                }}
                              >
                                You
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm opacity-75">{user.badge}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Coins className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                          <span>{user.points.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs opacity-75">
                          <Recycle className="h-3 w-3" />
                          <span>{user.wasteCollected}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements Section */}
              <Card className="bg-gradient-to-br from-saffron/5 to-nature-green/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" style={{ color: 'var(--saffron)' }} />
                    <span>Achievement Badges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'First Pickup', icon: Leaf, earned: true },
                      { name: '10kg Milestone', icon: Recycle, earned: true },
                      { name: 'Monthly Champion', icon: Crown, earned: true },
                      { name: '100kg Master', icon: Trophy, earned: false }
                    ].map((achievement, index) => (
                      <div 
                        key={index}
                        className={`text-center p-3 rounded-lg border-2 ${
                          achievement.earned 
                            ? 'bg-white border-green-300' 
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <achievement.icon 
                          className={`h-8 w-8 mx-auto mb-2 ${
                            achievement.earned ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                        <p className={`text-sm ${achievement.earned ? 'font-medium' : 'text-gray-500'}`}>
                          {achievement.name}
                        </p>
                        {achievement.earned && (
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs"
                            style={{ 
                              borderColor: 'var(--nature-green)', 
                              color: 'var(--nature-green)' 
                            }}
                          >
                            Earned
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            {/* User Points Display */}
            <Card className="bg-gradient-to-r from-saffron/10 to-nature-green/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Coins className="h-6 w-6" style={{ color: 'var(--saffron)' }} />
                    <span className="text-2xl">{userPoints.toLocaleString()}</span>
                  </div>
                  <p style={{ color: 'var(--nature-green)' }}>Available Seva Points</p>
                  <p className="text-sm mt-2 italic" style={{ color: 'var(--saffron)' }}>
                    "दानं वै यज्ञो दानेन स्वर्गो लोकः" - Through giving, one attains divine realms
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                  style={selectedCategory === category 
                    ? { backgroundColor: 'var(--nature-green)', color: 'white' }
                    : { borderColor: 'var(--nature-green)', color: 'var(--nature-green)' }
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Redeemable Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`overflow-hidden transition-shadow hover:shadow-lg ${
                    !product.inStock ? 'opacity-60' : ''
                  }`}
                >
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                    <div className="text-center p-4">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-2" style={{ color: 'var(--nature-green)' }} />
                      <p className="text-xs opacity-75">{product.image}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: product.inStock ? 'var(--nature-green)' : 'var(--saffron)', 
                          color: product.inStock ? 'var(--nature-green)' : 'var(--saffron)'
                        }}
                      >
                        {product.inStock ? 'Available' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-75 mb-3">{product.description}</p>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4" style={{ color: 'var(--saffron)' }} />
                        <span className="font-medium">{product.points}</span>
                        <span className="text-xs opacity-75">points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!product.inStock || userPoints < product.points}
                        className="text-xs"
                        style={{
                          backgroundColor: product.inStock && userPoints >= product.points 
                            ? 'var(--nature-green)' 
                            : undefined,
                          color: product.inStock && userPoints >= product.points ? 'white' : undefined
                        }}
                      >
                        {userPoints >= product.points ? 'Redeem' : 'Insufficient Points'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Inspirational Message */}
            <Card className="bg-gradient-to-r from-saffron/10 to-nature-green/10">
              <CardContent className="p-6 text-center">
                <Leaf className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--nature-green)' }} />
                <p className="text-lg italic mb-2" style={{ color: 'var(--saffron)' }}>
                  "सेवा परमो धर्मः"
                </p>
                <p style={{ color: 'var(--nature-green)' }}>
                  Service is the highest duty - Continue your noble seva and earn divine blessings!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
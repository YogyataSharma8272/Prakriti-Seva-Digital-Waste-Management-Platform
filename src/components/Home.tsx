import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './media/ImageWithFallback';
import {
  Trash2,
  BookOpen,
  BarChart3,
  Leaf,
  Users,
  Award,
  ArrowRight,
  Recycle,
  Heart,
  Sparkles,
  Flower2,
} from 'lucide-react';

type Screen = 'home' | 'waste-collection' | 'awareness' | 'dashboard';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const mainSections = [
    {
      id: 'waste-collection' as Screen,
      title: 'Waste Collection',
      description: 'Schedule pickup for temple waste and contribute to environmental protection through sacred service',
      icon: Trash2,
      gradient: 'from-nature-green to-nature-green-light',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-white'
    },
    {
      id: 'awareness' as Screen,
      title: 'Awareness',
      description: 'Learn sustainable practices and eco-friendly temple management for spiritual growth',
      icon: BookOpen,
      gradient: 'from-saffron to-saffron-light',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-white'
    },
    {
      id: 'dashboard' as Screen,
      title: 'My Contributions',
      description: 'Track your environmental impact and spiritual achievements in sacred service',
      icon: BarChart3,
      gradient: 'from-nature-green-dark to-saffron',
      bgColor: 'bg-gradient-to-br from-green-50 to-orange-50',
      borderColor: 'border-yellow-300',
      iconColor: 'text-white'
    }
  ];

  const stats = [
    { label: 'Temples Served', value: '1,250+', icon: Heart, color: 'var(--saffron)' },
    { label: 'Waste Collected', value: '50 Tons', icon: Recycle, color: 'var(--nature-green)' },
    { label: 'Active Devotees', value: '5,000+', icon: Users, color: 'var(--saffron-dark)' },
    { label: 'Divine Blessings', value: '∞', icon: Sparkles, color: 'var(--nature-green-dark)' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Temple Image */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1671520429216-c29deb395d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoaW5kdSUyMHRlbXBsZSUyMGJlYXV0aWZ1bCUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTg1MzY0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Beautiful Indian Temple Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-nature-green/80 via-transparent to-saffron/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center min-h-screen">
          <div className="text-center text-white">
            {/* Sacred Symbol */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border-2 border-white/30">
                <div className="relative">
                  <Leaf className="h-16 w-16 text-saffron" />
                  <Flower2 className="h-8 w-8 text-nature-green absolute -top-2 -right-2" />
                </div>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
              प्रकृति सेवा
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-saffron-light">
              Prakriti Seva - The Eco Dharmik Platform
            </h2>
            <p className="text-xl md:text-2xl mb-6 text-green-100 font-medium">
              Sacred Waste Management for Divine Spaces
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Transforming temple waste into environmental blessings through sustainable practices, 
              community awareness, and sacred responsibility to Mother Earth.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={() => onNavigate('waste-collection')}
                className="text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30"
                style={{ backgroundColor: 'var(--saffron)' }}
              >
                Begin Sacred Service
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            {/* Sacred Shloka */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="text-center">
                <p className="text-2xl mb-3 font-bold text-saffron-light">
                  "धर्मो रक्षति रक्षितः"
                </p>
                <p className="text-lg text-white/90 italic">
                  Dharma protects those who protect it
                </p>
                <p className="text-sm text-white/70 mt-2">
                  Protecting Nature is our sacred duty
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-saffron/5 via-white to-nature-green/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--nature-green)' }}>
              Our Sacred Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Through collective seva, we create positive environmental change
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div 
                  className="p-6 rounded-full inline-flex mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon 
                    className="h-10 w-10" 
                    style={{ color: stat.color }} 
                  />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Service Sections */}
      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-orange-50 relative">
        {/* Sacred Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl" style={{ color: 'var(--saffron)' }}>॥</div>
          <div className="absolute top-32 right-20 text-4xl" style={{ color: 'var(--nature-green)' }}>🕉</div>
          <div className="absolute bottom-20 left-20 text-5xl" style={{ color: 'var(--saffron)' }}>🪷</div>
          <div className="absolute bottom-10 right-10 text-6xl" style={{ color: 'var(--nature-green)' }}>॥</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--nature-green)' }}>
              Our Sacred Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive services designed to help temples manage waste 
              responsibly while fulfilling our dharmic duty to protect Prakriti (Nature).
            </p>
            
            {/* Sanskrit Quote */}
            <div className="mt-8 bg-gradient-to-r from-saffron/10 to-nature-green/10 rounded-lg p-4 max-w-xl mx-auto">
              <p className="text-lg font-bold" style={{ color: 'var(--saffron)' }}>
                "वसुधैव कुटुम्बकम्"
              </p>
              <p className="text-sm text-gray-600 mt-1">
                The Earth is our family
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {mainSections.map((section, index) => (
              <Card 
                key={section.id}
                className={`${section.bgColor} border-3 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer group relative overflow-hidden`}
                style={{ borderColor: section.id === 'dashboard' ? 'var(--saffron)' : 
                         section.id === 'waste-collection' ? 'var(--nature-green)' : 'var(--saffron)' }}
                onClick={() => onNavigate(section.id)}
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div 
                    className="absolute top-2 right-2 text-2xl"
                    style={{ color: section.id === 'waste-collection' ? 'var(--nature-green)' : 'var(--saffron)' }}
                  >
                    🕉
                  </div>
                </div>
                
                <CardHeader className="text-center pb-6">
                  <div 
                    className={`bg-gradient-to-r ${section.gradient} p-6 rounded-full inline-flex mx-auto mb-6 group-hover:scale-125 transition-transform duration-300 shadow-xl`}
                  >
                    <section.icon className={`h-10 w-10 ${section.iconColor}`} />
                  </div>
                  <CardTitle 
                    className="text-2xl font-bold mb-2"
                    style={{ color: section.id === 'waste-collection' ? 'var(--nature-green)' : 'var(--saffron)' }}
                  >
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <CardDescription className="text-gray-700 mb-8 leading-relaxed text-base">
                    {section.description}
                  </CardDescription>
                  <Button 
                    className={`w-full text-white hover:opacity-90 transition-all duration-300 group-hover:shadow-lg py-3 rounded-full font-semibold`}
                    style={{ backgroundColor: section.id === 'waste-collection' ? 'var(--nature-green)' : 'var(--saffron)' }}
                  >
                    Explore {section.title}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Mission Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sacredPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacredPattern)" style={{ color: 'var(--saffron)' }} />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: 'var(--nature-green)' }}>
                Our Sacred Mission
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                We believe that caring for our environment is a sacred duty enshrined in our ancient 
                wisdom. Through Prakriti Seva - The Eco Dharmik Platform, we help temples and devotees contribute to a cleaner, 
                greener world while maintaining the sanctity and respect our divine spaces deserve.
              </p>
              
              {/* Sacred Principle */}
              <div className="bg-gradient-to-r from-saffron/10 to-nature-green/10 rounded-xl p-6 mb-8 border-l-4" style={{ borderColor: 'var(--saffron)' }}>
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--saffron)' }}>
                  "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                </p>
                <p className="text-sm text-gray-600">
                  May all beings be happy, may all beings be free from disease
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--nature-green)20' }}>
                    <Recycle className="h-6 w-6" style={{ color: 'var(--nature-green)' }} />
                  </div>
                  <span className="text-gray-800 text-lg">Sustainable waste management through ancient wisdom</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--saffron)20' }}>
                    <Users className="h-6 w-6" style={{ color: 'var(--saffron)' }} />
                  </div>
                  <span className="text-gray-800 text-lg">Community-driven environmental consciousness</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--nature-green-dark)20' }}>
                    <Award className="h-6 w-6" style={{ color: 'var(--nature-green-dark)' }} />
                  </div>
                  <span className="text-gray-800 text-lg">Recognition for dharmic environmental service</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1745647912842-231631509cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZW1wbGUlMjBwZWFjZWZ1bCUyMHNlcmVuZSUyMHNwaXJpdHVhbHxlbnwxfHx8fDE3NTg1MzY1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Peaceful Temple Environment"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Sacred Quote */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border-2" style={{ borderColor: 'var(--saffron)' }}>
                <p className="text-lg font-bold" style={{ color: 'var(--nature-green)' }}>
                  🌱 प्रकृति माता
                </p>
                <p className="text-sm text-gray-600">
                  Nature is our Mother
                </p>
              </div>
            </div>
          </div>
          
          {/* Final Sacred Message */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-nature-green/10 via-saffron/5 to-nature-green/10 rounded-2xl p-8 max-w-4xl mx-auto border-2" style={{ borderColor: 'var(--saffron-light)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--nature-green)' }}>
                Join Our Sacred Mission
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every small act of environmental consciousness is a step towards fulfilling our dharmic duty. 
                Together, let us protect and preserve the sacred gifts of Prakriti for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
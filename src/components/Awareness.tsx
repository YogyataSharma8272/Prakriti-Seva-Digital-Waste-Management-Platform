import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './media/ImageWithFallback';
import { 
  BookOpen, 
  Play, 
  Users, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  FileText,
  Video,
  Trophy,
  Lightbulb,
  Leaf,
  Recycle,
  Heart,
  Star
} from 'lucide-react';

export function Awareness() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentSuccessStory, setCurrentSuccessStory] = useState(0);

  const infographics = [
    {
      title: 'How to Compost Temple Waste',
      description: 'Step-by-step guide to composting flowers and organic waste',
      category: 'Composting',
      steps: [
        'Separate organic waste (flowers, food)',
        'Create a compost pit or use bins',
        'Layer green and brown materials',
        'Turn regularly and maintain moisture',
        'Harvest compost in 3-6 months'
      ]
    },
    {
      title: 'Oil & Ghee Disposal',
      description: 'Proper methods for disposing of used oil and ghee',
      category: 'Waste Management',
      steps: [
        'Collect used oil in containers',
        'Do not pour down drains',
        'Contact authorized collectors',
        'Can be converted to biodiesel',
        'Small amounts can go to compost'
      ]
    },
    {
      title: 'Flower Waste Recycling',
      description: 'Transform temple flowers into useful products',
      category: 'Recycling',
      steps: [
        'Collect fresh flowers separately',
        'Remove non-biodegradable items',
        'Use for incense stick making',
        'Create natural dyes',
        'Make potpourri or compost'
      ]
    }
  ];

  const videoTutorials = [
    {
      title: 'Setting Up Temple Composting System',
      duration: '8:45',
      views: '12.5K',
      category: 'Composting',
      thumbnail: 'https://images.unsplash.com/photo-1715766911071-b1ad5af85da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG5hdHVyZSUyMGNvbXBvc3Rpbmd8ZW58MXx8fHwxNzU4NTM1NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Eco-friendly Festival Celebrations',
      duration: '6:20',
      views: '8.7K',
      category: 'Festivals',
      thumbnail: 'https://images.unsplash.com/photo-1737335958899-0950550f6010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBzcGlyaXR1YWwlMjBuYXR1cmV8ZW58MXx8fHwxNzU4NTM1NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Making Natural Incense from Flowers',
      duration: '10:15',
      views: '15.2K',
      category: 'DIY',
      thumbnail: 'https://images.unsplash.com/photo-1750210864586-82c073c36306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlY3ljbGluZyUyMGVudmlyb25tZW50fGVufDF8fHx8MTc1ODUzNTYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Temple Waste Segregation Best Practices',
      duration: '5:30',
      views: '9.8K',
      category: 'Waste Management',
      thumbnail: 'https://images.unsplash.com/photo-1758525861781-bea6e7d79334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGVudmlyb25tZW50fGVufDF8fHx8MTc1ODUzNTc1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const successStories = [
    {
      temple: 'Shri Ganesh Temple, Mumbai',
      achievement: 'Zero Waste Temple',
      impact: 'Reduced waste by 95% through composting and recycling',
      image: 'https://images.unsplash.com/photo-1758518731027-78a22c8852ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwY2VsZWJyYXRpb24lMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NTg1MzU3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: 'Implemented comprehensive waste management system serving 5000+ devotees daily.'
    },
    {
      temple: 'Lakshmi Temple, Bangalore',
      achievement: 'Composting Champion',
      impact: 'Produces 2 tons of compost monthly from flower waste',
      image: 'https://images.unsplash.com/photo-1715766911071-b1ad5af85da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG5hdHVyZSUyMGNvbXBvc3Rpbmd8ZW58MXx8fHwxNzU4NTM1NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: 'Community garden initiative provides fresh produce to local families.'
    },
    {
      temple: 'Durga Temple, Delhi',
      achievement: 'Eco Innovation Award',
      impact: 'Created incense sticks from temple flowers',
      image: 'https://images.unsplash.com/photo-1737335958899-0950550f6010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBzcGlyaXR1YWwlMjBuYXR1cmV8ZW58MXx8fHwxNzU4NTM1NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: 'Generates additional income for temple while reducing waste to zero.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What percentage of temple waste is typically organic?',
      options: ['30%', '50%', '70%', '90%'],
      correct: 2,
      explanation: 'About 70% of temple waste consists of organic materials like flowers, food offerings, and other biodegradable items.'
    },
    {
      question: 'Which method is best for disposing of used temple oil?',
      options: ['Pour down the drain', 'Throw in regular trash', 'Contact authorized collectors', 'Burn it'],
      correct: 2,
      explanation: 'Used oil should be collected by authorized agencies who can convert it to biodiesel or dispose of it safely.'
    },
    {
      question: 'How long does it typically take for flower waste to decompose in compost?',
      options: ['1 week', '1 month', '3-6 months', '1 year'],
      correct: 2,
      explanation: 'Flower waste typically decomposes in 3-6 months when properly composted with the right conditions.'
    },
    {
      question: 'What can be made from recycled temple flowers?',
      options: ['Only compost', 'Incense sticks and natural dyes', 'Nothing useful', 'Only potpourri'],
      correct: 1,
      explanation: 'Temple flowers can be recycled into incense sticks, natural dyes, potpourri, and compost.'
    }
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowQuizResults(true);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correct ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowQuizResults(false);
  };

  const nextSuccessStory = () => {
    setCurrentSuccessStory((prev) => (prev + 1) % successStories.length);
  };

  const prevSuccessStory = () => {
    setCurrentSuccessStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          {/* Sacred Background Elements */}
          <div className="absolute top-0 left-10 text-4xl opacity-10" style={{ color: 'var(--saffron)' }}>📿</div>
          <div className="absolute top-10 right-10 text-4xl opacity-10" style={{ color: 'var(--nature-green)' }}>🌿</div>
          
          <div className="flex justify-center mb-8">
            <div className="p-6 rounded-full shadow-xl" style={{ background: 'linear-gradient(135deg, var(--saffron) 0%, var(--nature-green) 100%)' }}>
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--nature-green)' }}>
            पर्यावरण जागरूकता
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Environmental Awareness</h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Learn sustainable practices rooted in ancient wisdom, watch educational tutorials, 
            explore inspiring success stories, and test your knowledge about dharmic temple management.
          </p>
          
          {/* Sanskrit Wisdom Quote */}
          <div className="bg-gradient-to-r from-nature-green/10 to-saffron/10 rounded-xl p-6 max-w-3xl mx-auto border-2" style={{ borderColor: 'var(--nature-green-light)' }}>
            <p className="text-lg font-bold mb-2" style={{ color: 'var(--nature-green)' }}>
              "विद्या ददाति विनयं विनयाद्याति पात्रताम्"
            </p>
            <p className="text-sm text-gray-600">
              Knowledge gives humility; from humility comes worthiness
            </p>
          </div>
        </div>

        {/* Infographics Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Educational Guides</h2>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <FileText className="h-4 w-4 mr-1" />
              {infographics.length} Guides
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infographics.map((infographic, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {infographic.category}
                    </Badge>
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg text-green-700">{infographic.title}</CardTitle>
                  <CardDescription>{infographic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {infographic.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className="bg-gradient-to-r from-green-500 to-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                          {stepIndex + 1}
                        </div>
                        <p className="text-sm text-gray-600 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Spiritual Transition Quote */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-saffron/5 to-nature-green/5 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--saffron)' }}>
              "क्रियावान् स पंडितः"
            </p>
            <p className="text-sm text-gray-600">
              One who acts with knowledge is truly wise
            </p>
          </div>
        </div>

        {/* Video Tutorials Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--nature-green)' }}>Video Tutorials</h2>
            <Badge className="px-4 py-2 text-white" style={{ backgroundColor: 'var(--saffron)' }}>
              <Video className="h-4 w-4 mr-1" />
              {videoTutorials.length} Sacred Teachings
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-200 overflow-hidden group cursor-pointer">
                <div className="relative">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Play className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{video.views} views</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Another Spiritual Quote */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-nature-green/5 to-saffron/5 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--nature-green)' }}>
              "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः"
            </p>
            <p className="text-sm text-gray-600">
              Success comes through effort, not mere wishes
            </p>
          </div>
        </div>

        {/* Success Stories Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--nature-green)' }}>Success Stories</h2>
            <Badge className="px-4 py-2 text-white" style={{ backgroundColor: 'var(--saffron)' }}>
              <Trophy className="h-4 w-4 mr-1" />
              Inspiring Temples
            </Badge>
          </div>
          
          <Card className="bg-white shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <ImageWithFallback
                  src={successStories[currentSuccessStory].image}
                  alt={successStories[currentSuccessStory].temple}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-orange-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    {successStories[currentSuccessStory].achievement}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSuccessStory}
                      className="p-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSuccessStory}
                      className="p-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {successStories[currentSuccessStory].temple}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-lg font-medium text-green-700">
                      {successStories[currentSuccessStory].impact}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {successStories[currentSuccessStory].details}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-2">
                    {successStories.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentSuccessStory ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Final Spiritual Quote before Quiz */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-saffron/5 to-nature-green/5 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--saffron)' }}>
              "ज्ञानं परमं बलम्"
            </p>
            <p className="text-sm text-gray-600">
              Knowledge is the supreme strength
            </p>
          </div>
        </div>

        {/* Interactive Quiz */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--nature-green)' }}>Sacred Knowledge Quiz</h2>
            <Badge className="px-4 py-2 text-white" style={{ backgroundColor: 'var(--saffron)' }}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Test Your Wisdom
            </Badge>
          </div>
          
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
              {!showQuizResults ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </h3>
                    <Progress 
                      value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
                      className="w-32" 
                    />
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-xl font-medium text-gray-900 mb-6">
                      {quizQuestions[currentQuestionIndex].question}
                    </h4>
                    
                    <div className="space-y-3">
                      {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                          className={`w-full text-left justify-start p-4 h-auto ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                          onClick={() => handleQuizAnswer(index)}
                        >
                          <span className="mr-3 font-semibold">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <Button
                      onClick={nextQuestion}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                      className="bg-gradient-to-r from-green-600 to-orange-500 text-white"
                    >
                      {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-orange-500 p-4 rounded-full inline-flex mb-4">
                      <Trophy className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                    <p className="text-gray-600">You scored {calculateScore()} out of {quizQuestions.length} questions correctly.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="text-6xl font-bold text-green-600 mb-2">
                      {Math.round((calculateScore() / quizQuestions.length) * 100)}%
                    </div>
                    <div className="text-gray-600">
                      {calculateScore() === quizQuestions.length ? 'Perfect Score! 🌟' :
                       calculateScore() >= quizQuestions.length * 0.7 ? 'Great Job! 👏' :
                       'Keep Learning! 📚'}
                    </div>
                  </div>
                  
                  <Button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-green-600 to-orange-500 text-white"
                  >
                    Take Quiz Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
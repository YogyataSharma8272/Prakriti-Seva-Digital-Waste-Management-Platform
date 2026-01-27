import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './media/ImageWithFallback';
import { 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone,
  Leaf,
  Flower,
  Recycle,
  Apple,
  Droplets,
  Package,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface FormData {
  templeName: string;
  contactPerson: string;
  phone: string;
  address: string;
  wasteType: string;
  estimatedWeight: string;
  date: Date | undefined;
  timeSlot: string;
  regularPickup: boolean;
  frequency: string;
  specialInstructions: string;
}

export function WasteCollection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    templeName: '',
    contactPerson: '',
    phone: '',
    address: '',
    wasteType: '',
    estimatedWeight: '',
    date: undefined,
    timeSlot: '',
    regularPickup: false,
    frequency: '',
    specialInstructions: ''
  });

  const wasteTypes = [
    { id: 'flowers', label: 'Flowers & Petals', icon: Flower, description: 'Fresh flowers, garlands, petals' },
    { id: 'organic', label: 'Organic Waste', icon: Apple, description: 'Food offerings, fruits, vegetables' },
    { id: 'oil', label: 'Oil & Ghee', icon: Droplets, description: 'Used oil, ghee, liquid offerings' },
    { id: 'paper', label: 'Paper Materials', icon: Package, description: 'Sacred texts, prayer papers, cardboard' },
    { id: 'mixed', label: 'Mixed Temple Waste', icon: Recycle, description: 'Combination of various temple materials' }
  ];

  const timeSlots = [
    '6:00 AM - 8:00 AM',
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.templeName || !formData.contactPerson || !formData.phone || 
        !formData.address || !formData.wasteType || !formData.date || !formData.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    toast.success('Pickup request submitted successfully! We will contact you within 2 hours.');
    setShowForm(false);
    setFormData({
      templeName: '',
      contactPerson: '',
      phone: '',
      address: '',
      wasteType: '',
      estimatedWeight: '',
      date: undefined,
      timeSlot: '',
      regularPickup: false,
      frequency: '',
      specialInstructions: ''
    });
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowForm(false)}
              className="hover:opacity-80"
              style={{ color: 'var(--nature-green)' }}
            >
              ← Back to Waste Collection
            </Button>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader className="text-white rounded-t-lg" style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}>
              <div className="flex items-center space-x-3">
                <Trash2 className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">Schedule Waste Pickup</CardTitle>
                  <CardDescription className="text-green-100">
                    Fill in the details below to schedule a pickup from your temple
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="templeName" className="text-green-700">Temple Name *</Label>
                    <Input
                      id="templeName"
                      placeholder="Enter temple name"
                      value={formData.templeName}
                      onChange={(e) => updateFormData('templeName', e.target.value)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-green-700">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      placeholder="Contact person name"
                      value={formData.contactPerson}
                      onChange={(e) => updateFormData('contactPerson', e.target.value)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-green-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedWeight" className="text-green-700">Estimated Weight</Label>
                    <Select onValueChange={(value) => updateFormData('estimatedWeight', value)}>
                      <SelectTrigger className="border-green-200 focus:border-green-500">
                        <SelectValue placeholder="Select estimated weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light (1-5 kg)</SelectItem>
                        <SelectItem value="medium">Medium (5-20 kg)</SelectItem>
                        <SelectItem value="heavy">Heavy (20-50 kg)</SelectItem>
                        <SelectItem value="bulk">Bulk (50+ kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-green-700">Temple Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete temple address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="border-green-200 focus:border-green-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-green-700">Type of Waste *</Label>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wasteTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer border-2 transition-all duration-200 ${
                          formData.wasteType === type.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => updateFormData('wasteType', type.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <type.icon className={`h-8 w-8 mx-auto mb-2 ${
                            formData.wasteType === type.id ? 'text-green-600' : 'text-gray-500'
                          }`} />
                          <h4 className={`font-medium mb-1 ${
                            formData.wasteType === type.id ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {type.label}
                          </h4>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-green-700">Pickup Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal border-green-200 ${
                            !formData.date && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => updateFormData('date', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-700">Time Slot *</Label>
                    <Select onValueChange={(value) => updateFormData('timeSlot', value)}>
                      <SelectTrigger className="border-green-200 focus:border-green-500">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{slot}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Regular Pickup Section */}
                <div className="space-y-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--saffron)10' }}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="regularPickup"
                      checked={formData.regularPickup}
                      onChange={(e) => updateFormData('regularPickup', e.target.checked)}
                      className="w-5 h-5 rounded border-2"
                      style={{ accentColor: 'var(--nature-green)' }}
                    />
                    <Label htmlFor="regularPickup" className="flex items-center space-x-2" style={{ color: 'var(--nature-green)' }}>
                      <RotateCcw className="h-5 w-5" />
                      <span className="font-semibold">Schedule Regular Pickup</span>
                    </Label>
                  </div>
                  
                  {formData.regularPickup && (
                    <div className="ml-8 space-y-2">
                      <Label style={{ color: 'var(--nature-green)' }}>Pickup Frequency</Label>
                      <Select onValueChange={(value) => updateFormData('frequency', value)}>
                        <SelectTrigger className="border-2" style={{ borderColor: 'var(--saffron-light)' }}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="festival-season">During Festival Season</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Spiritual Quote for Regular Service */}
                      <div className="bg-white/50 rounded-lg p-3 mt-3 border-l-4" style={{ borderColor: 'var(--saffron)' }}>
                        <p className="text-sm font-bold" style={{ color: 'var(--saffron)' }}>
                          "नित्यं सेवा करोति यः स धन्यः"
                        </p>
                        <p className="text-xs text-gray-600">
                          Blessed are those who serve continuously
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions" style={{ color: 'var(--nature-green)' }}>Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Any special handling requirements or additional information for our seva team"
                    value={formData.specialInstructions}
                    onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                    className="border-2"
                    style={{ borderColor: 'var(--saffron-light)', focusBorderColor: 'var(--nature-green)' }}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>We'll confirm your pickup within 2 hours</span>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}
                  >
                    Schedule Sacred Pickup
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          {/* Sacred Symbols */}
          <div className="absolute top-0 left-1/4 text-6xl opacity-10" style={{ color: 'var(--saffron)' }}>🕉</div>
          <div className="absolute top-0 right-1/4 text-6xl opacity-10" style={{ color: 'var(--nature-green)' }}>🪷</div>
          
          <div className="flex justify-center mb-8">
            <div className="p-6 rounded-full shadow-xl relative" style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}>
              <Trash2 className="h-16 w-16 text-white" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--nature-green)' }}>
            पवित्र अपशिष्ट संग्रह
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sacred Waste Collection</h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Schedule eco-friendly waste pickup from your temple. We handle all types of temple waste 
            with utmost respect, following dharmic principles of environmental responsibility.
          </p>
          
          {/* Sacred Quote */}
          <div className="bg-gradient-to-r from-saffron/10 to-nature-green/10 rounded-xl p-6 max-w-2xl mx-auto border-2" style={{ borderColor: 'var(--saffron-light)' }}>
            <p className="text-lg font-bold mb-2" style={{ color: 'var(--saffron)' }}>
              "यत्र यत्र रघुनाथकीर्तनं तत्र तत्र कृतमस्तकांजलिम्"
            </p>
            <p className="text-sm text-gray-600">
              Wherever the sacred is honored, there divinity resides
            </p>
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-green-700 mb-4">Request Waste Pickup</CardTitle>
                <CardDescription className="text-gray-600">
                  Simple, quick, and environmentally responsible waste collection for your temple
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">Free pickup from your temple location</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Recycle className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Environmentally responsible disposal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Confirmation within 2 hours</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full text-white py-8 text-xl rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold border-2 border-white/30"
                  style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}
                >
                  Begin Sacred Service
                  <Sparkles className="ml-2 h-6 w-6" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1715766911071-b1ad5af85da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG5hdHVyZSUyMGNvbXBvc3Rpbmd8ZW58MXx8fHwxNzU4NTM1NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Composting and green nature"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Waste Types Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Types of Waste We Handle</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteTypes.map((type) => (
              <Card key={type.id} className="bg-white hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <type.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{type.label}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Request</h3>
              <p className="text-gray-600 text-sm">Fill out the simple pickup form with your temple details</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full inline-flex mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-gray-600 text-sm">We'll confirm your pickup within 2 hours via phone</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-flex mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collection</h3>
              <p className="text-gray-600 text-sm">Our team arrives at scheduled time for pickup</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing</h3>
              <p className="text-gray-600 text-sm">Eco-friendly processing and recycling of materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
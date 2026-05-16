import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Loader
} from 'lucide-react';
import { format } from 'date-fns';

const API_BASE = (import.meta as any).env?.VITE_CORE_API_BASE_URL || 'http://localhost:5002/api';

interface FormData {
  temple: string;
  contactPerson: string;
  contactNumber: string;
  address: string;
  wasteType: string;
  quantity: string;
  scheduleDate: Date | undefined;
  timeSlot: string;
  regularPickup: boolean;
  frequency: string;
  specialInstructions: string;
}

interface MyPickup {
  _id: string;
  temple: string;
  address: string;
  status: string;
  scheduleDate: string;
  quantity: string;
  wasteType: string;
  assignedVolunteer?: string;
  vehicleNumber?: string;
  estimatedArrival?: string;
  trackingNote?: string;
  currentLocation?: string;
  mapQuery?: string;
  createdAt: string;
}

function getTrackingSteps(status: string) {
  return [
    { label: 'Request Submitted', done: true },
    { label: 'Approved', done: status === 'Approved' || status === 'InTransit' || status === 'Completed' },
    { label: 'Pickup In Progress', done: status === 'InTransit' || status === 'Completed' },
    { label: 'Completed', done: status === 'Completed' },
  ];
}

function getMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

export function WasteCollection() {
  const [showForm, setShowForm] = useState(false);
  const [showMyPickups, setShowMyPickups] = useState(false);
  const [myPickups, setMyPickups] = useState<MyPickup[]>([]);
  const [loadingPickups, setLoadingPickups] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const previousPickupSnapshot = useRef<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    temple: '',
    contactPerson: '',
    contactNumber: '',
    address: '',
    wasteType: '',
    quantity: '',
    scheduleDate: undefined,
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

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  // Fetch my pickups
  const fetchMyPickups = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error('Please login first');
      return;
    }
    setLoadingPickups(true);
    try {
      const res = await fetch(`${API_BASE}/pickups/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = await res.text();
      const data = raw ? (() => {
        try { return JSON.parse(raw); } catch { return { message: raw }; }
      })() : {};
      if (res.ok) {
        const nextPickups = Array.isArray(data) ? data : [];
        nextPickups.forEach((pickup) => {
          const snapshot = `${pickup.status}|${pickup.estimatedArrival || ''}|${pickup.currentLocation || ''}`;
          const previous = previousPickupSnapshot.current[pickup._id];
          if (previous && previous !== snapshot) {
            toast.success(`Tracking updated for ${pickup.temple}`);
          }
          previousPickupSnapshot.current[pickup._id] = snapshot;
        });
        setMyPickups(nextPickups);
      } else {
        toast.error(data.message || 'Failed to load pickups');
      }
    } catch (e: any) {
      toast.error('Error loading pickups: ' + e.message);
    } finally {
      setLoadingPickups(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!showMyPickups) return;
    fetchMyPickups();
    const intervalId = window.setInterval(() => {
      fetchMyPickups();
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, [showMyPickups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    
    if (!token) {
      toast.error('Please login first');
      return;
    }

    // Validation
    if (!formData.temple || !formData.contactPerson || !formData.contactNumber || 
        !formData.address || !formData.wasteType || !formData.quantity || !formData.scheduleDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        temple: formData.temple,
        address: formData.address,
        wasteType: formData.wasteType,
        scheduleDate: formData.scheduleDate?.toISOString(),
        contactNumber: formData.contactNumber,
        quantity: Number(formData.quantity),
        contactPerson: formData.contactPerson,
        timeSlot: formData.timeSlot,
        specialInstructions: formData.specialInstructions,
        regularPickup: formData.regularPickup,
        frequency: formData.frequency
      };

      const res = await fetch(`${API_BASE}/pickups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const raw = await res.text();
      const data = raw ? (() => {
        try { return JSON.parse(raw); } catch { return { message: raw }; }
      })() : {};
      if (res.ok) {
        toast.success('✅ Pickup request submitted successfully!');
        setShowForm(false);
        setFormData({
          temple: '',
          contactPerson: '',
          contactNumber: '',
          address: '',
          wasteType: '',
          quantity: '',
          scheduleDate: undefined,
          timeSlot: '',
          regularPickup: false,
          frequency: '',
          specialInstructions: ''
        });
        // Refresh pickups
        fetchMyPickups();
      } else {
        const details = Array.isArray(data?.errors) ? data.errors.join(', ') : '';
        toast.error(details || data?.message || 'Failed to submit pickup request');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setSubmitting(false);
    }
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
                    <Label htmlFor="temple" className="text-green-700">Temple Name *</Label>
                    <Input
                      id="temple"
                      placeholder="Enter temple name"
                      value={formData.temple}
                      onChange={(e) => updateFormData('temple', e.target.value)}
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
                    <Label htmlFor="contactNumber" className="text-green-700">Phone Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.contactNumber}
                      onChange={(e) => updateFormData('contactNumber', e.target.value)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-green-700">Estimated Weight (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={formData.quantity}
                      onChange={(e) => updateFormData('quantity', e.target.value)}
                      className="border-green-200 focus:border-green-500"
                    />
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
                    <div className="flex gap-2">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.scheduleDate ? formData.scheduleDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            const date = new Date(e.target.value + 'T00:00:00');
                            updateFormData('scheduleDate', date);
                          } else {
                            updateFormData('scheduleDate', undefined);
                          }
                        }}
                        className="flex-1 px-3 py-2 border-2 border-green-200 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-2 border-green-200 hover:border-green-400 bg-white"
                            title="Open Calendar"
                          >
                            <CalendarIcon className="h-4 w-4 text-green-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border-2 border-green-300 shadow-2xl z-[9999]" align="start" side="bottom">
                          <Calendar
                            mode="single"
                            selected={formData.scheduleDate}
                            onSelect={(date) => {
                              updateFormData('scheduleDate', date);
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="rounded-lg"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {formData.scheduleDate && (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Selected: {format(formData.scheduleDate, "EEEE, MMMM d, yyyy")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-700">Time Slot</Label>
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
                    disabled={submitting}
                    className="text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}
                  >
                    {submitting ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Schedule Sacred Pickup
                        <CheckCircle className="ml-2 h-5 w-5" />
                      </>
                    )}
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
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="flex-1 text-white py-8 text-xl rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold border-2 border-white/30"
                    style={{ background: 'linear-gradient(135deg, var(--nature-green) 0%, var(--saffron) 100%)' }}
                  >
                    Begin Sacred Service
                    <Sparkles className="ml-2 h-6 w-6" />
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setShowMyPickups(!showMyPickups);
                      if (!showMyPickups) fetchMyPickups();
                    }}
                    variant="outline"
                    className="px-8 py-3 rounded-xl font-semibold border-2"
                    style={{ borderColor: 'var(--nature-green)', color: 'var(--nature-green)' }}
                  >
                    My Pickups
                  </Button>
                </div>
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

        {/* My Pickups Section */}
        {showMyPickups && (
          <div className="mb-16 bg-white rounded-xl shadow-lg p-8 border-2" style={{ borderColor: 'var(--saffron-light)' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ color: 'var(--nature-green)' }}>
              📦 My Pickup Requests
            </h2>
            
            {loadingPickups ? (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: 'var(--nature-green)' }} />
                <p className="text-gray-600">Loading your pickups...</p>
              </div>
            ) : myPickups.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pickup requests yet. Create one to get started!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPickups.map((pickup) => (
                  <Card key={pickup._id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{pickup.temple}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pickup.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          pickup.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {pickup.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>🗑️ <strong>Type:</strong> {pickup.wasteType}</p>
                        <p>📦 <strong>Qty:</strong> {pickup.quantity} kg</p>
                        <p>📅 <strong>Date:</strong> {new Date(pickup.scheduleDate).toLocaleDateString('en-IN')}</p>
                        <p>📍 <strong>Address:</strong> {pickup.address}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(pickup.createdAt).toLocaleString('en-IN')}</p>
                      </div>

                      {(pickup.status === 'Approved' || pickup.status === 'Completed') && (
                        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 space-y-3">
                          <p className="font-semibold text-green-800">Live Pickup Tracking</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                            <p><strong>Volunteer:</strong> {pickup.assignedVolunteer || 'Assigned soon'}</p>
                            <p><strong>Vehicle:</strong> {pickup.vehicleNumber || 'Will be updated'}</p>
                            <p><strong>ETA:</strong> {pickup.estimatedArrival || 'Awaiting update'}</p>
                            <p><strong>Note:</strong> {pickup.trackingNote || 'Team will contact you shortly'}</p>
                            <p className="col-span-2"><strong>Current Location:</strong> {pickup.currentLocation || 'Pickup team is preparing route'}</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {getTrackingSteps(pickup.status).map((step) => (
                              <div key={step.label} className={`rounded-lg px-3 py-2 text-center text-xs font-medium ${step.done ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                                {step.label}
                              </div>
                            ))}
                          </div>
                          <div className="overflow-hidden rounded-xl border border-green-200 bg-white">
                            <iframe
                              title={`Pickup map ${pickup._id}`}
                              src={getMapEmbedUrl(pickup.mapQuery || pickup.currentLocation || pickup.address || pickup.temple)}
                              className="h-56 w-full"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.mapQuery || pickup.currentLocation || pickup.address || pickup.temple)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-semibold text-green-700 border border-green-200 hover:bg-green-100"
                            >
                              Open Live Pickup Map
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

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
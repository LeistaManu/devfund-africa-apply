import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

// Currency exchange rates (simplified - in real app would fetch from API)
const exchangeRates = {
  'Kenya': { currency: 'KSH', rate: 150 },
  'Zambia': { currency: 'ZMW', rate: 27 },
  'Tanzania': { currency: 'TZS', rate: 2500 },
  'Uganda': { currency: 'UGX', rate: 3700 },
  'Lebanon': { currency: 'LBP', rate: 15000 },
  'Sierra Leone': { currency: 'SLL', rate: 20000 },
  'Cameroon': { currency: 'XAF', rate: 620 },
  'Liberia': { currency: 'LRD', rate: 190 },
  'Others': { currency: 'USD', rate: 1 }
};

const GrantApplication = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    country: '',
    paymentLine: '',
    amount: 500, // Default amount in USD
    purpose: '',
    consent: false
  });

  const [registrationFee, setRegistrationFee] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState({ currency: 'USD', rate: 1 });

  // Calculate registration fee when amount or country changes
  useEffect(() => {
    const fee = formData.amount * 0.1; // 10% of amount
    if (formData.country && exchangeRates[formData.country]) {
      const countryInfo = exchangeRates[formData.country];
      setDisplayCurrency(countryInfo);
      setRegistrationFee(fee * countryInfo.rate);
    } else {
      setDisplayCurrency({ currency: 'USD', rate: 1 });
      setRegistrationFee(fee);
    }
  }, [formData.amount, formData.country]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.fullName || !formData.phone || !formData.email || !formData.age || !formData.gender || !formData.country) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!formData.paymentLine) {
          toast({
            title: "Payment Line Required",
            description: "Please select your payment line.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!formData.purpose.trim()) {
          toast({
            title: "Purpose Required",
            description: "Please describe the purpose of your grant.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4:
        if (!formData.consent) {
          toast({
            title: "Consent Required",
            description: "Please confirm your details are correct.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const submitApplication = () => {
    if (!validateCurrentStep()) return;

    const message = `Grant Application:%0A` +
      `Full Name: ${formData.fullName}%0A` +
      `Phone: ${formData.phone}%0A` +
      `Email: ${formData.email}%0A` +
      `Age: ${formData.age}%0A` +
      `Gender: ${formData.gender}%0A` +
      `Country: ${formData.country}%0A` +
      `Payment Line: ${formData.paymentLine}%0A` +
      `Amount Requested: $${formData.amount}%0A` +
      `Registration Fee: ${registrationFee.toFixed(2)} ${displayCurrency.currency}%0A` +
      `Purpose: ${formData.purpose}`;

    window.location.href = `https://wa.me/+254769999807?text=${message}`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="Zambia">Zambia</SelectItem>
                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                    <SelectItem value="Uganda">Uganda</SelectItem>
                    <SelectItem value="Lebanon">Lebanon</SelectItem>
                    <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Liberia">Liberia</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select Payment Line *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['MTN', 'AIRTEL', 'TIGO', 'SAFARICOM', 'VODACOM', 'ZAMTEL'].map((provider) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={provider}
                      name="paymentLine"
                      value={provider}
                      checked={formData.paymentLine === provider}
                      onChange={(e) => updateField('paymentLine', e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={provider} className="font-medium">{provider}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="amount" className="text-lg font-semibold">Grant Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => updateField('amount', Number(e.target.value))}
                placeholder="Enter grant amount in USD"
                min={10}
                max={5000}
              />
              <p className="text-sm text-muted-foreground">
                Enter an amount between $10 and $5,000
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Registration Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {registrationFee.toFixed(2)} {displayCurrency.currency}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This is the registration fee you need to pay
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Grant *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => updateField('purpose', e.target.value)}
                placeholder="Describe the purpose of your grant application..."
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Application</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Country:</strong> {formData.country}</p>
                <p><strong>Payment Line:</strong> {formData.paymentLine}</p>
                <p><strong>Grant Amount:</strong> ${formData.amount}</p>
                <p><strong>Registration Fee:</strong> {registrationFee.toFixed(2)} {displayCurrency.currency}</p>
                <p><strong>Purpose:</strong> {formData.purpose}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => updateField('consent', checked)}
              />
              <Label htmlFor="consent" className="text-sm">
                I confirm that all the information provided is correct and accurate.
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Banner at the top */}
      <div className="text-center mb-8">
        <img 
          src="images/prom2.jpg" 
          alt="Promotional Banner" 
          className="max-w-full h-auto rounded-lg mx-auto mb-4"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            {/* Logo */}
            <img 
              src="images/prologo.jpg" 
              alt="African Dev't Funds Logo" 
              className="w-32 h-auto mx-auto mb-4 rounded-lg"
            />
            <CardTitle className="text-2xl font-bold">African Dev't Funds</CardTitle>
            <p className="text-muted-foreground">Apply for Free Development Grants</p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Step {step} of 4</span>
                <span className="text-sm text-muted-foreground">
                  {step === 1 && 'Personal Information'}
                  {step === 2 && 'Payment Method'}
                  {step === 3 && 'Grant Details'}
                  {step === 4 && 'Review & Submit'}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={step === 1}
              >
                Back
              </Button>
              {step < 4 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitApplication} disabled={!formData.consent}>
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer image */}
      <div className="text-center mt-8">
        <img 
          src="images/transac2.jpeg" 
          alt="Transaction Proof" 
          className="max-w-full h-auto rounded-lg mx-auto"
        />
      </div>
    </div>
  );
};

export default GrantApplication;

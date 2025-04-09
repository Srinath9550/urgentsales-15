import { useState, useEffect } from "react";
import {
  Calculator,
  Info,
  PieChart,
  TrendingUp,
  Home,
  Calendar,
  DollarSign,
  Percent,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Gift, Shield } from "lucide-react";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [activeTab, setActiveTab] = useState("calculator");

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiValue =
      (principal *
        ratePerMonth *
        Math.pow(1 + ratePerMonth, numberOfPayments)) /
      (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);

    const totalPaymentValue = emiValue * numberOfPayments;
    const totalInterestValue = totalPaymentValue - principal;

    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalPayment(totalPaymentValue);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    min: number,
    max: number,
  ) => {
    const value = parseFloat(e.target.value.replace(/,/g, ""));
    if (!isNaN(value) && value >= min && value <= max) {
      setter(value);
    }
  };

  // Calculate percentages for the chart
  const principalPercentage =
    Math.round((loanAmount / totalPayment) * 100) || 0;
  const interestPercentage = 100 - principalPercentage;

  // Generate monthly EMI breakdown for first 12 months
  const generateMonthlyBreakdown = () => {
    const result = [];
    let remainingPrincipal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;

    for (let month = 1; month <= 12; month++) {
      const interestForMonth = remainingPrincipal * ratePerMonth;
      const principalForMonth = emi - interestForMonth;
      remainingPrincipal -= principalForMonth;

      result.push({
        month,
        emi: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingPrincipal > 0 ? remainingPrincipal : 0,
      });
    }

    return result;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section - Redesigned with new color scheme */}
        <div className="bg-blue-700 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  EMI Calculator
                </h1>
                <p className="text-lg opacity-90">
                  Calculate your monthly EMI payments based on loan amount,
                  interest rate, and tenure
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow-md text-gray-900">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">
                      Your Monthly EMI
                    </span>
                    <span className="text-2xl font-bold text-blue-700">
                      {formatCurrency(emi)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Interest: {formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Amount: {formatCurrency(totalPayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calculator Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Inputs */}
              <div className="lg:col-span-2 space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="loanAmount" className="text-gray-700 font-medium">Loan Amount (₹)</Label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={loanAmount.toLocaleString("en-IN")}
                        onChange={(e) =>
                          handleInputChange(e, setLoanAmount, 100000, 10000000)
                        }
                        className="w-28 h-8 text-right mr-2 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                      />
                    </div>
                  </div>
                  <Slider
                    id="loanAmount"
                    min={100000}
                    max={10000000}
                    step={100000}
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹1 Lakh</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="interestRate" className="text-gray-700 font-medium">Interest Rate (%)</Label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={interestRate}
                        onChange={(e) =>
                          handleInputChange(e, setInterestRate, 5, 20)
                        }
                        className="w-20 h-8 text-right mr-2 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <Slider
                    id="interestRate"
                    min={5}
                    max={20}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="loanTerm" className="text-gray-700 font-medium">Loan Term (Years)</Label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={loanTerm}
                        onChange={(e) =>
                          handleInputChange(e, setLoanTerm, 1, 30)
                        }
                        className="w-20 h-8 text-right mr-2 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                      />
                      <span>Years</span>
                    </div>
                  </div>
                  <Slider
                    id="loanTerm"
                    min={1}
                    max={30}
                    step={1}
                    value={[loanTerm]}
                    onValueChange={(value) => setLoanTerm(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Results with Circular Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Loan Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {formatCurrency(emi)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(totalInterest)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(totalPayment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                </div>

                {/* Improved Circular Chart for Payment Breakdown */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Payment Breakdown
                  </h4>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">
                            {principalPercentage}%
                          </div>
                          <div className="text-xs text-gray-500">Principal</div>
                        </div>
                      </div>
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full transform -rotate-90"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#E5E7EB"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#3B82F6"
                          strokeWidth="10"
                          strokeDasharray={`${principalPercentage * 2.83} 283`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#93C5FD"
                          strokeWidth="10"
                          strokeDasharray={`${interestPercentage * 2.83} 283`}
                          strokeDashoffset={`-${principalPercentage * 2.83}`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-600">
                          Principal
                        </div>
                        <div className="text-sm font-bold">
                          {formatCurrency(loanAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {principalPercentage}% of total
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center">
                      <div className="w-4 h-4 bg-blue-300 rounded-full mr-3"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-600">
                          Interest
                        </div>
                        <div className="text-sm font-bold">
                          {formatCurrency(totalInterest)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {interestPercentage}% of total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How EMI is Calculated Section - Added as requested */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">How EMI is Calculated</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  EMI (Equated Monthly Installment) is calculated using the
                  formula:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <p className="font-medium text-center mb-2">
                    EMI = [P × R × (1+R)^N]/[(1+R)^N-1]
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>
                      <strong>P</strong>: Principal loan amount
                    </li>
                    <li>
                      <strong>R</strong>: Monthly interest rate (Annual rate ÷
                      12 ÷ 100)
                    </li>
                    <li>
                      <strong>N</strong>: Total number of monthly installments
                      (Loan tenure in years × 12)
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  For example, if you take a loan of ₹25,00,000 at 8.5% for 20
                  years, your EMI would be approximately ₹21,700 per month.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    Factors Affecting EMI
                  </h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>
                      • <strong>Loan Amount</strong>: Higher loan amount leads
                      to higher EMI
                    </li>
                    <li>
                      • <strong>Interest Rate</strong>: Higher interest rate
                      increases your EMI
                    </li>
                    <li>
                      • <strong>Loan Tenure</strong>: Longer tenure reduces EMI
                      but increases total interest paid
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Tips to Reduce Your EMI
                  </h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>
                      • Make a larger down payment to reduce principal amount
                    </li>
                    <li>
                      • Maintain a good credit score to get lower interest rates
                    </li>
                    <li>
                      • Consider balance transfer to a bank offering lower
                      interest rates
                    </li>
                    <li>• Make partial prepayments whenever possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 12 Month EMI Breakdown Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              Monthly EMI Breakdown (First Year)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Month
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      EMI
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Principal
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Interest
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    const result = [];
                    let remainingPrincipal = loanAmount;
                    const ratePerMonth = interestRate / 12 / 100;

                    for (let month = 1; month <= 12; month++) {
                      const interestForMonth =
                        remainingPrincipal * ratePerMonth;
                      const principalForMonth = emi - interestForMonth;
                      remainingPrincipal -= principalForMonth;

                      result.push(
                        <tr
                          key={month}
                          className={
                            month % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {month}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-700">
                            {formatCurrency(emi)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(principalForMonth)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(interestForMonth)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(
                              remainingPrincipal > 0 ? remainingPrincipal : 0,
                            )}
                          </td>
                        </tr>,
                      );
                    }

                    return result;
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Featured Properties */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Properties You Might Like</h2>
              <Link href="/properties">
                <a className="text-primary text-sm font-medium">
                  View All Properties
                </a>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Property Card 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    For Sale
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">
                    3 BHK Apartment in Indiranagar
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Bangalore, Karnataka
                  </p>
                  <p className="text-primary font-bold mb-3">₹85,00,000</p>
                  <div className="flex text-sm text-gray-600 justify-between">
                    <span>3 Beds</span>
                    <span>2 Baths</span>
                    <span>1500 sq.ft</span>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    For Sale
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">
                    2 BHK Apartment in Koramangala
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Bangalore, Karnataka
                  </p>
                  <p className="text-primary font-bold mb-3">₹65,00,000</p>
                  <div className="flex text-sm text-gray-600 justify-between">
                    <span>2 Beds</span>
                    <span>2 Baths</span>
                    <span>1200 sq.ft</span>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    For Sale
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">
                    4 BHK Villa in Whitefield
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Bangalore, Karnataka
                  </p>
                  <p className="text-primary font-bold mb-3">₹1,25,00,000</p>
                  <div className="flex text-sm text-gray-600 justify-between">
                    <span>4 Beds</span>
                    <span>3 Baths</span>
                    <span>2500 sq.ft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Related Tools & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/property-validation">
                <a className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Property Validation</span>
                  </div>
                </a>
              </Link>
              <Link href="/tools/click-and-earn">
                <a className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">Click & Earn</span>
                  </div>
                </a>
              </Link>
              <Link href="/contact">
                <a className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Info className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Get Expert Advice</span>
                  </div>
                </a>
              </Link>
            </div>
          </div>

          {/* Additional Sections to Match Reference */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">
              Benefits of EMI Calculator
            </h2>
            <ul className="space-y-3">
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  Helps you plan your finances by knowing your monthly
                  commitment
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  Compare different loan options to find the most suitable one
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  Understand the impact of interest rates on your total
                  repayment
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  Make informed decisions about loan tenure and amount
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

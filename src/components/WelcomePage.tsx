import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  CreditCard,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDonations } from "@/hooks/useDonations";
import { useRequests } from "@/hooks/useRequests";
import { uploadFile } from "@/lib/supabase";

const WelcomePage = () => {
  const { user, profile } = useAuth();
  const { addDonation } = useDonations();
  const { addRequest } = useRequests();

  const [activeTab, setActiveTab] = useState<"donation" | "receive">(
    "donation",
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
  ]);
  const [imageSlideIndex, setImageSlideIndex] = useState(0);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [receiverDetails, setReceiverDetails] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const [donationForm, setDonationForm] = useState({
    title: "",
    foodType: "",
    quantity: "",
    address: "",
    description: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featuredStories = [
    {
      title: "Fresh Produce Donation",
      description:
        "Local farmers donated fresh vegetables to community food bank",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
      action: "Learn More",
    },
    {
      title: "Restaurant Partnership",
      description: "Downtown restaurants join our mission to reduce food waste",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
      action: "Learn More",
    },
    {
      title: "Community Impact",
      description: "Over 1000 meals distributed this month to families in need",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80",
      action: "Learn More",
    },
  ];

  const availableFoodItems = [
    "Fresh Vegetables",
    "Canned Goods",
    "Bread & Bakery Items",
    "Dairy Products",
    "Fruits",
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
    }, 5000);

    const imageInterval = setInterval(() => {
      setImageSlideIndex((prev) => (prev + 1) % availableImages.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(imageInterval);
    };
  }, [featuredStories.length, availableImages.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target?.result as string;
        setUploadedImage(newImage);
        setAvailableImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a donation");
      return;
    }

    if (
      !donationForm.title ||
      !donationForm.foodType ||
      !donationForm.quantity ||
      !donationForm.address
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!uploadedFile) {
      alert("Please upload an image of the food");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image to Supabase storage
      const fileName = `${user.id}/${Date.now()}_${uploadedFile.name}`;
      const { data: uploadData, error: uploadError } = await uploadFile(
        uploadedFile,
        "food-images",
        fileName,
      );

      if (uploadError) {
        throw new Error("Failed to upload image");
      }

      // Create donation record
      const { data, error } = await addDonation({
        title: donationForm.title,
        description: donationForm.description,
        food_type: donationForm.foodType,
        quantity: donationForm.quantity,
        pickup_address: donationForm.address,
        image_url: uploadData?.publicUrl,
        status: "available",
      });

      if (error) {
        throw new Error(error);
      }

      alert("Donation submitted successfully!");
      // Reset form
      setDonationForm({
        title: "",
        foodType: "",
        quantity: "",
        address: "",
        description: "",
      });
      setUploadedImage(null);
      setUploadedFile(null);
    } catch (error: any) {
      alert(`Error submitting donation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiveSubmit = () => {
    if (!user) {
      alert("Please login to request food");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one food item");
      return;
    }
    setShowServiceDialog(true);
  };

  const handleSelfService = async () => {
    setShowServiceDialog(false);

    try {
      const { data, error } = await addRequest({
        requested_items: selectedItems,
        delivery_address: profile?.address || "Self pickup",
        service_type: "self_service",
        payment_amount: 0,
        payment_status: "paid",
      });

      if (error) {
        throw new Error(error);
      }

      alert(
        "Request submitted successfully!\n\nLocation: 123 Main Street, Downtown\nContact: John Doe - 9876543210\nAvailable Items: " +
          selectedItems.join(", ") +
          "\nPickup Time: 2:00 PM - 6:00 PM",
      );
      setSelectedItems([]);
    } catch (error: any) {
      alert(`Error submitting request: ${error.message}`);
    }
  };

  const handlePlatformService = () => {
    setShowServiceDialog(false);
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !receiverDetails.name ||
      !receiverDetails.mobile ||
      !receiverDetails.address
    ) {
      alert("Please fill all required fields");
      return;
    }
    setShowDetailsForm(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const { data, error } = await addRequest({
        requested_items: selectedItems,
        delivery_address: receiverDetails.address,
        service_type: "platform_service",
        payment_amount: 59.0,
        payment_status: "paid",
      });

      if (error) {
        throw new Error(error);
      }

      setShowPayment(false);
      setShowMap(true);
      setSelectedItems([]);
      setReceiverDetails({ name: "", mobile: "", address: "" });
    } catch (error: any) {
      alert(`Error processing payment: ${error.message}`);
    }
  };

  const handleDetailsChange = (field: string, value: string) => {
    setReceiverDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleDonationFormChange = (field: string, value: string) => {
    setDonationForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredStories.length) % featuredStories.length,
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-50">
        <div
          className={`flex items-center transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <div className="text-2xl font-bold">
            <span className="text-white">food</span>
            <span className="text-orange-500">waste</span>
          </div>
        </div>

        <div
          className={`flex space-x-8 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
        >
          <button
            onClick={() => scrollToSection("hero")}
            className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          >
            Contact Us
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          >
            About Us
          </button>
          {user && (
            <div className="text-teal-400 font-medium">
              Welcome, {profile?.full_name || user.email}
            </div>
          )}
        </div>

        <div
          className={`w-10 h-10 bg-orange-500 rounded-full transform transition-all duration-1000 delay-500 ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        ></div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative px-8 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div
            className={`lg:w-1/2 transform transition-all duration-1000 delay-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8">
              WELCOME TO
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse">
                FOOD DONATION
              </span>
              <br />
              AND
              <br />
              MANAGEMENT
              <br />
              SYSTEM
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Join us in our mission to reduce food waste and help those in need
              through our innovative donation platform.
            </p>
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </div>
          <div
            className={`lg:w-1/2 transform transition-all duration-1000 delay-1000 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80"
                alt="Food donation"
                className="w-full max-w-lg h-auto rounded-2xl mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Donations Section */}
      <section className="px-8 py-20 bg-gradient-to-b from-[#0f1419] to-[#1a1f2e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Featured Donations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-16 rounded-full"></div>
        </div>
      </section>

      {/* Featured Stories Carousel */}
      <section className="px-8 py-16 bg-[#1a1f2e]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Featured Stories
          </h3>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredStories.map((story, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="flex flex-col lg:flex-row bg-[#2a2f3e] rounded-2xl overflow-hidden shadow-xl">
                      <div className="lg:w-1/2">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                      </div>
                      <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                        <h4 className="text-2xl font-bold text-white mb-4">
                          {story.title}
                        </h4>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {story.description}
                        </p>
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium w-fit transform hover:scale-105 transition-all duration-300">
                          {story.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Make a Difference Section */}
      <section
        id="donation"
        className="px-8 py-20 bg-gradient-to-b from-[#1a1f2e] to-[#0f1419]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Make a Difference Today
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-16 rounded-full"></div>

          <div className="bg-[#2a2f3e] rounded-3xl p-8 shadow-2xl">
            <div className="flex space-x-4 mb-8">
              <button
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "donation"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                onClick={() => setActiveTab("donation")}
              >
                Donation
              </button>
              <button
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "receive"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                onClick={() => setActiveTab("receive")}
              >
                Receive
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {activeTab === "donation" ? (
                <>
                  <div className="lg:w-1/2 space-y-6">
                    <form onSubmit={handleDonationSubmit}>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Donation Title *
                        </label>
                        <Input
                          value={donationForm.title}
                          onChange={(e) =>
                            handleDonationFormChange("title", e.target.value)
                          }
                          className="bg-[#3a3f4e] border-gray-600 text-white h-12 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                          placeholder="e.g., Fresh vegetables from restaurant"
                          required
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Type of Items *
                        </label>
                        <Input
                          value={donationForm.foodType}
                          onChange={(e) =>
                            handleDonationFormChange("foodType", e.target.value)
                          }
                          className="bg-[#3a3f4e] border-gray-600 text-white h-12 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                          placeholder="e.g., Fresh vegetables, Canned goods"
                          required
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Quantity of food *
                        </label>
                        <Input
                          value={donationForm.quantity}
                          onChange={(e) =>
                            handleDonationFormChange("quantity", e.target.value)
                          }
                          className="bg-[#3a3f4e] border-gray-600 text-white h-12 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                          placeholder="e.g., 10 kg, 50 portions"
                          required
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Pickup Address *
                        </label>
                        <Textarea
                          value={donationForm.address}
                          onChange={(e) =>
                            handleDonationFormChange("address", e.target.value)
                          }
                          className="bg-[#3a3f4e] border-gray-600 text-white h-24 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                          placeholder="Enter your full address"
                          required
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Description
                        </label>
                        <Textarea
                          value={donationForm.description}
                          onChange={(e) =>
                            handleDonationFormChange(
                              "description",
                              e.target.value,
                            )
                          }
                          className="bg-[#3a3f4e] border-gray-600 text-white h-24 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                          placeholder="Additional details about the food donation"
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-105 mb-6">
                        <label className="block mb-3 text-white font-medium">
                          Proof*{" "}
                          <span className="text-sm text-gray-400">
                            (Please provide an image of food for security
                            purpose)
                          </span>
                        </label>
                        <div className="flex flex-col space-y-2">
                          <input
                            type="file"
                            id="proof"
                            className="hidden"
                            onChange={handleImageUpload}
                            accept="image/*"
                            required
                          />
                          <label
                            htmlFor="proof"
                            className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 text-center transition-all duration-300 font-medium transform hover:scale-105"
                          >
                            <Upload size={20} />
                            Click to upload or drag and drop
                          </label>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-12 py-4 rounded-lg font-semibold text-lg mt-8 w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : !user
                            ? "Login to Submit"
                            : "Submit Donation"}
                      </Button>
                    </form>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="bg-[#3a3f4e] h-80 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-500 transition-all duration-300 hover:border-teal-500">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Uploaded food"
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl text-gray-500 mb-4">📷</div>
                          <p className="text-gray-400 font-medium">
                            Image Preview
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            No image uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:w-1/2 space-y-6">
                    <div className="transform transition-all duration-300">
                      <h3 className="text-white font-medium text-lg mb-4">
                        AVAILABLE FOOD ITEMS:
                      </h3>
                      <div className="space-y-3">
                        {availableFoodItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              id={`item-${index}`}
                              checked={selectedItems.includes(item)}
                              onChange={() => handleItemSelection(item)}
                              className="w-5 h-5 text-teal-600 bg-[#3a3f4e] border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`item-${index}`}
                              className="text-white font-medium cursor-pointer hover:text-teal-400 transition-colors duration-300"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="transform transition-all duration-300">
                      <h3 className="text-white font-medium text-lg mb-2">
                        SELECTED FOOD QUANTITY:
                      </h3>
                      <p className="text-teal-400 font-semibold text-xl">
                        {selectedItems.length} items selected
                      </p>
                    </div>
                    <Button
                      onClick={handleReceiveSubmit}
                      disabled={!user}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-12 py-4 rounded-lg font-semibold text-lg mt-8 w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!user ? "Login to Submit" : "SUBMIT"}
                    </Button>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="bg-gray-300 h-80 rounded-2xl flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {availableImages.length > 0 ? (
                          <div className="relative w-full h-full">
                            <img
                              src={availableImages[imageSlideIndex]}
                              alt="Available food item"
                              className="w-full h-full object-cover transition-opacity duration-1000"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                              <div className="text-center text-white">
                                <p className="text-lg font-medium mb-2">
                                  Available food item
                                </p>
                                <p className="text-sm">images in sliding</p>
                                <p className="text-sm">animation</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-600"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Selection Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="bg-[#2a2f3e] border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-6">
              Choose Service Type
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={handleSelfService}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transform hover:scale-105 transition-all duration-300"
            >
              <Navigation size={20} />
              Self Service (Free)
            </Button>
            <Button
              onClick={handlePlatformService}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transform hover:scale-105 transition-all duration-300"
            >
              <MapPin size={20} />
              Platform Service (₹50)
            </Button>
          </div>
          <p className="text-gray-400 text-sm text-center mt-4">
            Self Service: Navigate to donation location yourself
            <br />
            Platform Service: We'll deliver to your location
          </p>
        </DialogContent>
      </Dialog>

      {/* Receiver Details Form Dialog */}
      <Dialog open={showDetailsForm} onOpenChange={setShowDetailsForm}>
        <DialogContent className="bg-[#2a2f3e] border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-6">
              Enter Your Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <Label className="text-white font-medium mb-2 block">
                Full Name *
              </Label>
              <Input
                value={receiverDetails.name}
                onChange={(e) => handleDetailsChange("name", e.target.value)}
                className="bg-[#3a3f4e] border-gray-600 text-white h-12 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label className="text-white font-medium mb-2 block">
                Mobile Number *
              </Label>
              <Input
                value={receiverDetails.mobile}
                onChange={(e) => handleDetailsChange("mobile", e.target.value)}
                className="bg-[#3a3f4e] border-gray-600 text-white h-12 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your mobile number"
                type="tel"
                required
              />
            </div>
            <div>
              <Label className="text-white font-medium mb-2 block">
                Delivery Address *
              </Label>
              <Textarea
                value={receiverDetails.address}
                onChange={(e) => handleDetailsChange("address", e.target.value)}
                className="bg-[#3a3f4e] border-gray-600 text-white h-24 rounded-lg resize-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your complete delivery address"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300"
            >
              Proceed to Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-[#2a2f3e] border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <CreditCard size={24} />
              Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-[#3a3f4e] p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Platform Service Fee</span>
                <span>₹50.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>GST (18%)</span>
                <span>₹9.00</span>
              </div>
              <hr className="border-gray-600 my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹59.00</span>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white font-medium">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-[#3a3f4e] hover:bg-[#4a4f5e] text-white py-3 border border-gray-600">
                  UPI
                </Button>
                <Button className="bg-[#3a3f4e] hover:bg-[#4a4f5e] text-white py-3 border border-gray-600">
                  Card
                </Button>
              </div>
            </div>
            <Button
              onClick={handlePaymentSuccess}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300"
            >
              Pay ₹59.00
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Dialog */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="bg-[#2a2f3e] border-gray-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-6">
              Delivery Tracking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-[#3a3f4e] p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-teal-400">
                Delivery Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Delivery Boy:</span>
                  <span className="text-teal-400">Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="text-teal-400">+91 9876543210</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance from Donation Location:</span>
                  <span className="text-teal-400">2.3 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Pickup Time:</span>
                  <span className="text-teal-400">15 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery Time:</span>
                  <span className="text-teal-400">45 minutes</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
              <div className="relative z-10 text-center text-gray-700">
                <MapPin size={48} className="mx-auto mb-2 text-red-500" />
                <p className="font-semibold">Live Tracking Map</p>
                <p className="text-sm">Delivery boy is on the way</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="text-xs">Donation Location</div>
                </div>
                <div className="mt-2 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="text-xs">Delivery Boy</div>
                </div>
                <div className="mt-2 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="text-xs">Your Location</div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowMap(false)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Close Tracking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Us Section */}
      <section id="about" className="px-8 py-20 bg-[#0f1419]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">ABOUT US</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-16 rounded-full"></div>
          <div className="bg-[#1a1f2e] rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <p className="text-gray-300 leading-relaxed text-lg">
              A food wastage management and donation web app serves as a vital
              bridge between surplus food and those in need, tackling one of the
              world's most pressing issues: food waste. This platform enables
              restaurants, supermarkets, and households to donate excess food
              instead of discarding it, ensuring that edible food reaches
              charitable organizations, shelters, and individuals facing food
              insecurity.
            </p>
            <br />
            <p className="text-gray-300 leading-relaxed text-lg">
              Leveraging real-time tracking, location-based matching, and smart
              inventory management, the app streamlines donations, minimizes
              waste, and promotes sustainable consumption. By fostering
              community engagement and collaboration, it empowers individuals
              and businesses to contribute to a zero-waste future, reducing
              environmental impact while making a meaningful difference in
              people's lives.
            </p>
            <br />
            <p className="text-gray-300 leading-relaxed text-lg">
              Given your passion for social impact through web applications,
              this could be an exciting opportunity for you to integrate
              automation and interactive UI elements into a truly purpose-driven
              project! 🚀
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        id="contact"
        className="px-8 py-20 bg-gradient-to-b from-[#0f1419] to-[#1a1f2e]"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">CONTACT US</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-16 rounded-full"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mb-16 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer">
              📘
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer">
              📷
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer">
              🐦
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer">
              💬
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-[#2a2f3e] rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl">
              <h3 className="font-bold mb-6 text-white text-xl">Co-founders</h3>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-white transition-colors duration-300">
                  Gireejesh Nilesh
                </p>
                <p className="hover:text-white transition-colors duration-300">
                  Gugulothu Ganesh
                </p>
                <p className="hover:text-white transition-colors duration-300">
                  Gurram VaraLaxmi
                </p>
              </div>
            </div>
            <div className="bg-[#2a2f3e] rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl">
              <h3 className="font-bold mb-6 text-white text-xl">
                Customer Care
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-white transition-colors duration-300">
                  Mobile: 9346644222
                </p>
                <p className="hover:text-white transition-colors duration-300">
                  Email: nileshshakhya@gmail.com
                </p>
              </div>
            </div>
            <div className="bg-[#2a2f3e] rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl">
              <h3 className="font-bold mb-6 text-white text-xl">
                Location/Services
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-white transition-colors duration-300">
                  Our Services: Hyderabad
                </p>
              </div>
            </div>
          </div>

          <p className="mt-16 text-gray-500 text-sm">
            2025 All Rights Reserved
          </p>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;

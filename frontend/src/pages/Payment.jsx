import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Payment = () => {
  const navigate = useNavigate();

  



  // Payment Handler
  const handlePayment = async () => {
    try {
      const price = localStorage.getItem("price");
      if (!price) {
        showToast("Price not found!","info")
        return;
      }

      // Create Razorpay Order
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: price, // Amount in INR
          currency: "INR",
          receipt: "receipt_001",
        }
      );

      // Razorpay Options
      const options = {
        key: "rzp_test_VokWRKJcLaw2Fy", // Replace with live key in production
        amount: order.amount,
        currency: order.currency,
        name: "EliteAI Tools",
        description: "Payment for your order",
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify Payment
            const verification = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              response
            );

            if (verification.data.status === "Payment verified") {
              showToast("Payment Successful!","success");
              // Navigate to Success Page
              navigate("/payment-success");
            } else {
              
              showToast("Payment verification failed","error")
            }
          } catch (error) {
            console.error("Payment verification error:", error.message);
            showToast("Payment verification failed","error")
          }
        },
        prefill: {
          name: "Dillesh",
          email: "dillesh@gmail.com",
          contact: "1234567890",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error.message);
      showToast("Payment failed","error")
    }
  };

  return (
    <div className="flex items-center w-screen justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300">
        <h2 className="mb-6 text-4xl font-extrabold text-gray-800 animate-fade-in">
          Complete Your Payment
        </h2>

        <p className="mb-8 text-lg text-gray-600">
          Secure and fast checkout for your purchase.
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4781/4781517.png"
            alt="Fast"
            className="w-10 h-10 animate-bounce delay-150"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Reliable"
            className="w-10 h-10 animate-bounce delay-300"
          />
        </div>

        <div
          onClick={handlePayment}
          className="inline-block px-8 py-4 text-lg font-semibold text-black !bg-yellow-400 rounded-xl shadow-md hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform duration-300 animate-pulse"
        >
          Pay Now
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Your information is securely processed.
        </p>

        <div className="mt-8 text-sm text-gray-600">
          Need help?{" "}
          <a href="/chat" className="text-blue-500 hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Payment;
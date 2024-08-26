import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
// import apiClient from "@/lib/api-client";
// import { SIGNUP_ROUTE } from "@/utils/constant";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const validateSignup = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords should be same");
      return false;
    }
    return true;
  };
  const validateLogin= () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
   
    return true;
  };
// const handleSignup = async (e) => {
//   e.preventDefault(); // Prevent default form submission behavior
//   if (validateSignup()) {
//     // alert("done");
//     await apiClient.post(SIGNUP_ROUTE ,{email,password})

//   }
// };
const handleSignup = async (e) => {
  e.preventDefault(); // Prevent default form submission

  if (validateSignup()) {
    try {
      // const response = await axios.post("http://localhost:3001/api/auth/signup", { email, password });

      const response = await axios.post(
        "http://localhost:3001/api/auth/signup",
        { email, password },
        { withCredentials: true } // Add this line to include credentials
      );

 

    
      if (response.status === 201) {
        // Display success toast to the user
        toast.success("Account created successfully!");
        navigate ("/profile");
        
        // Optionally clear form fields or redirect
        setEmail("");
        setPassword("");
        setConfirmpassword("");

        // You can redirect the user or perform other actions if needed
        // window.location.href = '/login';
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already in use. Please try a different one.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  }
};


//  HandleLogin
const handleLogin = async (e) => {
  e.preventDefault(); // Prevent default form submission

  if (validateLogin()) {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email, password },
        { withCredentials: true } // Add this line to include credentials
      );// Ensure that cookies are sent and received);
    



      if (response.status === 200) { // Login typically returns 200 OK
        // Display success toast to the user
        toast.success("Login successful!");

        const user = response.data.user;
        if (user && user.id) {
          if (user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        } else {
          toast.error("Invalid user data. Please try again.");
        }
      
        // Optionally clear form fields or redirect
        setEmail("");
        setPassword("");

        // Redirect the user or perform other actions if needed
        // window.location.href = '/dashboard'; // Redirect to a protected page
      }
    } catch (error) {
      if (error.response) {
        // Handle different HTTP error statuses
        if (error.response.status === 400) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error("An error occured . Please try again later.");
        }
      } else {
        // Handle network or other errors
        toast.error("An error . Please try again later.");
      }
    }
  }
};






  return (
    <div className="min-h-screen flex justify-center items-center" style={{backgroundColor:"#1e1b1b"}}>
      <div className="flex justify-center items-center w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        {/* Left Side: Text and Form */}
        <div>
          <div className="text-4xl font-semibold mb-8 text-center">
            Welcome
          </div>
          <Tabs defaultValue="account">
            <TabsList className="flex justify-center mb-4">
              <TabsTrigger
                value="account"
                className="px-4 py-2 font-semibold text-gray-700 hover:text-white hover:bg-black rounded"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="px-4 py-2 font-semibold text-gray-700 hover:text-white hover:bg-black rounded"
              >
                Login
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </form>
            </TabsContent>
            <TabsContent value="password">
              <form className="space-y-4"  onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 hidden md:block ml-14">
          <img
            src="/src/assets/chatimage.png"
            alt="Chat Illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;

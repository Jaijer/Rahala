import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, deleteUser  } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import SignUpForm from './components/SignUpForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import { toast } from 'react-toastify'; // Import the toast function
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function UserLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [form, setForm] = useState("login");

  // Google sign-in
  async function onGoogleClick() {
    const provider = new GoogleAuthProvider();
    try {
        // Sign in with Google
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign-In Success:", result.user);
        
        const email = result.user.email;
        const displayName = result.user.displayName;
        
        // Check if AuthUser and User already exist in the database
        const authUserExists = await api.get(`/api/auth/${email}`).then(res => !!res.data).catch(error => {
            if (error.response && error.response.status === 404) return false;
            console.error("Error checking AuthUser:", error);
            throw new Error("Failed to check AuthUser in MongoDB");
        });

        const userExists = await api.get(`/api/users/email/${email}`).then(res => !!res.data).catch(error => {
            if (error.response && error.response.status === 404) return false;
            console.error("Error checking User:", error);
            throw new Error("Failed to check User in MongoDB");
        });

        // Create AuthUser and User only if they don't exist
        if (!authUserExists && !userExists) {
            // Create AuthUser in MongoDB
            await createAuthUser(email, "user");
            // Create User in MongoDB
            await createUser(email, displayName);
        } 
        toast.success("تم التسجيل بنجاح"); // Show success toast
        navigate('/');
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        toast.error("فشل تسجيل الدخول"); // Show error toast
    }
}


  // Email/password sign-in
  async function onLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success:", userCredential.user);
      toast.success("تم التسجيل بنجاح"); // Show success toast
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error("فشل تسجيل الدخول"); // Show error toast
    }
  }

  // Email/password sign-up
  async function onSignUp() {
    let userCredential;

    try {
        // Create Firebase user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign-Up Success:", userCredential.user);

        // Create AuthUser in MongoDB
        await createAuthUser(userCredential.user.email, "user");
        // Create User in MongoDB
        await createUser(userCredential.user.email, name, phoneNumber);

        toast.success("تم إنشاء الحساب بنجاح"); // Show success toast
        navigate('/');
    } catch (error) {
        console.error("Sign-Up Error:", error.message);
        toast.error("فشل إنشاء الحساب"); // Show error toast

        // Rollback: delete Firebase user if created
        if (userCredential) {
            try {
                await deleteUser(userCredential.user);
                console.log("Rolled back Firebase user creation.");
            } catch (deleteError) {
                console.error("Error rolling back Firebase user:", deleteError.message);
            }
        }

        // Rollback: delete MongoDB entries
        try {
            await deleteAuthUser(userCredential?.user.email);
            await deleteUserInDB(userCredential?.user.email);
            console.log("Rolled back MongoDB entries.");
        } catch (deleteError) {
            console.error("Error rolling back MongoDB entries:", deleteError.message);
        }
    }
}

// Function to create AuthUser in MongoDB
async function createAuthUser(email, userType) {
    try {
        const response = await api.post('/api/auth', { email, userType });
        console.log("AuthUser created:", response.data);
    } catch (error) {
        console.error("Error creating AuthUser:", error);
        throw new Error("Failed to create AuthUser in MongoDB");
    }
}

// Function to create User in MongoDB
async function createUser(email, name, phoneNumber) {
    try {
        const response = await api.post('/api/users', { email, name, phoneNumber });
        console.log("User created:", response.data);
    } catch (error) {
        console.error("Error creating User:", error);
        throw new Error("Failed to create User in MongoDB");
    }
}

// Function to delete AuthUser in MongoDB
async function deleteAuthUser(email) {
    try {
      await api.delete(`/api/auth/${email}`);
      console.log("AuthUser deleted from MongoDB");
    } catch (error) {
        console.error("Error deleting AuthUser:", error);
    }
}

// Function to delete User in MongoDB
async function deleteUserInDB(email) {
    try {
      await api.delete(`/api/users/${email}`);
      console.log("User deleted from MongoDB");
    } catch (error) {
        console.error("Error deleting User:", error);
    }
}

  return (
    <div className='h-full flex justify-center items-center bg-darkGreen flex-grow py-4 w-full'>
      {form === "login" ? (
        <LoginForm 
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onGoogleClick={onGoogleClick}
          onLogin={onLogin}
          setForm={setForm}
        />
      ) : form === "reset" ? (
        <ResetPasswordForm 
          email={email}
          setEmail={setEmail}
          setForm={setForm}
        />
      ) : 
      
      (

        <SignUpForm 
          name={name}
          email={email}
          password={password}
          phoneNumber={phoneNumber}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          setPhoneNumber={setPhoneNumber}
          onGoogleClick={onGoogleClick}
          onSignUp={onSignUp}
          setForm={setForm}
        />
      )}
    </div>
  );
}

export default UserLogin;

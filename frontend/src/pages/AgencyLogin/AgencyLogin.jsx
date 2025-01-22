import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { toast } from 'react-toastify';
import SignUpForm from './components/SignUpForm';
import { auth } from '../../firebase/firebase';
import api from '../../api/axios';

function AgencyLogin() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();

    const onSignUp = async () => {
        let userCredential;
        try {
            // Create user in Firebase Authentication
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Sign-Up Success:", userCredential.user);

            // Create AuthUser in MongoDB
            await createAuthUser(userCredential.user.email, "agency");

            // Create Agency in MongoDB
            await createAgency(userCredential.user.email, name, phoneNumber, address);

            toast.success("تم إنشاء الحساب بنجاح");
            navigate('/');
        } catch (error) {
            console.error("Sign-Up Error:", error.message);
            toast.error("فشل إنشاء الحساب");

            // Rollback if there was an error
            if (userCredential) await deleteUser(userCredential.user);
            await deleteAuthUser(userCredential?.user.email);
            await deleteAgencyInDB(email);
        }
    };

    const createAuthUser = async (email, userType) => {
        try {
            const response = await api.post('/api/auth', { email, userType });
            console.log("AuthUser created:", response.data);
        } catch (error) {
            console.error("Error creating AuthUser:", error);
            throw new Error("Failed to create AuthUser in MongoDB");
        }
    };

    const createAgency = async (email, name, phoneNumber, address) => {
        try {
            const response = await api.post('/api/agencies', { email, name, phoneNumber, address });
            console.log("Agency created:", response.data);
        } catch (error) {
            console.error("Error creating Agency:", error);
            throw new Error("Failed to create Agency in MongoDB");
        }
    };

    const deleteAuthUser = async (email) => {
        if (!email) return;
        try {
            await api.delete(`/api/auth/email/${email}`);
            console.log("AuthUser deleted");
        } catch (error) {
            console.error("Error deleting AuthUser:", error);
        }
    };

    const deleteAgencyInDB = async (email) => {
        if (!email) return;
        try {
            await api.delete(`/api/agencies/email/${email}`);
            console.log("Agency deleted from MongoDB");
        } catch (error) {
            console.error("Error deleting Agency from MongoDB:", error);
        }
    };

    return (
        <div className='h-full flex justify-center items-center bg-darkGreen flex-grow py-4 w-full'>
            <SignUpForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                address={address}
                setAddress={setAddress}
                onSignUp={onSignUp}
            />
        </div>
    );
}

export default AgencyLogin;

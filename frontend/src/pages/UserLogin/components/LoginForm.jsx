import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react'; // Add Spinner if available in Next UI
import { FcGoogle } from 'react-icons/fc'; // For Google Icon
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import ResetPasswordForm from './ResetPasswordForm';

const LoginForm = ({ email, password, setEmail, setPassword, onGoogleClick, onLogin, setForm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validation functions
    const validateEmail = (inputEmail) => {
        if (!inputEmail) return 'البريد الإلكتروني مطلوب';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail)) return 'برجاء إدخال بريد إلكتروني صحيح';
        return '';
    };

    const validatePassword = (inputPassword) => {
        if (!inputPassword) return 'كلمة المرور مطلوبة';
        if (inputPassword.length < 8) return 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
        return '';
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setErrors((prev) => ({
            ...prev,
            email: validateEmail(inputEmail)
        }));
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
        setErrors((prev) => ({
            ...prev,
            password: validatePassword(inputPassword)
        }));
    };

    const handleLogin = async () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (!emailError && !passwordError) {
            setLoading(true); // Start loading
            try {
                await onLogin(); // Ensure onLogin is an async function if you have network calls
            } finally {
                setLoading(false); // End loading
            }
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div onKeyDown={handleKeyDown} className="bg-whity rounded-3xl flex flex-col p-12 gap-8 items-center justify-center md:min-w-[500px] w-full mx-4 md:w-auto md:mx-0">
            <div className="flex gap-2 items-center">
                <h3 className="lg:text-3xl text-2xl font-bold">رحالة</h3>
                <img src="/logo.png" alt="Rahala Logo" className="h-20 w-20" />
            </div>

            <div className="flex flex-col gap-4 w-full">
                <Button
                    onClick={onGoogleClick}
                    radius="full"
                    variant="bordered"
                    className="text-lg py-6 flex items-center gap-3 outline-black border-none"
                >
                    <span>سجل بإسخدام قوقل</span>
                    <FcGoogle className="text-2xl" />
                </Button>

                <div className="flex items-center my-4 text-black">
                    <hr className="flex-grow border-t border-black" />
                    <span className="px-4">أو</span>
                    <hr className="flex-grow border-t border-black" />
                </div>

                {/* Email input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="email"
                        variant="bordered"
                        label="الإيميل"
                        placeholder="أدخل الإيميل"
                        value={email}
                        onChange={handleEmailChange}
                        className="bg-white border-black"
                        isInvalid={!!errors.email}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                {/* Password input */}
                <div className="flex flex-col gap-1">
                    <Input
                        label="كلمة المرور"
                        variant="bordered"
                        placeholder="أدخل كلمة المرور"
                        value={password}
                        onChange={handlePasswordChange}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label="toggle password visibility"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={showPassword ? 'text' : 'password'}
                        className="bg-white border-black"
                        isInvalid={!!errors.password}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <Button
                    onClick={handleLogin}
                    radius="full"
                    className="bg-[#6961EF] text-white mt-4 text-lg py-6"
                    disabled={loading} // Disable while loading
                    isLoading={loading}
                >
                    {'سجل دخول'}
                </Button>

                <div className="flex gap-2 justify-center items-center mt-2">
                    <span>ماعندك حساب؟</span>
                    <a onClick={() => setForm('signUp')} className="text-[#6961EF] hover:cursor-pointer">
                        سجل حساب جديد
                    </a>
                </div>
                <div className="flex gap-2 justify-center items-center mt-2">
                    {/* <span>نسيت كلمة السر؟</span> */}
                    <a onClick={() => setForm('reset')} className="text-[#6961EF] hover:cursor-pointer">
                    نسيت كلمة السر
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

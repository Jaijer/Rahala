import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function SignUpForm({ name, email, password, phoneNumber, setName, setEmail, setPassword, setPhoneNumber, onGoogleClick, onSignUp, setForm }) {
    const [showPassword, setShowPassword] = useState(false);

    // Validation state
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validation functions
    const validateName = (inputName) => {
        if (!inputName) return 'الاسم مطلوب';
        if (inputName.length < 2) return 'يجب أن يكون الاسم أكثر من حرفين';
        if (inputName.length > 50) return 'يجب أن يكون الاسم أقل من 50 حرفًا';
        return '';
    };

    const validateEmail = (inputEmail) => {
        if (!inputEmail) return 'البريد الإلكتروني مطلوب';

        // Basic email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail)) return 'برجاء إدخال بريد إلكتروني صحيح';

        return '';
    };

    const validatePassword = (inputPassword) => {
        if (!inputPassword) return 'كلمة المرور مطلوبة';
        if (inputPassword.length < 8) return 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
        return '';
    };

    const validatePhoneNumber = (inputPhoneNumber) => {
        if (!inputPhoneNumber) return 'رقم الهاتف مطلوب';
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(inputPhoneNumber)) return 'برجاء إدخال رقم هاتف صحيح';
        return '';
    };

    const handleNameChange = (e) => {
        const inputName = e.target.value;
        setName(inputName);
        setErrors(prev => ({
            ...prev,
            name: validateName(inputName)
        }));
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setErrors(prev => ({
            ...prev,
            email: validateEmail(inputEmail)
        }));
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
        setErrors(prev => ({
            ...prev,
            password: validatePassword(inputPassword)
        }));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        // Allow only one '+' at the start and numbers
        const cleaned = value.replace(/\+/g, '').replace(/[^\d]/g, '');
        setPhoneNumber(cleaned ? `${cleaned}` : cleaned);
        setErrors(prev => ({
            ...prev,
            phoneNumber: validatePhoneNumber(cleaned ? `${cleaned}` : cleaned)
        }));
    };

    const handleSignUp = () => {
        // Validate all fields before signing up
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const phoneNumberError = validatePhoneNumber(phoneNumber);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            phoneNumber: phoneNumberError
        });

        // Only proceed with sign up if no errors
        if (!nameError && !emailError && !passwordError && !phoneNumberError) {
            onSignUp();
        }
    };

    return (
        <div className='bg-whity rounded-3xl flex flex-col p-12 gap-8 items-center justify-center md:min-w-[500px] w-full mx-4 md:w-auto md:mx-0'>
            <div className="flex gap-2 items-center">
                <h3 className="lg:text-3xl text-2xl font-bold">رحالة</h3>
                <img src="/logo.png" alt="Rahala Logo" className="h-20 w-20" />
            </div>

            <div className="flex flex-col gap-4 w-full">
                <Button
                    onClick={onGoogleClick}
                    radius="full"
                    variant='bordered'
                    className='text-lg py-6 flex items-center gap-3 outline-black border-none'
                >
                    <span>سجل بإسخدام قوقل</span>
                    <FcGoogle className='text-2xl' />
                </Button>

                <div className="flex items-center my-4 text-black">
                    <hr className="flex-grow border-t border-black" />
                    <span className="px-4">أو</span>
                    <hr className="flex-grow border-t border-black" />
                </div>

                {/* Name input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="text"
                        variant="bordered"
                        label="الاسم"
                        placeholder="أدخل اسمك"
                        value={name}
                        onChange={handleNameChange}
                        className='bg-white border-black'
                        isInvalid={!!errors.name} // Check if there's an error
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
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
                        className='bg-white border-black'
                        isInvalid={!!errors.email} // Check if there's an error
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                {/* Phone number input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="text"
                        variant="bordered"
                        label="رقم الجوال"
                        placeholder="05XXXXXXXX"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className='bg-white border-black text-right'
                        isInvalid={!!errors.phoneNumber} // Check if there's an error
                        maxLength={10}
                    />
                    {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
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
                        type={showPassword ? "text" : "password"}
                        className="bg-white border-black"
                        isInvalid={!!errors.password} // Check if there's an error
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <Button
                    onClick={handleSignUp}
                    radius="full"
                    className='bg-[#6961EF] text-white mt-4 text-lg py-6'
                >
                    إنشاء حساب جديد
                </Button>

                <div className="flex gap-2 justify-center items-center mt-2">
                    <span>عندك حساب؟</span>
                    <a onClick={() => setForm("login")} className='text-[#6961EF] hover:cursor-pointer'>سجل دخول</a>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;

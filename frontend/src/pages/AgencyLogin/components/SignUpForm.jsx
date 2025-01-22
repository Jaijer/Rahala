import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function AgencySignUpForm({ 
    name, 
    email, 
    password, 
    phoneNumber, 
    address, 
    setName, 
    setEmail, 
    setPassword, 
    setPhoneNumber, 
    setAddress, 
    onSignUp 
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: ''
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
        const saudiPhoneRegex = /^05\d{8}$/;
        if (!saudiPhoneRegex.test(inputPhoneNumber)) return 'برجاء إدخال رقم هاتف سعودي صحيح بصيغة 05XXXXXXXX';
        return '';
    };

    const validateAddress = (inputAddress) => {
        if (!inputAddress) return 'العنوان مطلوب';
        return '';
    };

    const handleInputChange = (setter, validator, field) => (e) => {
        const value = e.target.value;
        setter(value);
        setErrors(prev => ({ ...prev, [field]: validator(value) }));
    };

    const handleSignUp = async () => {
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            phoneNumber: validatePhoneNumber(phoneNumber),
            address: validateAddress(address)
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(Boolean)) {
            setLoading(true); 
            try {
                await onSignUp(); 
            } finally {
                setLoading(false); 
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };

    return (
        <div onKeyDown={handleKeyDown} className='bg-whity rounded-3xl flex flex-col p-12 gap-8 items-center justify-center md:min-w-[500px] w-full mx-4 md:w-auto md:mx-0'>
            <div className="flex gap-2 items-center">
                <h3 className="lg:text-3xl text-2xl font-bold">رحالة</h3>
                <img src="/logo.png" alt="Rahala Logo" className="h-20 w-20" />
            </div>

            <div className="flex flex-col gap-4 w-full">
                {/* Name input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="text"
                        variant="bordered"
                        label="اسم الحملة"
                        placeholder="أدخل اسم الحملة"
                        value={name}
                        onChange={handleInputChange(setName, validateName, 'name')}
                        className='bg-white border-black'
                        isInvalid={!!errors.name}
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
                        onChange={handleInputChange(setEmail, validateEmail, 'email')}
                        className='bg-white border-black'
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
                        onChange={handleInputChange(setPassword, validatePassword, 'password')}
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
                        isInvalid={!!errors.password}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                {/* Phone input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="text"
                        variant="bordered"
                        label="رقم الهاتف"
                        placeholder="05XXXXXXXX"
                        value={phoneNumber}
                        onChange={handleInputChange(setPhoneNumber, validatePhoneNumber, 'phoneNumber')}
                        className='bg-white border-black'
                        isInvalid={!!errors.phoneNumber}
                        maxLength={10}
                    />
                    {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
                </div>

                {/* Address input */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="text"
                        variant="bordered"
                        label="العنوان"
                        placeholder="أدخل العنوان"
                        value={address}
                        onChange={handleInputChange(setAddress, validateAddress, 'address')}
                        className='bg-white border-black'
                        isInvalid={!!errors.address}
                    />
                    {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                </div>

                <Button
                    onClick={handleSignUp}
                    radius="full"
                    className='bg-[#6961EF] text-white mt-4 text-lg py-6'
                    disabled={loading} 
                    isLoading={loading} 
                >
                    إنشاء حساب جديد
                </Button>
            </div>
        </div>
    );
}

export default AgencySignUpForm;
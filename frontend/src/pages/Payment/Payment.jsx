import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

function Payment() {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [password, setPassword] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({
        cardNumber: '',
        cardHolderName: '',
        password: '',
        expiryDate: '',
        cvv: ''
    });

    // Validation functions
    const validateCardNumber = (input) => !input ? 'رقم البطاقة مطلوب' : '';
    const validateCardHolderName = (input) => !input ? 'اسم حامل البطاقة مطلوب' : '';
    const validatePassword = (input) => !input ? 'كلمة المرور مطلوبة' : '';
    const validateExpiryDate = (input) => !input ? 'تاريخ الانتهاء مطلوب' : '';
    const validateCvv = (input) => !input ? 'CVV مطلوب' : '';

    const handleInputChange = (setter, validator, field) => (e) => {
        const value = e.target.value;
        setter(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: validator(value),
        }));
    };

    const handleSubmit = () => {
        const newErrors = {
            cardNumber: validateCardNumber(cardNumber),
            cardHolderName: validateCardHolderName(cardHolderName),
            password: validatePassword(password),
            expiryDate: validateExpiryDate(expiryDate),
            cvv: validateCvv(cvv),
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(Boolean)) {
            console.log("Payment submitted successfully");
        } else {
            console.log("Please fix errors before submitting");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[88vh] px-4 py-12" style={{ backgroundColor: '#1B4348' }}>
            <div className="rounded-3xl p-8 flex flex-col justify-between" style={{ backgroundColor: '#FFFEF0' }}>
                <h2 className="text-center text-2xl font-bold mb-8 text-[#1B4348]">معلومات الدفع</h2>
                
                <div className="space-y-6"> {/* Increased spacing to 30px */}
                    <div>
                        <Input
                            type="text"
                            label="رقم البطاقة"
                            placeholder="أدخل رقم البطاقة"
                            value={cardNumber}
                            onChange={handleInputChange(setCardNumber, validateCardNumber, 'cardNumber')}
                            isInvalid={!!errors.cardNumber}
                            className="bg-white border border-black rounded-lg" // Added border and rounded shape here
                        />
                        {errors.cardNumber && <span className="text-red-500 text-sm">{errors.cardNumber}</span>}
                    </div>

                    <div>
                        <Input
                            type="text"
                            label="اسم حامل البطاقة"
                            placeholder="أدخل اسم حامل البطاقة"
                            value={cardHolderName}
                            onChange={handleInputChange(setCardHolderName, validateCardHolderName, 'cardHolderName')}
                            isInvalid={!!errors.cardHolderName}
                            className="bg-white border border-black rounded-lg" // Added border and rounded shape here
                        />
                        {errors.cardHolderName && <span className="text-red-500 text-sm">{errors.cardHolderName}</span>}
                    </div>

                    <div>
                        <Input
                            type="password"
                            label="كلمة المرور"
                            placeholder="أدخل كلمة المرور"
                            value={password}
                            onChange={handleInputChange(setPassword, validatePassword, 'password')}
                            isInvalid={!!errors.password}
                            className="bg-white border border-black rounded-lg" // Added border and rounded shape here
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>

                    <div>
                        <Input
                            type="text"
                            label="تاريخ الانتهاء"
                            placeholder="أدخل تاريخ الانتهاء"
                            value={expiryDate}
                            onChange={handleInputChange(setExpiryDate, validateExpiryDate, 'expiryDate')}
                            isInvalid={!!errors.expiryDate}
                            className="bg-white border border-black rounded-lg" // Added border and rounded shape here
                        />
                        {errors.expiryDate && <span className="text-red-500 text-sm">{errors.expiryDate}</span>}
                    </div>

                    <div>
                        <Input
                            type="text"
                            label="CVV"
                            placeholder="أدخل CVV"
                            value={cvv}
                            onChange={handleInputChange(setCvv, validateCvv, 'cvv')}
                            isInvalid={!!errors.cvv}
                            className="bg-white border border-black rounded-lg" // Added border and rounded shape here
                        />
                        {errors.cvv && <span className="text-red-500 text-sm">{errors.cvv}</span>}
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    radius="full"
                    className="bg-[#6961EF] text-white mt-4 text-lg py-6 w-full"
                >
                    دفع
                </Button>

                <p className="text-center mt-6 text-sm text-[#1B4348]">
                    من خلال الضغط على “دفع” فإنك توافق عل <Link to="/terms-of-service" className="text-blue-500 underline">الشروط والأحكام</Link> الخاصة بمنصة رحالة{" "}
                    
                </p>
            </div>
        </div>
    );
}

export default Payment;

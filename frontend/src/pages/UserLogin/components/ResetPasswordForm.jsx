import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function ResetPasswordForm({ setForm }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [cooldownTime, setCooldownTime] = useState(0);
    const [cooldownStarted, setCooldownStarted] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordReset = async () => {
        setLoading(true);
        setMessage('');
        setCooldownTime(0);
        setCooldownStarted(false);
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(<span className="text-green-500">تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</span>);
            setCooldownTime(30); // 30 seconds cooldown
            const interval = setInterval(() => {
                setCooldownTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            setMessage('حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور.');
        }
        setLoading(false);
    };

    return (
        <div className='bg-whity rounded-3xl flex flex-col p-12 gap-8 items-center justify-center md:min-w-[500px] w-full mx-4 md:w-auto md:mx-0'>
            <h3 className="lg:text-3xl text-2xl font-bold">إعادة تعيين كلمة المرور</h3>
            <div className="flex flex-col gap-4 w-full">
                <Input
                    type="email"
                    variant="bordered"
                    label="الإيميل"
                    placeholder="أدخل الإيميل"
                    value={email}
                    onChange={handleEmailChange}
                    className='bg-white border-black'
                />
                {message && <span className="text-red-500 text-sm">{message}</span>}
                <Button
                    onClick={() => {
                        if (cooldownTime === 0) {
                            handlePasswordReset();
                        } else {
                            setMessage(<span className="text-red-500">يرجى الانتظار {cooldownTime} ثانية قبل المحاولة مرة أخرى.</span>);
                        }
                    }}
                    radius="full"
                    className='bg-[#6961EF] text-white mt-4 text-lg py-6'
                    isLoading={loading}
                >
                    إرسال رابط إعادة التعيين
                </Button>
                <div className="flex gap-2 justify-center items-center mt-2">
                    <a onClick={() => setForm("login")} className='text-[#6961EF] hover:cursor-pointer'>العودة إلى تسجيل الدخول</a>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;

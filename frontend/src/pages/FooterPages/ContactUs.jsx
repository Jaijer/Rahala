import React, { useState } from 'react';
import { Input, Textarea, Button, Spacer } from '@nextui-org/react';
import Footer from '../../components/Footer';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactUs() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEmailValid || email === '' || name === '' || subject === '' || message === '') {
      toast.error('يرجى ملء جميع الحقول بشكل صحيح.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setIsSending(true);

    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
    };

    // Initialize EmailJS with public key before sending
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY  
    )
      .then((response) => {
        console.log('SUCCESS!', response);
        toast.success('تم إرسال رسالتك بنجاح!', {
          position: 'top-center',
          autoClose: 3000,
        });
        setIsSending(false);

        // Clear form fields after successful submission
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.', {
          position: 'top-center',
          autoClose: 3000,
        });
        setIsSending(false);
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white p-10 rounded-lg shadow-lg border border-gray-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">تواصل معنا</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-right text-lg font-medium">الاسم:</label>
              <Input
                clearable
                fullWidth
                bordered
                placeholder="اكتب اسمك"
                className="border border-black rounded-md mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-right text-lg font-medium">الايميل:</label>
              <Input
                clearable
                fullWidth
                bordered
                type="email"
                placeholder="اكتب بريدك الإلكتروني"
                className="border border-black rounded-md mb-1"
                value={email}
                onChange={handleEmailChange}
                status={isEmailValid ? 'default' : 'error'}
              />
              {!isEmailValid && (
                <p className="text-red-500 text-sm mt-1 text-right">يرجى إدخال بريد إلكتروني صالح</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-right text-lg font-medium">الموضوع:</label>
              <Input
                clearable
                fullWidth
                bordered
                placeholder="اكتب موضوعك"
                className="border border-black rounded-md mb-4"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-right text-lg font-medium">الرسالة:</label>
              <Textarea
                fullWidth
                bordered
                placeholder="اكتب رسالتك هنا"
                className="border border-black rounded-md mb-4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Spacer y={1} />

            <Button
              type="submit"
              color="success"
              className="bg-[#76FC8F] rounded-lg font-bold text-xl mx-auto w-full"
              disabled={isSending}
            >
              {isSending ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />

      {/* Toastify Container */}
      <ToastContainer />
    </>
  );
}

export default ContactUs;

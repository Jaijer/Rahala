import React from 'react';
import { Input, Textarea, Button, Spacer} from '@nextui-org/react';
import Footer from '../../components/Footer';

function ContactUs() {
  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#ffffff] p-10 rounded-lg shadow-lg">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">تواصل معنا</h1>
        </div>

        {/* Name Field */}
        <div className="mb-6">
          <label className="block mb-2 text-right text-lg font-medium">الاسم:</label>
          <Input
            clearable
            fullWidth
            bordered
            placeholder="اكتب اسمك"
            className='border border-black rounded-md mb-4'
          />
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block mb-2 text-right text-lg font-medium">الايميل:</label>
          <Input
            clearable
            fullWidth
            bordered
            type="email"
            placeholder="اكتب بريدك الإلكتروني"
            className='border border-black rounded-md mb-4'
          />
        </div>

        {/* Subject Field */}
        <div className="mb-6">
          <label className="block mb-2 text-right text-lg font-medium">الموضوع:</label>
          <Input
            clearable
            fullWidth
            bordered
            placeholder="اكتب موضوعك"
            className='border border-black rounded-md mb-4'
          />
        </div>

        {/* Message Field */}
        <div className="mb-6">
          <label className="block mb-2 text-right text-lg font-medium">الرسالة:</label>
          <Textarea
            fullWidth
            bordered
            placeholder="اكتب رسالتك هنا"
            className='border border-black rounded-md mb-4'
          />
        </div>

        <Spacer y={1} />

        {/* Submit Button */}
        <Button
          type="submit"
          color="success"
          className="w-full"
          css={{
            backgroundColor: '#a1e8af',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          إرسال
        </Button>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ContactUs;
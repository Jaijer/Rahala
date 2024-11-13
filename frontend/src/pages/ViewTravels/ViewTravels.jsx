import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Global Style to set background color
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #FFFEF0; /* Set background color to #FFFEF0 */
    margin: 0; /* Remove default margin */
    font-family: 'Inter', sans-serif; /* Optional: Ensuring the font is applied globally */
  }
`;

// Blank Content Area Component
const BlankContent = styled.div`
  padding: 2rem;
  text-align: right;
  font-family: 'Inter', sans-serif;

  /* Make the content responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    text-align: left;
  }
`;

const Heading32 = styled.h1`
  color: #1B4348;
  font-size: 32px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Heading40 = styled.h1`
  color: #1B4348;
  font-size: 40px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Paragraph24 = styled.p`
  font-size: 24px;
  color: #757575; /* Apply color to Paragraph24 */

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Description = styled.p`
  color: #757575; /* Apply color to Description */
  font-size: 24px;
  word-wrap: break-word;
  max-width: 33.33%;
  text-align: right;
  margin-left: auto;
  margin-right: 0;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
    max-width: 100%;
    text-align: left;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  flex-direction: row; /* Align buttons horizontally */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack buttons vertically on small screens */
    margin-top: 1rem;
  }
`;

const GoBackLink = styled.a`
  margin-left: 1rem; /* Space between button and link */
  font-size: 24px;
  color: #1B4348;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const BookingButton = styled.button`
  background-color: #76FC8F;
  color: black;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;

  &:hover {
    background-color: #5ECC71;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 0.5rem 1.5rem;
  }
`;

// Fixed Image Component
const FixedImage = styled.img`
  position: fixed;
  top: 40%;
  left: 80px; /* Space between the image and the left side */
  transform: translateY(-50%);
  width: 200px;  /* Fixed width */
  height: auto;  /* Maintain the aspect ratio */

  @media (max-width: 768px) {
    left: 50%; /* Center the image on small screens */
    transform: translateX(-50%);
    width: 150px;
  }
`;

// New styled component for the additional text
const AdditionalInfo = styled.p`
  font-size: 20px;
  color: black;
  display: inline-block; /* Make it inline with the previous text */
  margin-left: 1rem; /* Add space between the two texts */

  @media (max-width: 768px) {
    font-size: 16px;
    margin-left: 0;
    display: block;
    margin-top: 1rem;
  }
`;

// ViewTravels Component
function ViewTravels() {
  return (
    <div>
      <GlobalStyle />
      <FixedImage src="https://via.placeholder.com/200x300" alt="Fixed Image" />

      <BlankContent>
        <Heading32>عدد المقاعد: 10</Heading32>
        <Heading32>حملة أبو علوة</Heading32>
        <br />
        <br />
        <Paragraph24>رحلة ذهاب وإياب . تاريخ السفر يبدأ من 25 سبتمبر وينتهي في 29 سبتمبر</Paragraph24>
        <Heading40>من الظهران إلى المدينة المنورة</Heading40>
        <br />
        <br />
        <br />
        <Heading40>وصف الرحلة</Heading40>
        <Description>الرحلة تتضمن وجبة الغداء في أول يوم من الوصول (فقط)، كما تقوم الحملة بترتيب رحلات لزيارة عدة معالم في المدينة المنورة ومنها: مسجد قباء، ومسجد القبلتين، والمساجد السبعة.</Description>
        <br />
        <br />
        <br />
        <Heading40>سعر الرحلة للفرد</Heading40>
        <Paragraph24>1000 ريال</Paragraph24>
        
        <AdditionalInfo>للاطلاع على باقات بأسعار مختلفة اضغط “حجز”</AdditionalInfo>

        <ButtonContainer>
          {/* Booking Button */}
          <BookingButton>حجز</BookingButton>
          
          {/* Go Back Link */}
          <GoBackLink href="javascript:history.back()">عودة&gt;</GoBackLink>
        </ButtonContainer>
      </BlankContent>
    </div>
  );
}

export default ViewTravels;

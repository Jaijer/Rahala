import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled Components
const MainContainer = styled.div`
  padding: 2rem;
  text-align: right;
  background-color: #FFFEF0;
  min-height: 100vh;
  width: 100%; 
  box-sizing: border-box;
`;

const HeadingText = styled.p`
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color};
  margin: 0.5rem 0;
  text-align: right;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
  margin-right: 1rem;
`;

const Button = styled.button`
  background-color: #76fc8f;
  color: black;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;
  position: relative;

  &:hover {
    background-color: #5ecc71;
  }
`;

const StyledLink = styled.a`
  color: #2a9d8f;
  cursor: pointer;
  text-decoration: none;
  font-size: 24px;
  margin-left: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem; /* Reduced gap for closer spacing */
  align-items: center;
  
  @media (min-width: 600px) {
    flex-direction: row;
    gap: 0.2rem; /* Reduced gap for closer spacing */
    justify-content: center;
  }
`;


const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 3rem; /* Adjust if needed for closer spacing */
`;

const TextInput = styled.input`
  padding: 0.5rem;
  width: 90%; 
  max-width: 378px;
  height: 67px;
  border: 1px solid black;
  text-align: center;
  border-radius: 12px;
`;


const RadioGroupWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 41px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const RadioButtonLabel = styled.label`
  position: relative;
  width: 249.78px;
  height: 105px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 1.5rem 0.5rem 0.5rem 0.5rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
`;

const TextContainer = styled.div`
  text-align: right;
  width: 100%; /* Ensures full width for text alignment */
`;

const TextLine = styled.span`
  display: block; /* Forces each line to be on a new line */
`;

const RadioInput = styled.input`
  position: absolute;
  top: 8px;
  right: 8px;
  margin: 0;
`;

function BookTrip() {
  const [selectedOption, setSelectedOption] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRadioGroupValid, setIsRadioGroupValid] = useState(true);
  const [isContactInfoValid, setIsContactInfoValid] = useState(true);
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setIsRadioGroupValid(true); // Reset validation on selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate radio group and contact fields
    const isValidRadio = !!selectedOption;
    const isValidContact = email !== '' && phone !== '';
    setIsRadioGroupValid(isValidRadio);
    setIsContactInfoValid(isValidContact);

    // Navigate if all validations pass
    if (isValidRadio && isValidContact) {
      navigate("/booking-checkout");
    }
  };

  return (
    <MainContainer>
      {/* Travel Information */}
      <HeadingText size={24} color="#757575">
        رحلة ذهاب وإياب . تاريخ السفر يبدأ من 25 سبتمبر وينتهي في 29 سبتمبر
      </HeadingText>
      <HeadingText size={40} color="#1B4348">
        من الظهران إلى المدينة المنورة
      </HeadingText>
      <HeadingText size={32} color="#1B4348">
        عدد المقاعد المتاحة: 10
      </HeadingText>

      {/* Travel Packages */}
      <HeadingText size={36} color="black" style={{ marginTop: '2rem' }}>
        باقات السفر
        {!isRadioGroupValid && <ErrorText>هذه الخانة مطلوبة</ErrorText>}
      </HeadingText>
      <HeadingText size={24} color="#757575">
        اختر البطاقة التي تناسب احتياجك
      </HeadingText>

      {/* Radio Buttons */}
      <RadioGroupWrapper>
        <RadioGroup>
          {[
            'باقة رباعية\nالسعر: 625 ريال',
            'باقة ثلاثية\nالسعر: 700 ريال',
            'باقة ثنائية\nالسعر: 900 ريال',
            'باقة فردية\nالسعر: 1000 ريال'
          ].map((option) => (
            <RadioButtonLabel key={option}>
              <RadioInput
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <TextContainer>
                {option.split('\n').map((line, index) => (
                  <TextLine key={index}>{line}</TextLine>
                ))}
              </TextContainer>
            </RadioButtonLabel>
          ))}
        </RadioGroup>
      </RadioGroupWrapper>

      {/* Contact Information */}
      <HeadingText size={36} color="black" style={{ marginTop: '2rem' }}>
        معلومات التواصل
        {!isContactInfoValid && <ErrorText>هذه الخانة مطلوبة</ErrorText>}
      </HeadingText>

      {/* Input Fields */}
      <InputGroup>
        <InputLabel>
          البريد الإلكتروني:
          <TextInput
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsContactInfoValid(true); // Reset validation on input
            }}
            placeholder="example@gamil.com"
            required
          />
        </InputLabel>
        <InputLabel>
          رقم الهاتف:
          <TextInput
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setIsContactInfoValid(true); // Reset validation on input
            }}
            placeholder="05xxxxxxxx"
            required
          />
        </InputLabel>
      </InputGroup>

      {/* Submit Button and Link */}
      <ActionContainer>
        <Button onClick={handleSubmit}>تقدم</Button>
        <StyledLink href="#back">عودة&gt;</StyledLink>
      </ActionContainer>
    </MainContainer>
  );
}

export default BookTrip;

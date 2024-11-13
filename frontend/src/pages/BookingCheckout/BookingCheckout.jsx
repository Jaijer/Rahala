import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #faf9f4;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 40px;
  color: #1b4348;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Card = styled.div`
  background: white;
  width: 1226px;
  height: 650px;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: right;
  border: 2px solid black;

  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    padding: 1rem;
  }
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #6c757d;
  text-align: center;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TripInfo = styled.div`
  text-align: center;
  font-weight: bold;
  color: #1b4348;
  font-size: 40px;
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Section = styled.div`
  margin: 1.5rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 36px;
  color: black;
  font-weight: bold;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const SectionContent = styled.p`
  font-size: 24px;
  color: #6c757d;
  margin-top: 0.2rem;

  @media (max-width: 768px) {
    font-size: 18px;
    text-align: center;
  }
`;

const ContactRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  color: #6c757d;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContactLabel = styled.p`
  font-weight: bold;
  color: black;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const OrderValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 24px;
  color: #6c757d;
  margin-top: 1rem;

  @media (max-width: 768px) {
    align-items: center;
    font-size: 18px;
  }
`;

const OrderValueTitle = styled(SectionTitle)`
  font-size: 36px;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
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

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Link = styled.a`
  color: #2a9d8f;
  cursor: pointer;
  text-decoration: none;
  font-size: 24px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Disclaimer = styled.p`
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: -0.5rem;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  a {
    color: #2a9d8f;
    text-decoration: none;
  }
`;

// Main Component
const BookingCheckout = () => {
  return (
    <Container>
      <Title>تأكيد الطلب والدفع</Title>
      <Card>
        <Subtitle>
          رحلة ذهاب وإياب. تاريخ السفر يبدأ من 25 سبتمبر وينتهي في 29 سبتمبر
        </Subtitle>
        <TripInfo>من الظهران إلى المدينة المنورة</TripInfo>

        <Section>
          <SectionTitle>باقات السفر</SectionTitle>
          <SectionContent>باقة فردية</SectionContent>
        </Section>

        <Section>
          <SectionTitle>معلومات التواصل</SectionTitle>
          <ContactRow>
            <ContactItem>
              <ContactLabel>رقم الهاتف</ContactLabel>
              <p>05XXXXXXXX</p>
            </ContactItem>
            <ContactItem>
              <ContactLabel>البريد الإلكتروني</ContactLabel>
              <p>example@gmail.com</p>
            </ContactItem>
          </ContactRow>
        </Section>

        <OrderValue>
          <OrderValueTitle>قيمة الدفع</OrderValueTitle>
          <SectionContent>1000 ريال</SectionContent>
        </OrderValue>

        <Footer>
          <Button data-text="دفع">دفع</Button>
          <Link href="javascript:history.back()">عودة</Link>
        </Footer>

        <Disclaimer>
          من خلال الضغط على "دفع" فإنك توافق على{" "}
          <Link href="terms-of-service">الشروط والأحكام</Link> الخاصة بمنصة رحلة
        </Disclaimer>
      </Card>
    </Container>
  );
};

export default BookingCheckout;

'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './login.css';
import Image from 'next/image';
import logo from './assets/logo.png'

function generatePromoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !phone.trim()) {
    alert('Iltimos, ism va telefon raqamingizni kiriting');
    return;
  }

  setIsLoading(true);

  const code = generatePromoCode();
  setPromoCode(code);
  setSuccess(true); // foydalanuvchiga promo kodni darhol ko'rsatish

  // fon jarayonida so‘rov yuboriladi, xato bo‘lsa consolda ko‘rsatiladi
  fetch('/api/googleSheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Xatolik yuz berdi');
      console.log('Maʼlumotlar yuborildi');
    })
    .catch((err) => {
      console.error('Server xatoligi:', err);
    })
    .finally(() => {
      setIsLoading(false); // tugagach loaderni o‘chirish
    });
};


  const handleTelegramRedirect = () => {
    const message = `Ism: ${name}%0ATelefon: +${phone}%0APromo kod: ${promoCode}`;
    const telegramUrl = `https://t.me/AkbarshohMamadaliyev?text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="register-container">
      <div className="top-section">
        
      </div>

      <div className="form-section">
        <div className="logo-placeholder"><Image src={logo} alt='logo'/></div>
        {!success ? (
          <form onSubmit={handleSubmit} className="form">
            <h3>Badavlat ayollar safiga qoʻshilish uchun roʻyxatdan oʻting</h3>
            <input
              type="text"
              placeholder="Ismingiz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="name-input"
            />
            <PhoneInput
              country={'uz'}
              onlyCountries={['uz']}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputProps={{ required: true }}
              containerClass="phone-input"
              inputClass="phone-input-inner"
              buttonClass="phone-flag-button"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>Tabriklaymiz! Sizga kurs uchun 75% chegirma kuponi taqdim etildi</h3>
            <p>Promo kod: <strong>{promoCode}</strong></p>

            <p style={{marginTop:"20px"}}>Hoziroq mutaxasis bilan bogʻlaning va kuponi orqali chegirmadan foydalaning</p>
            <button onClick={handleTelegramRedirect}>Mutaxassis bilan bog‘lanish</button>
          </div>
        )}
      </div>

      <div className="bottom-section"></div>
    </div>
  );
};

export default RegisterPage;

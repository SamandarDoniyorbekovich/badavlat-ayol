'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './login.css';
import Image from 'next/image';
import logo from './assets/logo.png';

function generatePromoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const allowedPrefixes = ['50', '71', '75', '76', '77', '88', '90', '91', '93', '94', '95', '97', '99', '33'];

function isValidUzPhoneNumber(phone: string): boolean {
  if (!phone.startsWith('998')) return false;
  if (phone.length !== 12) return false;
  const operatorCode = phone.slice(3, 5);
  if (!allowedPrefixes.includes(operatorCode)) return false;
  const rest = phone.slice(5);
  return /^\d{7}$/.test(rest);
}

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setIsPhoneValid(isValidUzPhoneNumber(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    if (!isValidUzPhoneNumber(phone)) return;

    setIsLoading(true);
    const code = generatePromoCode();
    setPromoCode(code);
    setSuccess(true);

    try {
      const res = await fetch('/api/googleSheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) throw new Error('Xatolik yuz berdi');
      console.log('Maʼlumotlar yuborildi');
    } catch (err) {
      console.error('Server xatoligi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramRedirect = () => {
    const baseMessage =
      `Assalomu alaykum.%0A` +
      `Ismim: ${encodeURIComponent(name)}%0A` +
      `Telefon raqamim: +${encodeURIComponent(phone)}%0A%0A` +
      `Kurs uchun 75% chegirma yutib olgandim. Promokod: ${encodeURIComponent(promoCode)}%0A%0A` +
      `Menga ma'lumot bera olasizmi?`;

    const users = ['gozallina', 'Dilnoz_Academy'];

    let assignedUserIndex = localStorage.getItem('assignedUserIndex');
    if (assignedUserIndex === null) {
      assignedUserIndex = Math.floor(Math.random() * 2).toString();
      localStorage.setItem('assignedUserIndex', assignedUserIndex);
    }

    const mainUser = users[parseInt(assignedUserIndex)];
    const secondaryUser = users[1 - parseInt(assignedUserIndex)];

    for (let i = 0; i < 5; i++) {
      const currentUser = i % 2 === 0 ? mainUser : secondaryUser;
      setTimeout(() => {
        window.open(`https://t.me/${currentUser}?text=${baseMessage}`, '_blank');
      }, i * 2000);
    }
  };

  return (
    <div className="register-container">
      <div className="top-section"></div>

      <div className="form-section">
        <div className="logo-placeholder">
          <Image src={logo} alt="logo" />
        </div>

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
              onChange={handlePhoneChange}
              inputProps={{ required: true }}
              containerClass="phone-input"
              inputClass="phone-input-inner"
              buttonClass="phone-flag-button"
            />
            {!isPhoneValid && phone && (
              <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
                Telefon raqamingiz +998 bilan boshlanishi va operator kodi hamda raqam uzunligi to‘g‘ri bo‘lishi kerak.
              </div>
            )}
            <button type="submit" disabled={isLoading || !isPhoneValid || !name.trim() || !phone.trim()}>
              {isLoading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>Tabriklaymiz! Sizga kurs uchun 75% chegirma kuponi taqdim etildi</h3> <br />
            <p style={{ display: 'flex' }}>
              KUPON: <div className="promokod">{promoCode}</div>
            </p>

            <p style={{ marginTop: '20px' }}>
              Hoziroq mutaxassis bilan bogʻlaning va kuponi orqali chegirmadan foydalaning
            </p>
            <button onClick={handleTelegramRedirect}>Mutaxassis bilan bog‘lanish</button>
          </div>
        )}
      </div>

      <div className="bottom-section"></div>
    </div>
  );
};

export default RegisterPage;

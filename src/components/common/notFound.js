import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../translations';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const currentLang = useSelector((state) => state.lang.lang)
  const t = translations[currentLang]

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.message}</p>
      <Link to="/">
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          {t.notFound.button}
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
import { useState, useEffect, useRef } from 'react';
import { getRandomHeroImage } from '../../data/themes';

const HeroImage = ({ theme, month, year, isDarkMode, monthIndex }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [nextImageUrl, setNextImageUrl] = useState('');
  const [isCrossfading, setIsCrossfading] = useState(false);
  const intervalRef = useRef(null);
  const prevMonthRef = useRef(null);

  const seasonEmojis = {
    winter: '❄️ 🏔️',
    spring: '🌸 🌿',
    summer: '☀️ 🌊',
    autumn: '🍂 🍁',
  };

  const getDayImage = () => getRandomHeroImage(monthIndex);
  const getNightImage = () => theme.heroUrlNight || theme.heroUrl;

  useEffect(() => {
    const newUrl = isDarkMode ? getNightImage() : getDayImage();
    if (prevMonthRef.current !== monthIndex) {
      setCurrentImageUrl(newUrl);
      setImageLoaded(false);
      setImageError(false);
      prevMonthRef.current = monthIndex;
    }
  }, [monthIndex, isDarkMode]);

  useEffect(() => {
    if (!currentImageUrl) {
      setCurrentImageUrl(isDarkMode ? getNightImage() : getDayImage());
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      setCurrentImageUrl(getNightImage());
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const newImg = getDayImage();
      if (newImg !== currentImageUrl) {
        setNextImageUrl(newImg);
        setIsCrossfading(true);
        setTimeout(() => {
          setCurrentImageUrl(newImg);
          setIsCrossfading(false);
          setNextImageUrl('');
        }, 1200);
      }
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDarkMode, monthIndex, currentImageUrl]);

  const waveFill = isDarkMode ? '#161b22' : '#ffffff';

  return (
    <div className="hero-section">
      <div className="hero-image-container">
        {!imageError && currentImageUrl ? (
          <>
            <img
              className="hero-image"
              src={currentImageUrl}
              alt={`${month} landscape`}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
            {isCrossfading && nextImageUrl && (
              <img
                className="hero-image hero-image-crossfade"
                src={nextImageUrl}
                alt={`${month} landscape transition`}
                loading="eager"
              />
            )}
          </>
        ) : (
          <div className="hero-image-fallback" style={{ background: theme.heroGradient }}>
            {seasonEmojis[theme.season]}
          </div>
        )}

        {!imageLoaded && !imageError && (
          <div
            className="hero-image-fallback"
            style={{ background: theme.heroGradient, position: 'absolute', inset: 0 }}
          />
        )}
      </div>

      <div
        className="hero-accent-shape"
        style={{ background: theme.accent }}
      />

      <div className="hero-overlay" />

      <div className="hero-text">
        <div className="hero-year">{year}</div>
        <div className="hero-month">
          <span key={`${month}-${year}`} className="month-name-animate">
            {month}
          </span>
        </div>
      </div>

      <div className="wave-divider">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C200,60 400,0 600,30 C800,60 1000,10 1200,40 L1200,60 L0,60 Z"
            fill={waveFill}
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroImage;

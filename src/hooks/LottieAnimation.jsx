import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData, width = 300, height = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      container: containerRef.current, // контейнер для анимации
      renderer: 'svg', // рендерер
      loop: true, // зациклить анимацию
      autoplay: true, // автоматическое воспроизведение
      animationData: animationData, // JSON данные анимации
    });

    return () => {
      animationInstance.destroy(); // Очистка при размонтировании компонента
    };
  }, [animationData]);

  return <div ref={containerRef} style={{ width, height }}></div>;
};

export default LottieAnimation;

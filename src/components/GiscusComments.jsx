import React, { useEffect, useRef } from 'react';

function GiscusComments() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.setAttribute('data-repo', 'Eternity-Sky/CWEB_COMMIT');
      script.setAttribute('data-repo-id', 'R_kgDOO3nFlA');
      script.setAttribute('data-category', 'Announcements');
      script.setAttribute('data-category-id', 'DIC_kwDOO3nFlM4CrJ9D');
      script.setAttribute('data-mapping', 'url');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'bottom');
      script.setAttribute('data-theme', 'preferred_color_scheme');
      script.setAttribute('data-lang', 'zh-CN');
      script.crossOrigin = 'anonymous';
      script.async = true;
      ref.current.appendChild(script);
    }
  }, []);

  return <div ref={ref} />;
}

export default GiscusComments; 
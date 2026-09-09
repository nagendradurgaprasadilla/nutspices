"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();

  // Fire PageView event on Next.js client-side route changes
  useEffect(() => {
    if (!pathname?.startsWith("/admin") && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  // Do not load Meta Pixel on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: "<!-- Meta Pixel Code -->" }} />
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '5107613359465299');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=5107613359465299&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <span dangerouslySetInnerHTML={{ __html: "<!-- End Meta Pixel Code -->" }} />
    </>
  );
}

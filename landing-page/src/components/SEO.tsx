import { useEffect } from 'react';

interface SEOProps {
  title: string;
}

export default function SEO({ title }: SEOProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}

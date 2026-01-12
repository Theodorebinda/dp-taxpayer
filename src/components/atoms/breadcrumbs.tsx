import React from 'react';
import Link from 'next/link'; // ou simplement <a> si tu n'utilises pas Next.js

interface BreadcrumbsProps {
  path: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path }) => {
  const segments = path.split('/').filter(Boolean); // enlève les vides

  const buildHref = (index: number) =>
    '/' + segments.slice(0, index + 1).join('/');

  return (
    <nav className="text-sm text-blue-600 flex items-center gap-1">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <span key={index} className="flex items-center gap-1">
            {!isLast ? (
              <>
                <Link href={buildHref(index)} className="hover:underline">
                  {label}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">{label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;


import React, { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h2, h3, h4'))
      .filter((element) => element.id)
      .map((element) => ({
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1)),
      }));

    setHeadings(headingElements);

    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll('h2, h3, h4'))
        .filter((element) => element.id);

      // Find the heading that is currently at the top of the viewport
      const currentHeading = headingElements.find((heading) => {
        const rect = heading.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto p-4 ml-8 w-64 border-l border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">On This Page</h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 hover:text-primary transition-colors ${activeId === heading.id ? 'text-primary font-medium' : 'text-gray-600'}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;

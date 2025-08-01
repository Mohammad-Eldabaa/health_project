import { useState } from 'react';
import { Search } from 'lucide-react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import PropTypes from 'prop-types';

function SearchBar({ placeholder = 'ابحث...', className = '', onChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  // Dynamic SEO metadata
  const pageTitle = searchTerm ? `البحث عن: ${searchTerm}` : 'البحث عن الأطباء والخدمات الطبية';
  const seoDescription = searchTerm
    ? `ابحث عن ${searchTerm} في قاعدة بيانات الأطباء والخدمات الطبية لدينا. احجز موعدك الآن.`
    : 'ابحث عن الأطباء والخدمات الطبية بسهولة. اكتشف المتخصصين وقم بحجز موعدك عبر الإنترنت.';

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={`بحث طبي, أطباء, خدمات طبية, ${searchTerm || 'حجز موعد'}, طبيب متخصص`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className={`flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-sm ${className}`}>
        <Search className="text-gray-500 ml-2 rtl:ml-0 rtl:mr-2" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base placeholder:text-gray-500 text-black mx-1"
        />
      </div>
    </>
  );
}

// PropTypes for type checking
SearchBar.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;

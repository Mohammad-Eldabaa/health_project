import React from 'react';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import PropTypes from 'prop-types';

export function StatsCards({ stats }) {
  // Generate dynamic SEO metadata based on stats
  const pageTitle = 'إحصائيات لوحة تحكم الطبيب - Clinic Smart';
  const statTitles = stats.map(stat => stat.title).join(', ');
  const seoDescription = `عرض إحصائيات ${statTitles} في لوحة تحكم الطبيب باستخدام Clinic Smart لإدارة العيادة بكفاءة.`;
  const seoKeywords = `إحصائيات طبية, لوحة تحكم طبيب, Clinic Smart, ${statTitles}, إدارة عيادة`;

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="noindex" /> {/* Private dashboard, not indexed */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-100 rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-green-600 text-sm">{stat.change}</span>
              </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// PropTypes for type checking
StatsCards.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
};

export default StatsCards;

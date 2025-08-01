import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './Card.css';
import useFirstAidStore from '../../../store/firstaid';

export default function Card({ title, id }) {
  const { setLastId } = useFirstAidStore();

  return (
    <>
      <Helmet>
        <title>{`${title} - الإسعافات الأولية`}</title>
        <meta
          name="description"
          content={`تعرف على كيفية تقديم الإسعافات الأولية لـ ${title} من خلال إرشادات مفصلة وموثوقة.`}
        />
        <meta name="keywords" content={`إسعافات أولية, ${title}, نصائح طبية, معالجة الإصابات, نظام عيادة`} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content={`${title} - الإسعافات الأولية`} />
        <meta
          property="og:description"
          content={`إرشادات مفصلة لتقديم الإسعافات الأولية لـ ${title} للتعامل مع الحالة بسرعة وأمان.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/firstaid/firstaiddetails`} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} - الإسعافات الأولية`} />
        <meta name="twitter:description" content={`دليل لتقديم الإسعافات الأولية لـ ${title} بطريقة آمنة وفعالة.`} />
      </Helmet>

      <Link to="/firstaid/firstaiddetails">
        <div
          className="card cursor-pointer hover:shadow-lg transition text-center text-white"
          onClick={() => {
            setLastId(id);
          }}
        >
          {title}
        </div>
      </Link>
    </>
  );
}

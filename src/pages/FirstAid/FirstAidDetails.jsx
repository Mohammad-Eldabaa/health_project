import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import useFirstAidStore from '../../store/firstaid';
import styles from './FADetails.module.css';

export default function FirstAidDetails() {
  const [htmlContent, setHtmlContent] = useState('');
  const [state, setState] = useState({});
  const { getStateById, lastId } = useFirstAidStore();

  const handleLoad = async () => {
    setState(await getStateById());
  };

  useEffect(() => {
    handleLoad();
  }, [lastId]);

  useEffect(() => {
    setHtmlContent(state?.detail || '');
  }, [state]);

  return (
    <>
      <Helmet>
        <title>{state.name ? `${state.name} - الإسعافات الأولية` : 'الإسعافات الأولية - نظام المواعيد الطبية'}</title>
        <meta
          name="description"
          content={
            state.detail
              ? `${state.detail.replace(/<[^>]+>/g, '').substring(0, 160)}`
              : 'تعرف على إرشادات الإسعافات الأولية التفصيلية لمعالجة الإصابات والحالات الطارئة بفعالية.'
          }
        />
        <meta
          name="keywords"
          content={`إسعافات أولية, ${state.name || 'معالجة الإصابات'}, نصائح طبية, نظام عيادة, حالات طارئة`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta
          property="og:title"
          content={state.name ? `${state.name} - الإسعافات الأولية` : 'الإسعافات الأولية - نظام المواعيد الطبية'}
        />
        <meta
          property="og:description"
          content={
            state.detail
              ? `${state.detail.replace(/<[^>]+>/g, '').substring(0, 160)}`
              : 'إرشادات مفصلة للإسعافات الأولية للتعامل مع الحالات الطارئة بسرعة وأمان.'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={state.name ? `${state.name} - الإسعافات الأولية` : 'الإسعافات الأولية - نظام المواعيد الطبية'}
        />
        <meta
          name="twitter:description"
          content={
            state.detail
              ? `${state.detail.replace(/<[^>]+>/g, '').substring(0, 160)}`
              : 'دليل شامل للإسعافات الأولية لمعالجة الحالات الطارئة.'
          }
        />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full bg-gray-300 min-h-[50vh]bg- flex items-center justify-center px-4">
          <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[85%] aspect-video rounded-xl overflow-hidden shadow-lg my-4">
            <iframe
              className="w-full h-full"
              src={state.video}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className={`${styles.style}`}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </>
  );
}

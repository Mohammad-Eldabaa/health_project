import React, { useEffect, useState } from 'react';
import useFirstAidStore from '../../store/firstaid';
import styles from './FADetails.module.css';

export default function FirstAidDetails() {
  const [htmlContent, setHtmlContent] = useState('');
  const { getStateById, lastId } = useFirstAidStore();

  const handleLoad = async () => {
    const html = await getStateById();
    setHtmlContent(html);
  };

  useEffect(() => {
    handleLoad();
  }, [lastId]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full bg-gray-300 min-h-[50vh]bg- flex items-center justify-center px-4">
          <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[85%] aspect-video rounded-xl overflow-hidden shadow-lg my-4">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/0C3Ddq2IHHI"
              title="First Aid Video"
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

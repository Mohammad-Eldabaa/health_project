import React, { useEffect, useState } from 'react';
import useFirstAidStore from '../../store/firstaid';
import styles from './FADetails.module.css';
import Navbar from '../../components/Navbar/Navbar';

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
            <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full bg-gray-300 min-h-[50vh] flex items-center justify-center px-4 pt-15">
          <div className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] h-[300px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-lg my-4">
            <iframe
              className="w-full h-full"
              src={state.video}
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

import React, { useEffect, useState } from "react";
import useFirstAidStore from "../../store/firstaid";

export default function FirstAidDetails() {
  const [htmlContent, setHtmlContent] = useState("");
  const { getStateById, lastId } = useFirstAidStore();

  const handleLoad = async () => {
    const html = await getStateById();
    setHtmlContent(html);
  };

  useEffect(() => {
    handleLoad();
  }, [lastId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full h-[50vh] bg-black flex items-center justify-center">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/0C3Ddq2IHHI"
          title="First Aid Video"
          allowFullScreen
        ></iframe>
      </div>

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

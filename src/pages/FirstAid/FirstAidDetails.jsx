import React from 'react';

export default function FirstAidDetails() {

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

            <div className="p-8 bg-white flex-1">
                <h3 className="text-3xl font-bold mb-4">الارشادات</h3>
                <p className="text-lg text-gray-700 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos libero illo dignissimos, consequatur cum ullam magni impedit in omnis numquam ipsa nemo asperiores illum dolorum aliquam provident ea. Tenetur, earum.
                </p>
            </div>
        </div>
    );
}

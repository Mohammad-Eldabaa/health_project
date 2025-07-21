import React from 'react'
import Card from './components/Card'

export default function FirstAid() {
  const cardTitles = [
    'حالات النزيف',
    'الكسور',
    'الحروق',
    'التسمم',
    'الإغماء',
    'لدغات الحشرات',
    'ضربات الشمس',
    'الاختناق'
  ];

  return (
    <div className='max-w-7xl mx-auto p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {cardTitles.map((title, index) => (
          <Card key={index} title={title} />
        ))}
      </div>
    </div>
  );
}

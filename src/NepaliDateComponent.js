import React from 'react';
import NepaliDateConverter from 'nepali-date-converter';

const NepaliDateComponent = ({ date }) => {
  const converter = new NepaliDateConverter(date);
  const nepaliDate = converter.format('yyyy-MM-dd'); // Formats the date as Year-Month-Day

  return <span>{nepaliDate}</span>;
};

export default NepaliDateComponent;

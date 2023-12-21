import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';


const FilePage = () => {

  const [columnValues, setColumnValues] = useState([]);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];

      // Read the Excel file as an array buffer
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Replace 'Sheet1' with the name of your sheet
      const sheet_name = workbook.SheetNames[0];
      
      // Replace 'Column_Name' with the name of the column you want to retrieve
      const column_name = 'Column_Name';

      // Get the values from the specified column
      const sheet = workbook.Sheets[sheet_name];
      const columnValues = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // Assumes the first row contains headers
        .map(row => row[column_name]);

      setColumnValues(columnValues);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  const handleUpload = () => {
    console.log(columnValues)
  }

  return (
    <div>
      <h2>Values from Excel Column</h2>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {columnValues.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </div>
  )
}

export default FilePage
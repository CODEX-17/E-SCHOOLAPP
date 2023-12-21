import React, { useState } from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import mammoth from 'mammoth';


const ActivityPage = () => {

  const [htmlContent, setHtmlContent] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await convertDocxToHtml(arrayBuffer);
        setHtmlContent(result);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const convertDocxToHtml = async (arrayBuffer) => {
    return new Promise((resolve, reject) => {
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result) => {
          resolve(result.value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {htmlContent && (
        <div>
          <h3>Word Document Viewer:</h3>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
    </div>
  );
};


export default ActivityPage
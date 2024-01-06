import DocViewer, {DocViewerRenderers} from "react-doc-viewer";
import FileViewer from 'react-file-viewer';


const FilePage = () => {

  const docs = [
    { uri: "http://localhost:5000/file_1703608899097.xlsx" },
  ];

  return(
    <>
  {/* For DOCX files */}
  <DocViewer
    renderers={DocViewerRenderers}
    style={{ width: '100%', height: '100%'}}
    documents={docs}
    pluginRenderers={DocViewerRenderers}
  />

  {/* For PPT and XLS files */}
  <FileViewer
    fileType={'pptx'}
    filePath={'http://localhost:5000/file_1703604974548.pptx'}
  />

    <iframe src={'http://localhost:5000/file_1703604974548.pptx'} width="100%" height="500px" frameBorder="0">
      </iframe>
</>
  ) 
}

export default FilePage
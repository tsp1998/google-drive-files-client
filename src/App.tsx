import { useState } from 'react'
import './App.css'
import ImageUpload from './components/ImageUpload/ImageUpload'
import ImagePreview from './components/ImageUpload/ImagePreview'


function App() {
  const [fileMetaData, setFileMetaData] = useState({})

  return (
    <div className="App">
      <ImageUpload setFileMetaData={setFileMetaData} />
      <ImagePreview fileMetaData={fileMetaData} />
    </div>
  )
}

export default App

import { FunctionComponent, useState } from 'react'

interface ImagePreviewPropsModel {
    setFileMetaData: (fileMetaData: object) => void
}

const ImageUpload: FunctionComponent<ImagePreviewPropsModel> = props => {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [successMessage, setSuccessMessage] = useState<string>('')

    const handleFileInputChange = (event: React.FormEvent) => {
        const [file] = (event.target as HTMLInputElement).files!
        setFile(file)
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (file) {
            const formData = new FormData()
            formData.append('image', file)
            props.setFileMetaData({}) // to clear prev image preview
            setSuccessMessage('Uploading...')
            try {
                const response = await fetch('http://localhost:5000/google-drive', {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                if (data.status !== 'success') {
                    throw new Error('Failed to upload file. please try again')
                }
                props.setFileMetaData(data.file)
                setSuccessMessage('File uploaded...')
            } catch (error) {
                setError(error as Error)
            }
        }
    }

    return (
        <form className="image-upload" onSubmit={handleSubmit}>
            <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileInputChange}
            />
            <br />
            <button type="submit">Upload File</button>
            {successMessage && <div>{successMessage}</div>}
            {error && <div>{error.message || 'Something went wrong...'}</div>}
        </form>
    )
}

export default ImageUpload
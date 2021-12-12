import { FunctionComponent, useEffect, useState } from "react"

interface ImagePreviewPropsModel {
    fileMetaData: object
}

let touched = false

const ImagePreview: FunctionComponent<ImagePreviewPropsModel> = (props) => {
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getFileLink(props.fileMetaData)
    }, [props.fileMetaData])

    const getFileLink = async (fileMetaData: object) => {
        setLoading(true)
        touched = true
        const fileId = (fileMetaData as { id: string }).id || ''
        if (fileId) {
            try {
                const response = await fetch(`http://localhost:5000/google-drive/${fileId}`)
                const data = await response.json()
                if (data.status !== 'success') {
                    throw new Error('Failed to get file links. please try again')
                }
                setImageUrl(data.links.webContentLink)
            } catch (error) {
                setError(error as Error)
            }
        }
        setLoading(false)
    }

    return (
        <div>
            {
                (touched && loading) ? <div>Loading Image previews...</div> : (
                    <>
                        <img src={imageUrl} alt="File Preview" />
                        {error && <div>{error.message || 'Something went wrong...'}</div>}
                    </>
                )
            }
        </div>
    )
}

export default ImagePreview
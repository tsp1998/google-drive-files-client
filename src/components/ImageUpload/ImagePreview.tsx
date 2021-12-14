import { FunctionComponent, useEffect, useState } from "react"

interface ImagePreviewPropsModel {
    fileMetaData: {
        id: string,
        url: string,
        mimeType: string
    }
}

let touched = false

const ImagePreview: FunctionComponent<ImagePreviewPropsModel> = (props) => {
    const [imageUrl, setImageUrl] = useState(props.fileMetaData.url || '')
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setImageUrl('')
        if (!imageUrl && props.fileMetaData.url) {
            getFileLink(props.fileMetaData)
        }
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

    const isDev = false
    const FILE_FETCHER_SERVER_URL = isDev ? 'http://localhost:5001' : 'https://file-fetcher-from-drive.herokuapp.com'

    return (
        <div>
            {
                (touched && loading) ? <div>Loading Image previews...</div> : (
                    <>
                        <img
                            style={{ width: '300px' }}
                            src={
                                !imageUrl ?
                                    '' :
                                    `${FILE_FETCHER_SERVER_URL}?imageUrl=${imageUrl}&mimeType=${props.fileMetaData.mimeType}`
                            }
                            alt="File Preview"
                        />
                        {error && <div>{error.message || 'Something went wrong...'}</div>}
                    </>
                )
            }
        </div>
    )
}

export default ImagePreview
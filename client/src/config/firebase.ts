import { initializeApp } from 'firebase/app'
import { getStorage, deleteObject, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { config } from './config'


const app = initializeApp(config.firebase);
const storage = getStorage(app);
export {
    storage, 
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL
}

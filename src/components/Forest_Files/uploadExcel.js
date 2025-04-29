
import axios from 'axios';
import { API_URL_3 } from '../../config';
// import { API_URL } from '../config';          
export async function uploadExcelFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const uploadRes = await axios.post(
      `${API_URL_3}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    console.log('File uploaded successfully:', uploadRes.data);
    return uploadRes.data;  // Return the response data if needed

    // Handle the response as needed, e.g., show a success message or update the UI 
  }
  catch (error) {
    console.error('Error uploading file:', error);
    throw error;  // Rethrow the error for further handling if needed
  }
  /* 1️⃣ send the file */
 
  

  /* 2️⃣ fetch the up-to-date event table the UI needs */
  // const { data } = await axios.get(`http://192.168.29.111:5001/api/filtered-summary`);
  // return data;                                // → array of rows
}
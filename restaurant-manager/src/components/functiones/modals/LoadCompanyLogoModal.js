import '../../../components/css/modals/loadcompanylogomodal.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function LoadCompanyLogoModal(props) {

  const [ currentLogoURL, setCurrentLogoURL ] = useState(null)
  const [ currentIconURL, setCurrentIconURL ] = useState(null)
  
  function changeHandeler(e) {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader()  
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result

        img.onload = () => {
            const resizedImage = resizeImage(img, 100, 100);
            const resizedIcon = resizeImage(img, 16, 16);
            setCurrentLogoURL(resizedImage);
            setCurrentIconURL(resizedIcon);
        }
      }
      reader.readAsDataURL(file);
    }
  }

  function resizeImage(image, maxWidth, maxHeight) {  /// Chat GPT, WIDTH not good
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    let width = image.width;
    let height = image.height;
  
    // Calculate the new dimensions while preserving the aspect ratio
    if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
    }
    if (height > width) {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
    }
  
    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;
  
    // Draw the resized image on the canvas
    ctx.drawImage(image, 0, 0, width, height);
  
    // Convert the canvas to a data URL
    const resizedImageDataUrl = canvas.toDataURL('image/jpeg'); // You can change the format if needed
  
    return resizedImageDataUrl;
  }

    function saveImage() {
        props.setCompanyObject({...props.companyObject, logo: currentLogoURL, icon: currentIconURL})
        props.onHide()
    }
    function clearImage() {
        setCurrentLogoURL(null)
        setCurrentIconURL(null)
        props.setCompanyObject({...props.companyObject, logo: ''})
    }


  return (
    <Modal
      {...props}
      size='sm'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select Logo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className='central'>
        <div className='selected-logo'>{currentLogoURL && <img src={currentLogoURL} alt="Selected Image" />}</div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        {currentLogoURL && <button className='save-button' onClick={saveImage}>Save</button>}
        {currentLogoURL ? <button onClick={clearImage} className='cancel-button'>Cancel</button> :
        <div className='file-input-container'>
            <label className='custom-button' htmlFor='logo-input'>Upload Logo</label>
            <input className='file-input' 
                    type='file' 
                    accept='image/*'
                    id='logo-input' 
                    onChange={(e)=>changeHandeler(e)}></input>
        </div>}
        <Button>Lucky Guess</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoadCompanyLogoModal
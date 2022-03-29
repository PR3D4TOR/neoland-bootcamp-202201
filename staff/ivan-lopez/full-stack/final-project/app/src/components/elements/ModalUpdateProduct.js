import { useEffect, useState } from 'react'
import { retrieveProduct, updateProduct } from '../../logic'
import React from 'react'
import Button from '../Button'
import { Input } from '../form-elements'
import Modal from './Modal'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { convertToBase64 } from '../utils/utils'


function ModalUpdateProduct({ onClose, onProductUpdated }) {
  const [name, setName] = useState()
  const [image, setImage] = useState()
  
  const [size, setSize] = useState()
  const [color, setColor] = useState()
  const [price, setPrice] = useState()
  const [description, setDescription] = useState()

  const [product, setProduct] = useState({})
  const { productId } = useParams()

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
  });
  const productImage = acceptedFiles[0];
  const productImgSrc = productImage && URL.createObjectURL(productImage);

  useEffect(() => {
    try {
      retrieveProduct(productId)
        .then((product) => {
          const { name, image, size, color, price, description } = product
          setName(name)
          setImage(image)
          setSize(size)
          setColor(color)
          setPrice(price)
          setDescription(description)
          setProduct(product)
        })
        .catch(error => alert(error.message))
    } catch (error) {
      alert(error.message)
    }
  }, [])


  const modifyProduct = event => {
    event.preventDefault()

    const { target: {
      name: { value: name },
      
      size: { value: size },
      color: { value: color },
      price: { value: price },
      description: { value: description } } } = event

    try {
      if (productImage)
        convertToBase64(productImage).then(productImage)
        updateProduct(sessionStorage.token, productId, name, productImage, size, color, price, description)
          .then(() => {
            setName(name)
            setImage(productImage)
            setSize(size)
            setColor(color)
            setPrice(price)
            setDescription(description)

            onProductUpdated({
              id: productId,
              name: name,
              image: productImage,
              size: size,
              color: color,
              price: price,
              description: description
            })
          })
        .catch(error => { throw error })
    } catch ({ message }) {
      alert(message)
    }

  }


  return (
    <Modal onClose={onClose}>
      <form onSubmit={modifyProduct}>
        <h1>Actualizar producto</h1>
        <Input type='text' name='name' placeholder='Nombre del producto' defaultValue={name} />
        <Input type='text' name='size' placeholder='Talla' defaultValue={size} />
        <Input type='text' name='color' placeholder='Color' defaultValue={color} />
        <Input type='text' name='price' placeholder='Precio' defaultValue={price} />
        <Input type='text' name='description' placeholder='Descripción' defaultValue={description} />
        <Button type='submit' >Actualizar</Button>
      </form>
       
       
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {productImage && <img
          src={productImgSrc}
          alt='photo'
        />}
         <Button>Elegir archivo</Button>
      </div>
    </Modal>


  )
}

export default ModalUpdateProduct
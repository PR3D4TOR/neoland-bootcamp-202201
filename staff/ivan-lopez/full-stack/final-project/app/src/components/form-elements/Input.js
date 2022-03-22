import './Input.sass'

function Input({ type='text', name='', placeholder='' }) {

    return <>
        <input type={type} name={name} placeholder={placeholder} />
    
    </>

}

export default Input
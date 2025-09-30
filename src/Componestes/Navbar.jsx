import images from '../assets/imges'

const Navbar = () => {
    return ( 
    <header className='mt-10 bg-gradient-to-r from-[#732020] to-[#BF3939] text-white shadow-lg'>
<div className='container mx-auto px-4 py-6'>
    <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
            <img src={images.principal} className='w-16 h16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center'></img>
        <div>
            <h1 className='text-3xl font-bold'>Documentação do Bot</h1>
            <p className='text-blue-100'>Guia completo de instalação e uso</p>
        </div>
        </div>
    </div>
</div>

    </header> );
}
 
export default Navbar;
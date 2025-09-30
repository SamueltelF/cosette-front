const Footer = () => {
    return ( <section id="cta" className="section" style={{ background: 'linear-gradient(135deg, #1a26347a 0%, #1A2634 100%', paddingTop: '4rem', paddingBottom: '4rem'}}>
       <div className="container">
        <div className="columns is-vcentered">
            <div className="column is-8">
                <p className="title is-2 has-text-white has-text-weight-bold">
                    Quer ter <span style={{ color: '#ff6b6b'}}>[seu bot]</span>
                </p>
                <p className="subtitle is-5 mt-3 has-text-white-ter">
                    Baixo lhe leva ao repositorio de simples base de bot para uso de estudos ou pessoal
                </p>
                <a href="#" className="button is-large is-white mt-4">
                    <strong><i className="fa-solid fa-book mr-2">Get Started</i></strong>
                </a>
            </div>
            <div className="column is-4 has-text-centered">
                <i className="fa-solid fa-code" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.3'}}></i>
            </div>
        </div>
        </div> 
    </section> );
}
 
export default Footer;
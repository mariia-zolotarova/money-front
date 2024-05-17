import './footer.scss'

export default function Footer() {
    return (

        <div className="footer footer__container">
            <div className="footer-socials-side">
                <p className="footer-socials-person">Mariia Zolotarova</p>
                <p>+38 (066) 039 85 73</p>
                {/*<div className="footer__socials">*/}
                {/*    <a href="https://www.linkedin.com/in/mariia-zolotarova-a6b30218a/" target="_blank">*/}
                {/*        <img className="footer__socials-icon" src="./images/footer/linkedin.png" alt="linkedin"/>*/}
                {/*    </a>*/}
                {/*    <a href="https://www.instagram.com/zolotarova_m/" target="_blank">*/}
                {/*        <img className="footer__socials-icon" src="./images/footer/instagram.png" alt="instagram"/>*/}
                {/*    </a>*/}
                {/*    <a href="https://www.facebook.com/profile.php?id=100004796259166" target="_blank">*/}
                {/*        <img className="footer__socials-icon" src="./images/footer/facebook.png" alt="facebook"/>*/}
                {/*    </a>*/}
                {/*    <a href="https://t.me/zolotarova_m" target="_blank">*/}
                {/*        <img className="footer__socials-icon" src="./images/footer/telegram.png" alt="telegrem"/>*/}
                {/*    </a>*/}
                {/*</div>*/}
            </div>
            <div className="footer-beetroot-side">
                <p>Thanks for Beetroot Academy</p>
                <a className="footer__teacher" href="https://www.linkedin.com/in/oleksandr-kolesnik/" target="_blank">
                    <p>Teacher Oleksandr Kolesnik</p></a>
                {/*<a href="https://beetroot.academy/" target="_blank">*/}
                {/*    <img className="footer__socials-beetroot" src="./images/footer/beetroot.png" alt="beetroot" width="90px" height="35px"/>*/}
                {/*</a>*/}
            </div>
        </div>
    )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../design/main.css';
import '../design/colors.css';
import '../design/shapes.css';
import '../design/alignment.css';
import '../design/text.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Bar() {
    const navigate = useNavigate();
    const gotoHome = async (e) => {
        navigate("/homepage");
    }
    const gotoNet = async (e) => {
        navigate("/network");
      }
    return (
        <div className="row navbar">
        <div className="col d-flex rightAlign">
            <div className="navbarContent text bodyText">
                <p onClick={gotoHome} className="navbarConentLink text">Home</p>
                {/* <a href="main.html" className="navbarConentLink text">Home</a> */}
            </div>
            <div className="navbarContent text bodyText">
                <a onClick={gotoNet} className="navbarConentLink text">Groups</a>
            </div>
        </div>
    </div>
    )
}
module.exports = Bar;
// export className Bar {
//     navbar = `
//     <div className="row navbar">
//         <div className="col d-flex rightAlign">
//             <div className="navbarContent text bodyText">
//                 <a href="main.html" className="navbarConentLink text">Home</a>
//             </div>
//             <div className="navbarContent text bodyText">
//                 <a href="network.html" className="navbarConentLink text">Groups</a>
//             </div>
//             <div className="navbarContent text bodyText">
//                 <a href="notification.html" className="navbarConentLink text">Notifications</a>
//             </div>
//             <div className="navbarContent text bodyText">
//                 <a href="job.html" className="navbarConentLink text">Jobs</a>
//             </div>
//             <div className="navbarContent text bodyText">
//                 <a href="profile.html" className="navbarConentLink text">My Profile</a>
//             </div>
//             <div className="navbarContent text ">
//                 <a href="login.html" className="navbarConentLink text">Login</a>
//             </div>
//         </div>
//     </div>
//     `;
//     footer = `
//     <div className="row footer">
//     </div>
//     `;
//   static navbar: any;
//     // window.onload = function(){
//     //     document.getElementById("navbar").innerHTML = navbar;
//     //     document.getElementById("footer").innerHTML = footer;
//     // };
// }
import React from "react";
import "../styles/sidenav.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons/faGreaterThan";
import { faLessThan } from "@fortawesome/free-solid-svg-icons/faLessThan";
import FavModal from "./Modal/FavModal";

const LeftSideNav = ({setShowFav, handleResponse}) => {

    return(
        <div className="sidenav left">
            <div className="sidebarContent">
                <div className="navBrand">
                    <span style={{color: "red"}}>A</span><span style={{color: "white"}}>i</span><span style={{color: "red"}}>FL</span>
                </div>
                <hr></hr>
                <div className="itemContainer">
                    <div className="navItem" onClick={()=>setShowFav(true)}>
                        Favourites
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    );
}

export default LeftSideNav
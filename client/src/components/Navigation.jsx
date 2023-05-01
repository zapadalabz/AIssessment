import { Navbar, Nav, Container } from 'react-bootstrap';
import { googleLogout } from '@react-oauth/google';

const Navigation = ({setUser, setProfile}) => {

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        localStorage.clear();
      };

    return(
    <>
        <Navbar collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href="/"><span style={{color: "red"}}>A</span>i<span style={{color: "red"}}>FL</span></Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className="container-fluid">
                        <Nav.Item>
                            <Nav.Link href='/Teacher'>Teacher</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/'>Student</Nav.Link>
                        </Nav.Item>
                        
                        <Nav.Item className='ms-auto'>
                            <Nav.Link href="/" onClick={logOut}>Sign out</Nav.Link>                         
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>    
    </>
    );
}

export default Navigation